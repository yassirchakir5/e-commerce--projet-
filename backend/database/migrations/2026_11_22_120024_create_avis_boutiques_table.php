<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('avis_boutiques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_utilisateur')->constrained('utilisateur')->onDelete('cascade');
            $table->foreignId('id_boutique')->constrained('boutique')->onDelete('cascade');
            $table->unsignedTinyInteger('note'); 
            $table->timestamps();

            $table->unique(['id_utilisateur', 'id_boutique']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avis_boutiques');
    }
};