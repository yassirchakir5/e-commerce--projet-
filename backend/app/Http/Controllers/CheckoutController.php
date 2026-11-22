<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    private function getBoutiqueVendeurInfo($idBoutique)
    {
        $boutique = DB::table('boutique')->where('id', $idBoutique)->first();
        if (!$boutique) {
            return ['boutique' => null, 'vendeurEmail' => null];
        }

        $vendeurEmail = $boutique->email ?? null;
        $vendeurTableId = $boutique->id_vendeur ?? $boutique->vendeur_id ?? null;

        if (!$vendeurEmail && $vendeurTableId && Schema::hasTable('vendeur')) {
            $vendeurRow = DB::table('vendeur')->where('id', $vendeurTableId)->first();
            if ($vendeurRow && !empty($vendeurRow->utilisateur_id)) {
                $uRow = DB::table('utilisateur')->where('id', $vendeurRow->utilisateur_id)->first();
                $vendeurEmail = $uRow->email ?? null;
            }
        }

        if (!$vendeurEmail) {
            $uId = $boutique->utilisateur_id ?? $boutique->id_utilisateur ?? $boutique->user_id ?? null;
            if ($uId) {
                $uRow = DB::table('utilisateur')->where('id', $uId)->first();
                $vendeurEmail = $uRow->email ?? null;
            }
        }

        return [
            'boutique'     => $boutique,
            'vendeurEmail' => $vendeurEmail,
        ];
    }

    public function getCheckoutData(Request $request)
    {
        $user = $request->user();

        $adresses = DB::table('adresse')
            ->where('utilisateur_id', $user->id)
            ->get();

        $cartes = DB::table('carte')
            ->where('utilisateur_id', $user->id)
            ->get();

        return response()->json([
            'adresses' => $adresses,
            'cartes'   => $cartes,
        ]);
    }

    public function passerCommande(Request $request)
    {
        $request->validate([
            'items'             => 'required|array|min:1',
            'items.*.id'        => 'required|integer|exists:produit,id',
            'items.*.quantite'  => 'required|integer|min:1',
            'methode_paiement'  => 'required|in:carte,livraison',
            'adresse_livraison' => 'required|string|min:3',
            'numero_carte'      => 'required_if:methode_paiement,carte|nullable|string|min:8',
            'nom_titulaire'     => 'required_if:methode_paiement,carte|nullable|string',
            'date_expiration'   => 'required_if:methode_paiement,carte|nullable|string',
            'cvv'               => 'required_if:methode_paiement,carte|nullable|string|min:3|max:4',
        ]);

        $user = $request->user();

        DB::beginTransaction();

        try {
            $clientRecord = DB::table('client')->where('utilisateur_id', $user->id)->first();
            if (!$clientRecord) {
                $clientId = DB::table('client')->insertGetId([
                    'utilisateur_id' => $user->id,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ]);
            } else {
                $clientId = $clientRecord->id;
            }

            $quantitesParProduit = [];
            foreach ($request->items as $item) {
                $idProd = (int) $item['id'];
                $quantitesParProduit[$idProd] = ($quantitesParProduit[$idProd] ?? 0) + (int) $item['quantite'];
            }

            $produitsParBoutique = [];

            foreach ($quantitesParProduit as $idProd => $totalQte) {
                $produit = Produit::lockForUpdate()->findOrFail($idProd);

                if ($produit->stock < $totalQte) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Stock insuffisant pour '{$produit->nom}' (Disponible : {$produit->stock})."
                    ], 400);
                }

                $produitsParBoutique[$produit->id_boutique][] = [
                    'produit'  => $produit,
                    'quantite' => $totalQte,
                ];
            }

            $commandesCreees = [];
            $emailsToSend = [];

            foreach ($produitsParBoutique as $idBoutique => $lignes) {
                $totalBoutique = 0;
                $articlesDetails = [];

                foreach ($lignes as $l) {
                    $sousTotal = $l['produit']->prix * $l['quantite'];
                    $totalBoutique += $sousTotal;

                    $articlesDetails[] = [
                        'nom'           => $l['produit']->nom,
                        'quantite'      => $l['quantite'],
                        'prix_unitaire' => $l['produit']->prix,
                        'sous_total'    => $sousTotal,
                    ];
                }

                $isCarte = $request->methode_paiement === 'carte';
                $modePaiementLabel = $isCarte ? 'Carte Bancaire' : 'Paiement à la livraison';
                $refTransaction = $isCarte ? 'PAY-' . strtoupper(Str::random(10)) : null;

                $commandeId = DB::table('commandes')->insertGetId([
                    'id_client'     => $clientId,
                    'id_boutique'   => $idBoutique,
                    'date_commande' => now(),
                    'total'         => $totalBoutique,
                    'status'        => $isCarte ? 'Payée' : 'En attente',
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]);

                if (Schema::hasTable('paiements')) {
                    DB::table('paiements')->insert([
                        'id_commande'           => $commandeId,
                        'montant'               => $totalBoutique,
                        'mode'                  => $modePaiementLabel,
                        'statut'                => $isCarte ? 'Payé' : 'En attente',
                        'reference_transaction' => $refTransaction,
                        'created_at'            => now(),
                        'updated_at'            => now(),
                    ]);
                }

                foreach ($lignes as $l) {
                    $prod = $l['produit'];
                    $qte  = $l['quantite'];

                    DB::table('ligne_commande')->insert([
                        'id_commande'   => $commandeId,
                        'id_produit'    => $prod->id,
                        'quantite'      => $qte,
                        'prix_unitaire' => $prod->prix,
                        'created_at'    => now(),
                        'updated_at'    => now(),
                    ]);

                    $nouveauStock = max(0, $prod->stock - $qte);
                    DB::table('produit')->where('id', $prod->id)->update([
                        'stock'      => $nouveauStock,
                        'status'     => $nouveauStock === 0 ? 'vendue' : $prod->status,
                        'updated_at' => now(),
                    ]);
                }

                $commandesCreees[] = $commandeId;
                $pdfUrl = url("/api/commande/{$commandeId}/pdf?adresse=" . urlencode($request->adresse_livraison));

                $infoB = $this->getBoutiqueVendeurInfo($idBoutique);
                $boutique = $infoB['boutique'];
                $vendeurEmail = $infoB['vendeurEmail'];

                $emailsToSend[] = [
                    'commandeId'   => $commandeId,
                    'total'        => $totalBoutique,
                    'modePaiement' => $modePaiementLabel,
                    'adresse'      => $request->adresse_livraison,
                    'articles'     => $articlesDetails,
                    'pdfUrl'       => $pdfUrl,
                    'clientEmail'  => $user->email,
                    'clientNom'    => trim(($user->name ?? '') . ' ' . ($user->prenom ?? '')) ?: 'Client',
                    'vendeurEmail' => $vendeurEmail,
                    'vendeurNom'   => $boutique->nom ?? 'Vendeur',
                ];
            }

            DB::commit();

            foreach ($emailsToSend as $mailData) {
                try {
                    if (!empty($mailData['clientEmail'])) {
                        Mail::send('emails.commande_notification', [
                            'destinataireType' => 'client',
                            'nomDestinataire'  => $mailData['clientNom'],
                            'clientNom'        => $mailData['clientNom'],
                            'clientEmail'      => $mailData['clientEmail'],
                            'commandeId'       => $mailData['commandeId'],
                            'total'            => $mailData['total'],
                            'modePaiement'     => $mailData['modePaiement'],
                            'adresse'          => $mailData['adresse'],
                            'articles'         => $mailData['articles'],
                            'pdfUrl'           => $mailData['pdfUrl'],
                        ], function ($msg) use ($mailData) {
                            $msg->to($mailData['clientEmail'])
                                ->subject("Confirmation de votre commande #" . $mailData['commandeId']);
                        });
                    }

                    if (!empty($mailData['vendeurEmail'])) {
                        Mail::send('emails.commande_notification', [
                            'destinataireType' => 'vendeur',
                            'nomDestinataire'  => $mailData['vendeurNom'],
                            'clientNom'        => $mailData['clientNom'],
                            'clientEmail'      => $mailData['clientEmail'],
                            'commandeId'       => $mailData['commandeId'],
                            'total'            => $mailData['total'],
                            'modePaiement'     => $mailData['modePaiement'],
                            'adresse'          => $mailData['adresse'],
                            'articles'         => $mailData['articles'],
                            'pdfUrl'           => $mailData['pdfUrl'],
                        ], function ($msg) use ($mailData) {
                            $msg->to($mailData['vendeurEmail'])
                                ->subject("Nouvelle commande reçue #" . $mailData['commandeId'] . " - " . $mailData['vendeurNom']);
                        });
                    }
                } catch (\Exception $mailEx) {
                    \Log::error("Erreur envoi email commande: " . $mailEx->getMessage());
                }
            }

            return response()->json([
                'message'       => 'Paiement validé !',
                'commandes_id'  => $commandesCreees,
                'pdf_url'       => $emailsToSend[0]['pdfUrl'] ?? null,
                'vendeur_email' => $emailsToSend[0]['vendeurEmail'] ?? 'non trouvé',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors du traitement de la commande.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function getCommandesVendeur(Request $request)
    {
        $user = $request->user();
        $boutiqueIds = [];
        $boutiqueNoms = [];

        $boutiqueCols = Schema::getColumnListing('boutique');

        $vendeur = Schema::hasTable('vendeur')
            ? DB::table('vendeur')->where('utilisateur_id', $user->id)->first()
            : null;

        if ($vendeur) {
            $bQuery = DB::table('boutique');
            $hasCol = false;
            foreach (['id_vendeur', 'vendeur_id'] as $col) {
                if (in_array($col, $boutiqueCols)) {
                    $bQuery->orWhere($col, $vendeur->id);
                    $hasCol = true;
                }
            }
            if ($hasCol) {
                foreach ($bQuery->get() as $b) {
                    $boutiqueIds[] = $b->id;
                    $boutiqueNoms[] = $b->nom ?? '';
                }
            }
        }

        $directQuery = DB::table('boutique');
        $hasDirect = false;
        foreach (['utilisateur_id', 'id_utilisateur', 'user_id', 'id_user', 'id_vendeur', 'vendeur_id'] as $col) {
            if (in_array($col, $boutiqueCols)) {
                $directQuery->orWhere($col, $user->id);
                $hasDirect = true;
            }
        }
        if ($hasDirect) {
            foreach ($directQuery->get() as $b) {
                if (!in_array($b->id, $boutiqueIds)) {
                    $boutiqueIds[] = $b->id;
                    $boutiqueNoms[] = $b->nom ?? '';
                }
            }
        }

        if (empty($boutiqueIds) && Schema::hasTable('produit')) {
            $prodCols = Schema::getColumnListing('produit');
            $pQuery = DB::table('produit');
            $hasProdCol = false;
            foreach (['utilisateur_id', 'id_utilisateur', 'user_id', 'id_vendeur', 'vendeur_id'] as $pCol) {
                if (in_array($pCol, $prodCols)) {
                    $val = ($vendeur && in_array($pCol, ['id_vendeur', 'vendeur_id'])) ? $vendeur->id : $user->id;
                    $pQuery->orWhere($pCol, $val);
                    $hasProdCol = true;
                }
            }
            if ($hasProdCol) {
                $bIdsFromProds = $pQuery->pluck('id_boutique')->unique()->filter()->toArray();
                if (!empty($bIdsFromProds)) {
                    foreach (DB::table('boutique')->whereIn('id', $bIdsFromProds)->get() as $b) {
                        $boutiqueIds[] = $b->id;
                        $boutiqueNoms[] = $b->nom ?? '';
                    }
                }
            }
        }

        if (empty($boutiqueIds)) {
            return response()->json([
                'boutique'  => '',
                'commandes' => [],
                'debug'     => [
                    'user_id'          => $user->id,
                    'user_role'        => $user->role ?? null,
                    'vendeur'          => $vendeur,
                    'boutique_columns' => $boutiqueCols,
                    'boutiques_in_db'  => DB::table('boutique')->get(),
                    'commandes_in_db'  => DB::table('commandes')->select('id', 'id_client', 'id_boutique', 'total', 'status')->get(),
                ]
            ]);
        }

        $commandes = DB::table('commandes')
            ->whereIn('id_boutique', $boutiqueIds)
            ->orderByDesc('id')
            ->get()
            ->map(function ($cmd) {
                $clientRow = DB::table('client')->where('id', $cmd->id_client)->first();
                $uId = $clientRow->utilisateur_id ?? $cmd->id_client;
                $clientUser = DB::table('utilisateur')->where('id', $uId)->first();

                $articles = DB::table('ligne_commande')
                    ->join('produit', 'ligne_commande.id_produit', '=', 'produit.id')
                    ->where('ligne_commande.id_commande', $cmd->id)
                    ->select(
                        'produit.id as id_produit',
                        'produit.nom',
                        'ligne_commande.quantite',
                        'ligne_commande.prix_unitaire'
                    )
                    ->get()
                    ->map(function ($art) {
                        $imgRow = Schema::hasTable('produit_images')
                            ? DB::table('produit_images')->where('id_produit', $art->id_produit)->first()
                                ?? DB::table('produit_images')->where('produit_id', $art->id_produit)->first()
                            : null;
                        $art->image = $imgRow->image ?? $imgRow->path ?? $imgRow->url ?? null;
                        return $art;
                    });

                $paiement = Schema::hasTable('paiements')
                    ? DB::table('paiements')->where('id_commande', $cmd->id)->first()
                    : null;

                $cmd->client_nom = trim(($clientUser->name ?? '') . ' ' . ($clientUser->prenom ?? '')) ?: 'Client';
                $cmd->client_email = $clientUser->email ?? '';
                $cmd->client_tel = $clientUser->numtel ?? '';
                $cmd->client_adresse = $clientUser->addresselocal ?? '';
                $cmd->articles = $articles;
                $cmd->mode_paiement = $paiement->mode ?? ($cmd->status === 'Payée' ? 'Carte Bancaire' : 'Paiement à la livraison');

                return $cmd;
            });

        return response()->json([
            'boutique'  => implode(', ', array_filter($boutiqueNoms)),
            'commandes' => $commandes,
        ]);
    }

    public function updateStatutCommande(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|max:50',
        ]);

        DB::beginTransaction();

        try {
            $commande = DB::table('commandes')->where('id', $id)->first();
            if (!$commande) {
                DB::rollBack();
                return response()->json(['message' => 'Commande introuvable.'], 404);
            }

            $ancienStatut = $commande->status;
            $nouveauStatut = $request->status;

            if ($nouveauStatut === 'Annulée' && $ancienStatut !== 'Annulée') {
                $lignes = DB::table('ligne_commande')->where('id_commande', $id)->get();
                foreach ($lignes as $ligne) {
                    $prod = DB::table('produit')->where('id', $ligne->id_produit)->first();
                    if ($prod) {
                        $stockRestaure = $prod->stock + $ligne->quantite;
                        DB::table('produit')->where('id', $prod->id)->update([
                            'stock'      => $stockRestaure,
                            'status'     => $stockRestaure > 0 ? 'disponible' : $prod->status,
                            'updated_at' => now(),
                        ]);
                    }
                }
            }

            DB::table('commandes')->where('id', $id)->update([
                'status'     => $nouveauStatut,
                'updated_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Statut mis à jour.',
                'status'  => $nouveauStatut,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la mise à jour.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function telechargerPdf(Request $request, $id)
    {
        $commande = DB::table('commandes')->where('id', $id)->first();
        if (!$commande) {
            abort(404, 'Commande introuvable');
        }

        $clientRow = DB::table('client')->where('id', $commande->id_client)->first();
        $userId = $clientRow->utilisateur_id ?? $commande->id_client;
        $client = DB::table('utilisateur')->where('id', $userId)->first();

        if ($client && !isset($client->nom)) {
            $client->nom = $client->name ?? '';
        }

        $boutique = DB::table('boutique')->where('id', $commande->id_boutique)->first();

        $paiement = Schema::hasTable('paiements')
            ? DB::table('paiements')->where('id_commande', $id)->first()
            : null;

        $lignes = DB::table('ligne_commande')
            ->join('produit', 'ligne_commande.id_produit', '=', 'produit.id')
            ->where('ligne_commande.id_commande', $id)
            ->select(
                'produit.nom as nom_produit',
                'ligne_commande.quantite',
                'ligne_commande.prix_unitaire'
            )
            ->get();

        $pdf = Pdf::loadView('pdf.facture_commande', [
            'commande'     => $commande,
            'client'       => $client,
            'boutique'     => $boutique,
            'lignes'       => $lignes,
            'adresse'      => $request->query('adresse', $client->addresselocal ?? 'Adresse client'),
            'modePaiement' => $paiement->mode ?? ($commande->status === 'Payée' ? 'Carte Bancaire' : 'Paiement à la livraison'),
            'reference'    => $paiement->reference_transaction ?? null,
        ]);

        return $pdf->download("Recu_Commande_{$id}.pdf");
    }
}