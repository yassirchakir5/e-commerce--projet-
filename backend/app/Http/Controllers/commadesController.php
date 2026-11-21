<?php

namespace App\Http\Controllers;
use App\Models\commandes;
use App\Models\Client;
use App\Models\Boutique;
use Illuminate\Http\Request;

class commadesController extends Controller
{
    public function afficher($id)
    {
        $client = Client::where('utilisateur_id', $id)
                        ->with('commandes.produits')
                        ->first();

        if (!$client) {
            return response()->json([], 200);
        }

        $commandes = $client->commandes->map(function ($commande) {
            $quantite = $commande->produits->sum('pivot.quantite');
            $total = $commande->produits->sum(function ($produit) {
                return $produit->pivot->quantite * $produit->pivot->prix_unitaire;
            });

            return [
                'numero'           => '#' . ($commande->numero ?? $commande->id),
                'date'             => $commande->created_at ? $commande->created_at->format('d/m/Y') : '',
                'statut'           => $commande->status,
                'total'            => number_format($total, 2, '.', '') . ' MAD',
                'articlesQuantite' => $quantite
            ];
        });

        return response()->json($commandes, 200);
    }
    public function commandesVendeur()
    {
        $boutiqueIds = \App\Models\Boutique::pluck('id'); 

        $commandes = commandes::whereIn('id_boutique', $boutiqueIds)
            ->with('client.utilisateur')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($cmd) {
                return [
                    'id'          => $cmd->id,
                    'numero'      => 'CMD-' . $cmd->id,
                    'id_boutique' => $cmd->id_boutique,
                    'client'      => $cmd->client->utilisateur->email ?? 'Client #' . $cmd->id_client,
                    'date'        => $cmd->created_at ? $cmd->created_at->format('d/m/Y H:i') : '',
                    'mois'        => $cmd->created_at ? (int)$cmd->created_at->format('n') : null, 
                    'montant'     => (float) $cmd->total,
                    'statut'      => $cmd->status, // En-attente, Livrée, Annulée...
                ];
            });

        return response()->json(['commandes' => $commandes], 200);
    }

    public function livrer($id)
    {
        $commande = commandes::findOrFail($id);
        $commande->status = 'Livrée';
        $commande->save();

        return response()->json(['message' => 'Commande marquée comme livrée'], 200);
    }

    public function supprimer($id){
        $commande = commandes::findOrFail($id);
        $commande->delete();

        return response()->json(['message' => 'Commande supprimée'], 200);
    }
}