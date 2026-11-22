<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;

class FavorisController extends Controller
{
    public function toggle(Request $request, $id_produit) {
        Produit::findOrFail($id_produit);

        $result = $request->user()->favoris()->toggle($id_produit);

        $isFavori = count($result['attached']) > 0;

        return response()->json([
            'message' => $isFavori ? 'Ajouté aux favoris' : 'Retiré des favoris',
            'is_favori' => $isFavori
        ], 200);
    }
    public function afficher(Request $request)
    {
        $favoris = $request->user()
            ->favoris()
            ->with(['images', 'boutique', 'categorie'])
            ->latest('favoris.created_at')
            ->get();

        return response()->json([
            'favoris' => $favoris
        ], 200);
    }
}
