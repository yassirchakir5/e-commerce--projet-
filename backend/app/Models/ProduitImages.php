<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProduitImages extends Model
{
    protected $fillable = ['path','is_main', 'id_produit'];

    public function produit(){
        return $this->belongsTo(Produit::class, 'id_produit');
    }
}
