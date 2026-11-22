<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 20px; color: #1e293b;">
    <div style="max-width: 640px; margin: auto; background: #ffffff; border-radius: 12px; padding: 28px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0284c7; margin-top: 0;">
            {{ $destinataireType === 'vendeur' ? 'Nouvelle commande reçue dans votre boutique !' : 'Confirmation de votre commande !' }}
        </h2>

        <p style="font-size: 15px; line-height: 1.6;">
            @if($destinataireType === 'vendeur')
                Bonjour <strong>{{ $nomDestinataire }}</strong>, le client <strong>{{ $clientNom }}</strong> ({{ $clientEmail }}) vient de commander les produits suivants (<strong>Commande N° #{{ $commandeId }}</strong>) :
            @else
                Bonjour <strong>{{ $nomDestinataire }}</strong>, merci pour votre achat ! Voici le récapitulatif de votre commande (<strong>N° #{{ $commandeId }}</strong>) :
            @endif
        </p>

        <div style="background: #f1f5f9; padding: 14px; border-radius: 8px; margin: 18px 0; font-size: 14px; line-height: 1.7;">
            <div><strong>Client :</strong> {{ $clientNom }} ({{ $clientEmail }})</div>
            <div><strong>Adresse de livraison :</strong> {{ $adresse }}</div>
            <div><strong>Mode de paiement :</strong> {{ $modePaiement }}</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <thead>
                <tr style="background: #0284c7; color: #ffffff;">
                    <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1;">Produit</th>
                    <th style="padding: 10px; text-align: center; border: 1px solid #cbd5e1;">Quantité</th>
                    <th style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">Prix Unitaire</th>
                    <th style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">Sous-total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($articles as $art)
                <tr>
                    <td style="padding: 10px; border: 1px solid #cbd5e1;">{{ $art['nom'] }}</td>
                    <td style="padding: 10px; text-align: center; border: 1px solid #cbd5e1;">{{ $art['quantite'] }}</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">{{ number_format($art['prix_unitaire'], 2) }} DH</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1; font-weight: bold;">{{ number_format($art['sous_total'], 2) }} DH</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr style="background: #fef2f2;">
                    <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; border: 1px solid #cbd5e1;">Total :</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; color: #dc2626; font-size: 16px; border: 1px solid #cbd5e1;">
                        {{ number_format($total, 2) }} DH
                    </td>
                </tr>
            </tfoot>
        </table>

        <div style="text-align: center; margin: 28px 0;">
            <a href="{{ $pdfUrl }}"
               style="background: #dc2626; color: #ffffff; padding: 14px 26px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Télécharger le reçu PDF complet
            </a>
        </div>
    </div>
</body>
</html>