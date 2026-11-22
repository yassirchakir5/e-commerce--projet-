<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Reçu de Commande #{{ $commande->id }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #1e293b; font-size: 13px; }
        .header { background: #0284c7; color: #fff; padding: 20px; border-radius: 6px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 22px; }
        .box { border: 1px solid #cbd5e1; padding: 14px; border-radius: 6px; margin-bottom: 18px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
        th { background: #f1f5f9; }
        .total { text-align: right; font-size: 16px; font-weight: bold; color: #dc2626; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Reçu de Commande N° #{{ $commande->id }}</h1>
        <p style="margin: 4px 0 0;">Date : {{ $commande->date_commande }} | Statut : {{ $commande->status }}</p>
    </div>

    <div class="box">
        <strong>Client :</strong> {{ $client->nom ?? '' }} {{ $client->prenom ?? '' }} ({{ $client->email ?? '' }})<br>
        <strong>Boutique / Vendeur :</strong> {{ $boutique->nom ?? 'Boutique' }}<br>
        <strong>Adresse de livraison :</strong> {{ $adresse }}<br>
        <strong>Mode de paiement :</strong> {{ $modePaiement }}
        @if($reference)
            <br><strong>Référence transaction :</strong> {{ $reference }}
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>Produit</th>
                <th>Prix Unitaire</th>
                <th>Quantité</th>
                <th>Sous-total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($lignes as $ligne)
            <tr>
                <td>{{ $ligne->nom_produit }}</td>
                <td>{{ number_format($ligne->prix_unitaire, 2) }} DH</td>
                <td>{{ $ligne->quantite }}</td>
                <td>{{ number_format($ligne->prix_unitaire * $ligne->quantite, 2) }} DH</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        Total Payé : {{ number_format($commande->total, 2) }} DH
    </div>
</body>
</html>