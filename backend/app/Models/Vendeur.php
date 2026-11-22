<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendeur extends Model
{
    protected $table = 'vendeur';

    public function utilisateur()
    {
        return $this->belongsTo(utilisateur::class, 'utilisateur_id');
    }

    public function boutiques()
    {
        return $this->hasMany(boutique::class, 'vendeur_id');
    }

    protected $fillable = [
        'commision',
        'status',
        'utilisateur_id'
    ];
}
