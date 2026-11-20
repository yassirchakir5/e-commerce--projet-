<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class adresse extends Model
{
    protected $table = "adresse";

    protected $fillable = [
        'title',
        'pays',
        'adresse',
        'utilisateur_id'
    ];

}
