<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cartes extends Model
{
    protected $table = "carte";
    
    protected $fillable = [
        'nom',
        'numC',
        'dateEx',
        'CVV',
        'utilisateur_id'
    ];
}
