<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();$table->unsignedBigInteger('id_commande');
            $table->decimal('montant', 10, 2);$table->string('mode');  
            $table->string('statut');
            $table->string('reference_transaction')->nullable();$table->timestamps();

            $table->foreign('id_commande')->references('id')->on('commandes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};