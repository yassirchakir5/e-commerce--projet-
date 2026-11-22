<?php

namespace App\Models;

use App\Models\Produit;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class utilisateur extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'utilisateur';

    protected $fillable = [
        'name',
        'prenom',
        'email',
        'password',
        'numtel',
        'CNI',
        'addresselocal',
        'province',
        'date_naissance',
        'pays',
        'path_img_profile',
        'path_CNIfv',
        'path_CNIfr',
        'role'
    ];

    public function favoris(){
        return $this->belongsToMany(Produit::class, 'favoris','id_utilisateur','id_produit')->withTimestamps();
    }
    public function vendeur()
    {
        return $this->hasOne(Vendeur::class, 'utilisateur_id');
    }

    protected $hidden = [
        'password',
    ];
}