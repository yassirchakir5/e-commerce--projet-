<?php

namespace App\Http\Controllers;

use App\Models\boutique;
use App\Models\Vendeur;
use Illuminate\Http\Request;

class boutiqueController extends Controller
{
    public function ajouterboutique(Request $request){
        $user = auth()->user();

        $vendeur = Vendeur::where('utilisateur_id',$user->id)->first();

        if(!$vendeur){
            return response()->json(['message' => "L'utilisateur non enregistré comme vendeur"],403);
        }

        $data = $request->validate([
            'nom' => 'required|string|min:5|max:150',
            'desc' => 'required|string|min:20|max:255',
            'ville' => 'required|string|min:5|max:100',
            'categorie' => 'required|string',
            'logo_boutique' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'numtel' => 'required|string|min:10|max:50',
            'email' => 'required|email|max:200'
        ], [
            'nom.required' => 'Le nom de la boutique est obligatoire.',
            'nom.min' => 'Le nom doit contenir au moins 5 caractères.',
            'desc.required' => 'La description est obligatoire.',
            'desc.min' => 'La description doit contenir au moins 20 caractères.',
            'ville.required' => 'La ville est obligatoire.',
            'ville.min' => 'La ville doit contenir au moins 5 caractères.',
            'categorie.required' => 'Veuillez choisir une catégorie.',
            'numtel.required' => 'Le numéro de téléphone est obligatoire.',
            'numtel.min' => 'Le numéro doit contenir au moins 10 chiffres.',
            'email.required' => "L'adresse email est obligatoire.",
            'email.email' => "Format d'email invalide.",
            'logo_boutique.image' => 'Le fichier doit être une image.',
            'logo_boutique.max' => "L'image ne doit pas dépasser 2 Mo."
        ]);

        $logo_boutique = null;
        if($request->hasFile('logo_boutique')){
            $ext = $request->file('logo_boutique')->extension();
            $logo_boutique = $request->file('logo_boutique')->storeAs("profiles/{$user->name}-{$user->prenom}/Boutiques/{$data['nom']}/logo/","{$data['nom']}." . $ext , 'public');
        }

        $boutique = boutique::create([
            'nom' => $data['nom'],
            'desc' => $data['desc'],
            'logo_boutique' => $logo_boutique,
            'status' => "en attente",
            'horaire' =>  "jj",
            'numtel' => $data['numtel'],
            'ville' => $data['ville'],
            'email' => $data['email'],
            'categorie' => $data['categorie'],
            'vendeur_id' => $vendeur->id,
            'status_boutique' => "Fermée",
            'certifiée' => 'false',
            'stars' => 0,
            'count_avis' => 0
        ]);

        return response()->json([
            'boutique' => $boutique
        ],201);
    }

    public function toutesBoutiques(){
        $boutiques = boutique::withCount('produits')->get();
        return response()->json([
            'boutiques' => $boutiques
        ], 200);
    }
    public function afficher(){
        $user = auth()->user();

        $vendeur = Vendeur::where('utilisateur_id',$user->id)->first();

        $exist = boutique::withCount('produits')->where('vendeur_id',$vendeur->id)->get();

        return response()->json([
            'boutiques' => $exist
        ],200);
    }
    public function modifier(Request $request,$id){
        $boutique = boutique::find($id);
        if(!$boutique){
            return response()->json(['message' => 'Boutique introuvable'],404);
        }
        $boutique->nom = $request->nom;
        $boutique->desc = $request->desc;
        $boutique->status_boutique = $request->status_boutique;
        $boutique->numtel = $request->numtel;
        $boutique->ville = $request->ville;
        $boutique->save();
        return response()->json([
            'message' => 'enregistre avec succee'
        ],200);
    }
    public function delete($id){
        $boutique = boutique::find($id);
        if(!$boutique){
            return response()->json(['message' => 'Boutique introuvable'],404);
        }
        $boutique->delete();
        return response()->json([
            'message' => 'La boutique a été supprimer avec succes'
        ],200);
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'id_client');
    }

    public function utilisateur()
    {
        return $this->belongsTo(utilisateur::class, 'utilisateur_id');
    }

    public function afficherboutique($id){
        $boutique = boutique::withCount('produits')->findOrFail($id);
        return response()->json([
            'boutique' => $boutique
        ],200);
    }
}
