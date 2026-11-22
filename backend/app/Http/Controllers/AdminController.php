<?php

namespace App\Http\Controllers;

use App\Models\utilisateur;
use App\Models\Vendeur;
use App\Models\boutique;
use App\Models\commandes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $admin = utilisateur::where('email', $credentials['email'])
            ->where('role', 'admin')
            ->first();

        if (!$admin || !Hash::check($credentials['password'], $admin->password)) {
            return response()->json([
                'message' => 'Email ou mot de passe administrateur incorrect.'
            ], 401);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion administrateur réussie',
            'admin'   => $admin,
            'token'   => $token
        ], 200);
    }

    public function dashboard()
    {
        $totalRevenus = commandes::whereIn('status', ['Payée', 'Livrée'])->sum('total');

        return response()->json([
            'stats' => [
                'totalUsers'     => utilisateur::count(),
                'totalVendors'   => Vendeur::count(),
                'totalBoutiques' => boutique::count(),
                'pendingVendors' => Vendeur::where('status', 'en attente')->count(),
                'totalCommandes' => commandes::count(),
                'totalRevenus'   => (float) $totalRevenus,
            ],
            'vendors' => Vendeur::with(['utilisateur', 'boutiques'])
                ->latest()
                ->take(8)
                ->get(),
            'recentUsers' => utilisateur::latest()
                ->take(6)
                ->get(['id', 'name', 'prenom', 'email', 'numtel', 'pays', 'role', 'created_at']),
        ], 200);
    }

    public function updateVendeurStatus(Request $request, $id)
    {
        $request->validate([
            'status'    => 'required|string',
            'commision' => 'nullable|numeric|min:0|max:100'
        ]);

        $vendeur = Vendeur::findOrFail($id);
        $vendeur->status = $request->status;
        
        if ($request->has('commision')) {
            $vendeur->commision = $request->commision;
        }
        $vendeur->save();

        if ($request->status === 'validé') {
            utilisateur::where('id', $vendeur->utilisateur_id)->update(['role' => 'vendeur']);
        }

        return response()->json([
            'message' => 'Statut du vendeur mis à jour avec succès',
            'vendeur' => $vendeur
        ], 200);
    }

    public function updateBoutiqueStatus(Request $request, $id)
    {
        $boutique = boutique::findOrFail($id);

        if ($request->has('status')) {
            $boutique->status = $request->status;
        }
        if ($request->has('certifiée')) {
            $boutique->certifiée = $request->certifiée;
        }
        $boutique->save();

        return response()->json([
            'message'  => 'Boutique mise à jour avec succès',
            'boutique' => $boutique
        ], 200);
    }
    public function getUtilisateurs()
{
    $utilisateurs = utilisateur::latest()->get();
    return response()->json(['utilisateurs' => $utilisateurs], 200);
}

    public function updateUserRole(Request $request, $id)
    {
        $request->validate(['role' => 'required|in:user,vendeur,admin']);
        $user = utilisateur::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'Rôle mis à jour', 'user' => $user], 200);
    }

    public function deleteUtilisateur($id)
    {
        $user = utilisateur::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé'], 200);
    }
}