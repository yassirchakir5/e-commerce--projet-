<?php

namespace App\Http\Controllers;

use App\Mail\ContactVendeurMail;
use Illuminate\Support\Facades\Mail;
use App\Models\utilisateur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;

class apiAuthController extends Controller
{
    public function inscrit(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|min:2',
            'prenom' => 'required|string|max:255|min:2',
            'email' => 'required|email|max:100|unique:utilisateur,email',
            'password' => 'required|min:8',
            'numtel' => 'required|min:10|max:25',
            'addresselocal' => 'required|string|min:5|max:300',
            'province' => 'required|string',
            'pays' => 'required|string',
            'date_naissance' => 'required|date',
            'CNI' => 'required|string',
            'path_img_profile' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'path_CNIfr' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'path_CNIfv' => 'nullable|image|mimes:jpg,png,jpeg|max:2048'
        ]);

        $path_img = null;
        if ($request->hasFile('path_img_profile')) {
            $ext = $request->file('path_img_profile')->extension();
            $path_img = $request->file('path_img_profile')->storeAs("profiles/{$data['name']}-{$data['prenom']}/img-profile/", 'img-profile.' . $ext , 'public');
        }
        $path_CNIfr = null;
        if ($request->hasFile('path_CNIfr')) {
            $ext = $request->file('path_CNIfr')->extension();
            $path_CNIfr = $request->file('path_CNIfr')->storeAs("profiles/{$data['name']}-{$data['prenom']}/img-CNI/", 'img_CNIfr.' . $ext , 'public');
        }
        $path_CNIfv = null;
        if ($request->hasFile('path_CNIfv')) {
            $ext = $request->file('path_CNIfv')->extension();
            $path_CNIfv = $request->file('path_CNIfv')->storeAs("profiles/{$data['name']}-{$data['prenom']}/img-CNI/", 'img_CNIfv.' . $ext , 'public');
        }

        $user = utilisateur::create([
            'name' => $data['name'],
            'prenom' => $data['prenom'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'numtel' => $data['numtel'],
            'CNI' => $data['CNI'],
            'addresselocal' => $data['addresselocal'],
            'province' => $data['province'],
            'date_naissance' => $data['date_naissance'],
            'pays' => $data['pays'],
            'path_img_profile' => $path_img,
            'path_CNIfr' => $path_CNIfr,
            'path_CNIfv' => $path_CNIfv,
            'role' => "user"
        ]);

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Inscription réussie ! Veuillez vérifier votre boîte email pour activer votre compte.',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $credential = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = utilisateur::where('email', $credential['email'])->first();

        if (! $user || ! Hash::check($credential['password'], $user->password)) {
            return response()->json(['message' => 'Email ou password incorrect'], 401);
        }

        if (is_null($user->email_verified_at)) {
            return response()->json([
                'message' => 'Veuillez vérifier votre adresse email avant de vous connecter.',
                'not_verified' => true
            ], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => "connexion avec succes",
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Deconnexion avec succes'
        ]);
    }

    public function delete(Request $request){
        $user = auth()->user();
        
        $utilisat = utilisateur::find($user->id);
        if(!$utilisat){
            return response()->json([
                'message' => "utilisateur n'existe pas"
            ],404);
        }
        $request->user()->currentAccessToken()->delete();
        $utilisat->delete();
        return response()->json(['message' => "Le compte a été supprimer"],200);
    }

    public function modifier(Request $request){
        $user = auth()->user();

        $utilisateur = utilisateur::find($user->id);

        if(!$utilisateur){
            return response()->json([
                'message' => "utilisateur n'existe pas"
            ],404);
        }
        $path_img = null;
        if ($request->hasFile('path_img_profile')) {
            $ext = $request->file('path_img_profile')->extension();
            $path_img = $request->file('path_img_profile')->storeAs("profiles/{$utilisateur->name}-{$utilisateur->prenom}/img-profile/", 'img-profile.' . $ext , 'public');
        }
        $path_CNIfr = null;
        if ($request->hasFile('path_CNIfr')) {
            $ext = $request->file('path_CNIfr')->extension();
            $path_CNIfr = $request->file('path_CNIfr')->storeAs("profiles/{$utilisateur->name}-{$utilisateur->prenom}/img-CNI/", 'img_CNIfr.' . $ext , 'public');
        }
        $path_CNIfv = null;
        if ($request->hasFile('path_CNIfv')) {
            $ext = $request->file('path_CNIfv')->extension();
            $path_CNIfv = $request->file('path_CNIfv')->storeAs("profiles/{$utilisateur->name }-{$utilisateur->prenom}/img-CNI/", 'img_CNIfv.' . $ext , 'public');
        }
        $utilisateur->name = $request->name;
        $utilisateur->prenom = $request->prenom;
        $utilisateur->email = $request->email;
        if($request->password){
            $utilisateur->password = Hash::make($request->password);
        }
        $utilisateur->numtel = $request->numtel;
        $utilisateur->addresselocal = $request->addresselocal;
        $utilisateur->pays = $request->pays;
        $utilisateur->date_naissance = $request->date_naissance;
        $utilisateur->CNI = $request->CNI;
        if($path_img){
            $utilisateur->path_img_profile = $path_img;
        }
        if($path_CNIfr){
            $utilisateur->path_CNIfr = $path_CNIfr;
        }
        if($path_CNIfv){
            $utilisateur->path_CNIfv = $path_CNIfv;
        }
        $utilisateur->save();
        return response()->json([
            'message' => 'compte a été modifier avec succes',
            'user' => $utilisateur
        ],201);
    }

    public function afficherid($id)
    {
        $utilisateur = utilisateur::with(['vendeur.boutiques.produits'])->findOrFail($id);

        $boutiques = $utilisateur->vendeur ? $utilisateur->vendeur->boutiques : collect([]);

        $rating = $boutiques->count() > 0 ? round($boutiques->avg('stars') ?? 0, 1) : 0;
        $reviewsCount = $boutiques->sum('count_avis') ?? 0;

        $tauxReponse = $utilisateur->vendeur->taux_reponse ?? 100;

        return response()->json([
            'utilisateur' => $utilisateur,
            'stats' => [
                'boutiques_count' => $boutiques->count(),
                'taux_reponse'    => $tauxReponse . '%',
                'rating'          => $rating,
                'reviews_count'   => $reviewsCount,
            ]
        ], 200);
    }

    public function contactVendeur(Request $request, $id)
    {
        $validated = $request->validate([
            'email'       => 'required|email',
            'nom'         => 'required|string|max:255',
            'sujet'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $utilisateur = utilisateur::findOrFail($id);

        Mail::to($utilisateur->email)->send(new ContactVendeurMail($validated));

        return response()->json([
            'message' => 'Message envoyé avec succès au vendeur.'
        ], 200);
    }
}