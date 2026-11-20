<?php

namespace App\Http\Controllers;

use App\Models\Vendeur;
use Illuminate\Http\Request;

class demandeVendeurController extends Controller
{
    public function check(){
        $user = auth()->user();

        $vendeur = Vendeur::where('utilisateur_id', $user->id)->first();

        if(!$vendeur){
            return response()->json([
                'existe' => false,
                'status' => null
            ],404);
        }
        return response()->json([
            'existe' => true,
            'status' => $vendeur->status,
            'vendeur' => $vendeur
        ]);
    }
    public function demande() {
    $user = auth()->user();

    $existing = Vendeur::where('utilisateur_id', $user->id)->first();
    if ($existing) {
        return response()->json([
            'existe' => true,
            'status' => $existing->status,
            'vendeur' => $existing
        ], 200);
    }

    $vendeur = Vendeur::create([
        'commision' => 10,
        'status' => 'en attente',
        'utilisateur_id' => $user->id
    ]);

    return response()->json([
        'existe' => true,
        'status' => $vendeur->status,
        'vendeur' => $vendeur
    ], 201);
}
}
