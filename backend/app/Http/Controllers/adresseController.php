<?php

namespace App\Http\Controllers;

use App\Models\adresse;
use Illuminate\Http\Request;

class adresseController extends Controller
{
    public function addadresse(Request $request){
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'pays' => 'required|string',
            'utilisateur_id' => 'required',
            'adresse' => 'required'
        ]);

        $adresse = adresse::create([
            'title' => $data['title'],
            'adresse' => $data['adresse'],
            'pays' => $data['pays'],
            'utilisateur_id' => $data['utilisateur_id']
        ]);
        return response()->json([
            'adresse' => $adresse
        ],201);
    }

    public function addresse($id){
        $adresse = adresse::where('utilisateur_id',$id)->get();
        return response()->json($adresse);
    }

    public function deletadress($id){
        $dele = adresse::where('id',$id)->delete();
        if($dele == 0){
            return response()->json(['message' => 'introuvable adresse'], 404);
        }
        return response()->json(['message' => 'delete avec succes']);
    }
    public function modifier(Request $request,$id){
        $adresse = adresse::find($id);
        if(!$adresse){
            return response()->json(['message' => 'adresse introuvable'],404);
        }
        $adresse->title = $request->title;
        $adresse->adresse = $request->adresse;
        $adresse->pays = $request->pays;
        $adresse->save();
        return response()->json($adresse,200);
    }
    
}
