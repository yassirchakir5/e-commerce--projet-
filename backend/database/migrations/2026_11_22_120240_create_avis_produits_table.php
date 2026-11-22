<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produit', function (Blueprint $table) {
            if (!Schema::hasColumn('produit', 'stars')) {
                $table->decimal('stars', 3, 1)->default(0)->after('stock');
            }
            if (!Schema::hasColumn('produit', 'count_avis')) {
                $table->unsignedInteger('count_avis')->default(0)->after('stars');
            }
        });

        Schema::create('avis_produits', function (Blueprint $table) {
            $table->id();$table->foreignId('id_utilisateur')->constrained('utilisateur')->onDelete('cascade');
            $table->foreignId('id_produit')->constrained('produit')->onDelete('cascade');$table->unsignedTinyInteger('note'); 
            $table->timestamps();

            $table->unique(['id_utilisateur', 'id_produit']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avis_produits');
        Schema::table('produit', function (Blueprint $table) {$table->dropColumn(['stars', 'count_avis']);
        });
    }
};