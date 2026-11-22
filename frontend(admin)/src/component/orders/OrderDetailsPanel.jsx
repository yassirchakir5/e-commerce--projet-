import React from 'react';
import {
  X,
  User,
  Store,
  CreditCard,
  MapPin,
  Package,
  FileText,
  Calendar,
} from 'lucide-react';

const STORAGE_URL = 'http://127.0.0.1:8000/storage/';
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const OrderDetailsPanel = ({ order, onClose }) => {
  if (!order) return null;

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${STORAGE_URL}${cleanPath}`;
  };

  return (
    <div className="inline-details-panel order-panel">
      <div className="panel-header">
        <div className="panel-user-title">
          <div className="panel-avatar-fallback" style={{ background: '#0f172a' }}>
            #{order.id}
          </div>
          <div>
            <h3>Commande #{order.id}</h3>
            <span className="text-muted flex-align">
              <Calendar size={14} /> Passée le {order.date_commande}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href={`${API_BASE_URL}/commande/${order.id}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="btn-pdf-download"
          >
            <FileText size={16} />
            <span>Facture PDF</span>
          </a>

          <button className="close-panel-btn" onClick={onClose}>
            <X size={18} />
            <span>Fermer</span>
          </button>
        </div>
      </div>

      <div className="order-panel-grid">
        <div className="order-info-col">
          <h4 className="section-subtitle">Informations Générales</h4>
          <div className="panel-info-list">
            <div className="info-row">
              <User size={16} />
              <div>
                <small>Client</small>
                <p>{order.client_nom}</p>
                <span className="text-muted">{order.client_email} • {order.client_tel}</span>
              </div>
            </div>

            <div className="info-row">
              <Store size={16} />
              <div>
                <small>Boutique Vendeur</small>
                <p>{order.boutique_nom}</p>
                <span className="text-muted">{order.boutique_ville}</span>
              </div>
            </div>

            <div className="info-row">
              <CreditCard size={16} />
              <div>
                <small>Paiement ({order.mode_paiement})</small>
                <p>{order.paiement_statut}</p>
                {order.reference_transaction && (
                  <span className="text-muted">Réf: {order.reference_transaction}</span>
                )}
              </div>
            </div>

            <div className="info-row">
              <MapPin size={16} />
              <div>
                <small>Adresse du client</small>
                <p>{order.client_adresse || 'Non renseignée'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-articles-col">
          <h4 className="section-subtitle">
            <Package size={16} /> Articles commandés ({order.articles?.length || 0})
          </h4>

          <div className="articles-list-box">
            {order.articles?.map((art, idx) => {
              const imgUrl = getImageUrl(art.image);
              const sousTotal = (art.quantite * art.prix_unitaire).toFixed(2);

              return (
                <div key={idx} className="article-item-row">
                  <div className="article-left">
                    {imgUrl ? (
                      <img src={imgUrl} alt={art.nom} className="article-thumb" />
                    ) : (
                      <div className="article-thumb-placeholder">
                        <Package size={18} />
                      </div>
                    )}
                    <div>
                      <div className="font-bold">{art.nom}</div>
                      <div className="text-muted">
                        {art.quantite} x {Number(art.prix_unitaire).toFixed(2)} MAD
                      </div>
                    </div>
                  </div>
                  <div className="article-subtotal">{sousTotal} MAD</div>
                </div>
              );
            })}

            <div className="order-total-footer">
              <span>Total de la commande :</span>
              <strong>{Number(order.total).toFixed(2)} MAD</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPanel;