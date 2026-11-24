<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    public function setStatusAttribute($value)
    {
        $clean = strtolower(trim((string) $value));

        $this->attributes['status'] = match ($clean) {
            'disponible'      => 'Disponible',
            'vendue', 'vendu' => 'Vendue',
            'indisponible'    => 'Indisponible',
            default           => ucfirst($clean),
        };
    }
    public function images(){
        return $this->hasMany(ProduitImages::class, 'id_produit');
    }
    use SoftDeletes;
    protected $table = "produit";

    protected $fillable = ['nom','prix','stock','desc','status','id_categorie','id_boutique'];

    public function boutique()
    {
        return $this->belongsTo(boutique::class, 'id_boutique');
    }

    public function categorie()
    {
        return $this->belongsTo(categorie::class, 'id_categorie');
    }
}
