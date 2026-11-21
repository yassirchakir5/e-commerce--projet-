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
});