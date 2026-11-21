<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = 'client';

    public function commandes()
    {
        return $this->hasMany(commandes::class, 'id_client');
    }
    public function utilisateur()
    {
        return $this->belongsTo(utilisateur::class, 'utilisateur_id');
    }
}