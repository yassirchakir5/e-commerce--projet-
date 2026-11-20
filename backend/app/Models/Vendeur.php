<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendeur extends Model
{
    protected $table = 'vendeur';

    protected $fillable = [
        'commision',
        'status',
        'utilisateur_id'
    ];
}
