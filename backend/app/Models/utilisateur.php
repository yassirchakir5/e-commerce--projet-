<?php

namespace App\Models;

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


    protected $hidden = [
        'password',
    ];
}