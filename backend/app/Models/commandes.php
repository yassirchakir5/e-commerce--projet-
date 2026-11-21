<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class commandes extends Model
{
    protected $table = 'commandes';

    public function produits()
    {
        return $this->belongsToMany(
            Produit::class,    
            'ligne_commande',
            'id_commande', 
            'id_produit'
        )->withPivot('quantite', 'prix_unitaire');
    }
    public function client()
    {
        return $this->belongsTo(Client::class, 'id_client');
    }
}