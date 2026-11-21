<?php

namespace App\Http\Controllers;

use App\Models\categorie;
use Illuminate\Http\Request;

class categorieController extends Controller
{
    public function afficher(){
        $categorie = categorie::all();
        return response()->json(['categorie' => $categorie], 200);
    }
}
