<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class boutique extends Model
{
    protected $table = "boutique";

    protected $fillable = [
        'nom',
        'desc',
        'logo_boutique',
        'status',
        'horaire',
        'numtel',
        'ville',
        'email',
        'categorie',
        'vendeur_id',
        'status_boutique',
        'certifiée',
        'stars',
        'count_avis'
    ];
}
