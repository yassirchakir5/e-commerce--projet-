<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('produit',function(Blueprint $table){
            $table->id();
            $table->string('nom');
            $table->decimal('prix', 8, 2);
            $table->integer('stock');
            $table->string('desc');
            $table->string('status');
            $table->foreignId('id_categorie')->constrained('categorie')->cascadeOnDelete();
            $table->foreignId('id_boutique')->constrained('boutique')->cascadeOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produit');
    }
};
