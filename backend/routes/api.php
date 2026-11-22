<?php

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



Route::middleware('auth:sanctum')->group(function() {
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
});