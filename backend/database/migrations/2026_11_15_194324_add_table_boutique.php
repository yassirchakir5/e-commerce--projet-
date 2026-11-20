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
        Schema::create('boutique',function(Blueprint $table){
            $table->id();
            $table->string('nom');
            $table->string('desc');
            $table->string('logo_boutique');
            $table->string('status');
            $table->string('horaire');
            $table->string('numtel');
            $table->string('ville');
            $table->string('email');
            $table->string('status_boutique');
            $table->string('certifiée');
            $table->string('stars');
            $table->string('count_avis');
            $table->string('categorie');
            $table->foreignId('vendeur_id')->constrained('vendeur')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boutique');
    }
};
