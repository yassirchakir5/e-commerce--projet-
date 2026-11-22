<?php
use App\Http\Controllers\CheckoutController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\apiAuthController;
use App\Http\Controllers\adresseController;
use App\Http\Controllers\produitController;
use App\Http\Controllers\boutiqueController;
use App\Http\Controllers\demandeVendeurController;
use App\Http\Controllers\categorieController;
use App\Http\Controllers\cartescontroller;
use App\Http\Controllers\commadesController;
use App\Http\Controllers\FavorisController;
use App\Http\Controllers\AdminController;
use App\Models\utilisateur;
use App\Models\Vendeur;
use App\Models\boutique;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\categorie;
use App\Models\Produit;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Str;
use Carbon\Carbon;

Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $user = \App\Models\utilisateur::where('email', $request->email)->first();

    if (!$user) {
        return response()->json([
            'message' => "Aucun compte n'est associé à cette adresse email."
        ], 404);
    }

    if (!Schema::hasTable('password_reset_tokens')) {
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
    }

    $token = Str::random(60);

    DB::table('password_reset_tokens')->updateOrInsert(
        ['email' => $user->email],
        [
            'token'      => Hash::make($token),
            'created_at' => Carbon::now(),
        ]
    );

    $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
    $resetLink = "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($user->email);

    try {
        Mail::send([], [], function ($message) use ($user, $resetLink) {
            $nom = trim(($user->name ?? '') . ' ' . ($user->prenom ?? ''));
            $html = "
                <div style='font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;'>
                    <h2 style='color: #0284c7;'>Réinitialisation de votre mot de passe</h2>
                    <p>Bonjour <strong>{$nom}</strong>,</p>
                    <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau :</p>
                    <div style='text-align: center; margin: 28px 0;'>
                        <a href='{$resetLink}' style='background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;'>
                            Réinitialiser mon mot de passe
                        </a>
                    </div>
                    <p style='color: #64748b; font-size: 13px;'>Ce lien expirera dans 60 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
                </div>
            ";
            $message->to($user->email)
                ->subject('Réinitialisation de votre mot de passe')
                ->html($html);
        });

        return response()->json([
            'message' => 'Un lien de réinitialisation a été envoyé à votre adresse email.'
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => "Erreur lors de l'envoi de l'email. Vérifiez votre configuration SMTP.",
            'error'   => $e->getMessage()
        ], 500);
    }
});

Route::post('/contact-vendeur/{id}', [apiAuthController::class, 'contactVendeur']);

Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'email'                 => 'required|email',
        'token'                 => 'required|string',
        'password'              => 'required|string|min:6|confirmed',
    ]);

    $record = DB::table('password_reset_tokens')
        ->where('email', $request->email)
        ->first();

    if (!$record || !Hash::check($request->token, $record->token)) {
        return response()->json([
            'message' => 'Ce lien de réinitialisation est invalide ou a déjà été utilisé.'
        ], 400);
    }

    if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();
        return response()->json([
            'message' => 'Ce lien a expiré. Veuillez refaire une demande.'
        ], 400);
    }

    $user = \App\Models\utilisateur::where('email', $request->email)->first();
    if (!$user) {
        return response()->json(['message' => 'Utilisateur introuvable.'], 404);
    }

    $user->password = Hash::make($request->password);
    $user->save();

    DB::table('password_reset_tokens')->where('email', $request->email)->delete();

    return response()->json([
        'message' => 'Votre mot de passe a été modifié avec succès ! Redirection vers la connexion...'
    ], 200);
});

Route::get('/admin/boutiques', function () {
    $boutiques = boutique::with(['vendeur.utilisateur', 'produits.images'])
        ->orderByDesc('id')
        ->get();

    return response()->json(['boutiques' => $boutiques]);
});

Route::get('/admin/produits', function () {
    $produits = Produit::with(['boutique', 'categorie', 'images'])
        ->orderByDesc('id')
        ->get();

    return response()->json(['produits' => $produits]);
});

Route::put('/admin/produits/{id}/status', function (Request $request, $id) {
    $produit = Produit::findOrFail($id);
    $produit->status = $request->status;
    $produit->save();
    return response()->json(['produit' => $produit]);
});

Route::put('/admin/profile/{id}', function (Request $request, $id) {
    $admin = utilisateur::findOrFail($id);

    $request->validate([
        'name'     => 'required|string|max:255',
        'prenom'   => 'required|string|max:255',
        'email'    => 'required|email|unique:utilisateur,email,' . $admin->id,
        'numtel'   => 'required|string',
        'password' => 'nullable|min:6',
    ]);

    $admin->name = $request->name;
    $admin->prenom = $request->prenom;
    $admin->email = $request->email;
    $admin->numtel = $request->numtel;

    if (!empty($request->password)) {
        $admin->password = Hash::make($request->password);
    }

    $admin->save();

    return response()->json(['admin' => $admin]);
});

Route::post('/admin/categorie', function (Request $request) {
    $request->validate(['nom' => 'required|string|max:150']);
    $cat = categorie::create(['nom' => $request->nom]);
    return response()->json(['categorie' => $cat], 201);
});

Route::delete('/admin/categorie/{id}', function ($id) {
    categorie::findOrFail($id)->delete();
    return response()->json(['message' => 'Catégorie supprimée']);
});

Route::put('/admin/settings/global-commission', function (Request $request) {
    $request->validate(['commision' => 'required|numeric|min:0|max:100']);
    Vendeur::query()->update(['commision' => $request->commision]);
    return response()->json(['message' => 'Commission globale appliquée']);
});


Route::get('/admin/dashboard', function () {
    return response()->json([
        'stats' => [
            'totalUsers'     => utilisateur::count(),
            'totalVendors'   => Vendeur::count(),
            'totalBoutiques' => boutique::count(),
            'pendingVendors' => Vendeur::where('status', 'en attente')->count(),
        ],
        'vendors' => Vendeur::with(['utilisateur', 'boutiques'])
            ->latest()
            ->take(8)
            ->get(),
        'recentUsers' => utilisateur::latest()
            ->take(6)
            ->get(['id', 'name', 'prenom', 'numtel', 'pays', 'role']),
    ]);
});

Route::put('/admin/vendeurs/{id}/status', function (Request $request, $id) {
    $vendeur = Vendeur::findOrFail($id);
    $vendeur->status = $request->status;
    $vendeur->save();

    if ($request->status === 'validé') {
        utilisateur::where('id', $vendeur->utilisateur_id)->update(['role' => 'vendeur']);
    }

    return response()->json(['vendeur' => $vendeur]);
});



Route::get('/admin/utilisateurs', function () {
    return response()->json([
        'utilisateurs' => utilisateur::orderBy('id', 'desc')->get()
    ]);
});

Route::put('/admin/utilisateurs/{id}/role', function (Request $request, $id) {
    $user = utilisateur::findOrFail($id);
    $user->role = $request->role;
    $user->save();
    return response()->json(['user' => $user]);
});

Route::delete('/admin/utilisateurs/{id}', function ($id) {
    utilisateur::findOrFail($id)->delete();
    return response()->json(['message' => 'Supprimé']);
});

Route::post('/admin/login', [AdminController::class, 'login']);
Route::get('/commande/{id}/pdf', [CheckoutController::class, 'telechargerPdf']);
Route::post('/login', [apiAuthController::class, 'login']);
Route::post('/inscrit', [apiAuthController::class, 'inscrit']);
Route::post('/addadresse', [adresseController::class, 'addadresse']);
Route::get('/utilisateur/{id}/adresse', [adresseController::class, 'addresse']);
Route::delete('/adresse/{id}', [adresseController::class, 'deletadress']);
Route::delete('/carte/delete/{id}', [cartescontroller::class, 'delete']);
Route::put('/carte/modifier/{id}', [cartescontroller::class, 'modifier']);
Route::put('/adresse/{id}', [adresseController::class, 'modifier']);
Route::put('/boutique/modifier/{id}', [boutiqueController::class, 'modifier']);
Route::delete('/boutique/delete/{id}', [boutiqueController::class, 'delete']);
Route::get('/categorie', [categorieController::class, 'afficher']);
Route::delete('/produit/delete/{id}', [produitController::class, 'supprimer']);
Route::put('/produit/modifierstatus/{id}', [produitController::class, 'modifierstatus']);
Route::get('/client/{id}/commandes', [commadesController::class, 'afficher']);
Route::get('/categorie/{nom}/produits', [produitController::class, 'parCategorie']);
Route::get('/boutique/produit/{id}', [produitController::class, 'produitparboutique']);
Route::get('/produit/all', [produitController::class, 'afficherall']);
Route::get('/produit/{id}', [produitController::class, 'afficherparid'])->whereNumber('id');
Route::get('/boutique/all', [boutiqueController::class, 'toutesBoutiques']);
Route::get('/boutique/{id}', [boutiqueController::class, 'afficherboutique']);
Route::get('/profile/{id}', [apiAuthController::class, 'afficherid']);


Route::get('/utilisateurs', [AdminController::class, 'getUtilisateurs']);
Route::put('/utilisateurs/{id}/role', [AdminController::class, 'updateUserRole']);
Route::delete('/utilisateurs/{id}', [AdminController::class, 'deleteUtilisateur']);

Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = \App\Models\utilisateur::findOrFail($id);

    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'Lien invalide'], 403);
    }

    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
    }

    return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/login?verified=1');
})->middleware(['signed'])->name('verification.verify');

Route::get('/admin/vendeurs', function () {
    return response()->json([
        'vendeurs' => Vendeur::with(['utilisateur', 'boutiques'])
            ->orderBy('id', 'desc')
            ->get()
    ]);
});

Route::put('/admin/vendeurs/{id}/commission', function (Request $request, $id) {
    $vendeur = Vendeur::findOrFail($id);
    $vendeur->commision = $request->commision;
    $vendeur->save();
    return response()->json(['vendeur' => $vendeur]);
});

Route::put('/admin/boutiques/{id}/status', function (Request $request, $id) {
    $boutique = boutique::findOrFail($id);
    if ($request->has('status')) {
        $boutique->status = $request->status;
    }
    if ($request->has('certifiée')) {
        $boutique->certifiée = $request->certifiée;
    }
    $boutique->save();
    return response()->json(['boutique' => $boutique]);
});

Route::delete('/admin/vendeurs/{id}', function ($id) {
    $vendeur = Vendeur::findOrFail($id);
    utilisateur::where('id', $vendeur->utilisateur_id)->update(['role' => 'user']);
    $vendeur->delete();
    return response()->json(['message' => 'Vendeur supprimé']);
});

Route::post('/email/resend', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    $user = \App\Models\utilisateur::where('email', $request->email)->first();

    if (! $user) {
        return response()->json(['message' => 'Utilisateur introuvable.'], 404);
    }

    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Cet email est déjà vérifié.'], 400);
    }

    $user->sendEmailVerificationNotification();

    return response()->json(['message' => 'Un nouveau lien de vérification a été envoyé à votre email.'], 200);
})->middleware('throttle:6,1');

Route::post('/email/verification-notification', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email déjà vérifié.'], 400);
    }

    $request->user()->sendEmailVerificationNotification();

    return response()->json(['message' => 'Lien de vérification envoyé !'], 200);
})->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');

Route::middleware(['auth:sanctum', 'verified'])->group(function() {
    Route::get('/me', [apiAuthController::class,'me']);
    Route::post('/logout', [apiAuthController::class,'logout']);
    Route::post('/modifier', [apiAuthController::class,'modifier']);
    Route::delete('/utilisateur/delete', [apiAuthController::class,'delete']);
    Route::get('/vendeur/me', [demandeVendeurController::class,'check']);
    Route::get('/vendeur/demande', [demandeVendeurController::class,'demande']);
    Route::post('/carte/add', [cartescontroller::class, 'addcarte']);
    Route::get('/carte', [cartescontroller::class, 'afficher']);
    Route::post('/boutique', [boutiqueController::class, 'ajouterboutique']);
    Route::get('/boutique', [boutiqueController::class, 'afficher']);
    Route::post('/produit/add', [produitController::class, 'store']);
    Route::get('/produit/afficher', [produitController::class, 'afficher']);
    Route::post('/produit/modifier/{id}', [produitController::class, 'modifier']);
    Route::get('/vendeur/commandes', [commadesController::class, 'commandesVendeur']);
    Route::put('/commande/{id}/livrer', [commadesController::class, 'livrer']);
    Route::delete('/commande/{id}', [commadesController::class, 'supprimer']);
    Route::get('/favoris', [FavorisController::class, 'afficher']);
    Route::post('/favoris/toggle/{id_produit}', [FavorisController::class, 'toggle']);
    Route::post('/boutique/{id}/noter', [boutiqueController::class, 'noterBoutique']);
    Route::post('/produit/{id}/noter', [produitController::class, 'noterProduit']);
    Route::post('/checkout/payer', [CheckoutController::class, 'passerCommande']);
    Route::get('/checkout/data', [CheckoutController::class, 'getCheckoutData']);
    Route::get('/vendeur/commandes', [CheckoutController::class, 'getCommandesVendeur']);
    Route::put('/vendeur/commandes/{id}/status', [CheckoutController::class, 'updateStatutCommande']);
});

Route::get('/admin/commandes', function () {
    $commandes = DB::table('commandes')
        ->orderByDesc('id')
        ->get()
        ->map(function ($cmd) {
            $clientRow = DB::table('client')->where('id', $cmd->id_client)->first();
            $uId = $clientRow->utilisateur_id ?? $cmd->id_client;
            $clientUser = DB::table('utilisateur')->where('id', $uId)->first();

            $boutique = DB::table('boutique')->where('id', $cmd->id_boutique)->first();

            $paiement = Schema::hasTable('paiements')
                ? DB::table('paiements')->where('id_commande', $cmd->id)->first()
                : null;

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

            $cmd->client_nom = trim(($clientUser->name ?? '') . ' ' . ($clientUser->prenom ?? '')) ?: 'Client #' . $cmd->id_client;
            $cmd->client_email = $clientUser->email ?? '';
            $cmd->client_tel = $clientUser->numtel ?? '';
            $cmd->client_adresse = $clientUser->addresselocal ?? '';
            $cmd->boutique_nom = $boutique->nom ?? 'Boutique #' . $cmd->id_boutique;
            $cmd->boutique_ville = $boutique->ville ?? '';
            $cmd->mode_paiement = $paiement->mode ?? ($cmd->status === 'Payée' ? 'Carte Bancaire' : 'Paiement à la livraison');
            $cmd->paiement_statut = $paiement->statut ?? $cmd->status;
            $cmd->reference_transaction = $paiement->reference_transaction ?? null;
            $cmd->articles = $articles;

            return $cmd;
        });

    return response()->json(['commandes' => $commandes]);
});

Route::put('/admin/commandes/{id}/status', function (Request $request, $id) {
    DB::table('commandes')->where('id', $id)->update([
        'status'     => $request->status,
        'updated_at' => now(),
    ]);
    return response()->json(['message' => 'Statut mis à jour']);
});

Route::delete('/admin/commandes/{id}', function ($id) {
    DB::table('ligne_commande')->where('id_commande', $id)->delete();
    DB::table('commandes')->where('id', $id)->delete();
    return response()->json(['message' => 'Commande supprimée']);
});