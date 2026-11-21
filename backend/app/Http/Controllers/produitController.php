<?php

namespace App\Http\Controllers;

use App\Models\Vendeur;
use App\Models\Produit;
use App\Models\boutique;
use Illuminate\Http\Request;

class produitController extends Controller
{
    public function store(Request $request){
        $user = $request->user();

        $request->validate([
            'nom' => 'required|string',
            'prix' => 'required|numeric',
            'stock' => 'required|integer',
            'desc' => 'required|max:255',
            'id_categorie' => 'required|exists:categorie,id',
            'id_boutique' => 'required|exists:boutique,id',
            "status" => 'required|string',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,jpg,webp,png|max:2048'
        ]);
        $produit = Produit::create($request->only(['nom','prix','status','desc','stock','id_categorie','id_boutique']));
        $boutique = boutique::findOrFail($request->id_boutique);

        if($request->hasFile('images')){
            foreach($request->file('images') as $index => $image){
                $extension = $image->extension();

                $filename = time() . "_" . uniqid() . "." . $extension;


                $path = $image->storeAs("profiles/{$user->name}-{$user->prenom}/Boutiques/{$boutique->nom}/products/{$request->nom}/",$filename,'public');

                $produit->images()->create([
                    'path' => $path,
                    'is_main' => $index === 0
                ]);
            }
        }
        return response()->json(['message' => 'le produit a été ajoute avec success'],200);
    }
    public function afficher(Request $request){
        $user = $request->user();

        $vendeur = Vendeur::where('utilisateur_id', $user->id)->firstOrFail();

        $boutiqueIds = boutique::where('vendeur_id', $vendeur->id)->pluck('id');

        $produits = Produit::with(['images', 'boutique', 'categorie'])
                        ->whereIn('id_boutique', $boutiqueIds)
                        ->latest()
                        ->get();

        return response()->json([
            'produits' => $produits
        ], 200);
    }
}
