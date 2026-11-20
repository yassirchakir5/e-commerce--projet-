<?php

namespace App\Http\Controllers;

use App\Models\cartes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class cartescontroller extends Controller
{
    public function addcarte(Request $request){
        $user = auth()->user();
        $validator = Validator::make($request->all(),[
            'nom' => 'required|string',
            'numC' => 'required|digits:16',
            'dateEx' => 'required',
            'CVV' => 'required|digits:3'
        ],[
            'numC.digits' => 'Le numéro de carte doit contenir exactement 16 chiffres.'
        ]);
        if($validator->fails()){
            return response()->json([
                'message' => 'erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }
        $data = $validator->validated();

        $cartes = cartes::create([
            'nom' => $data['nom'],
            'numC' => $data['numC'],
            'dateEx' => $data['dateEx'],
            'CVV' => $data['CVV'],
            'utilisateur_id' => $user->id
        ]);
        return response()->json([
            'carte' => $cartes
        ],201);
    }

    public function afficher(){
        $user = auth()->user();

        $existing = cartes::where('utilisateur_id',$user->id)->get();

        return response()->json([
            'cartes' => $existing
        ],200);
    }
    public function delete($id){
        $delet = cartes::where('id',$id)->delete();
        if($delet === 0){
            return response()->json(['message' => 'carte introuvable'],404);
        }
        return response()->json(['message' => 'cartes a été supprimer avec succes'],200);
    }

    public function modifier(Request $request,$id){
        $cart = cartes::find($id);
        if($cart === 0){
            return response()->json([
                'message' => 'carte introuvable'
            ],404);
        }
        $cart->nom = $request->nom;
        $cart->numC = $request->numC;
        $cart->dateEx = $request->dateEx;
        $cart->CVV = $request->CVV;
        $cart->save();
        return response()->json($cart,200);
    }

}
