import React from 'react';
import { X, Package, Store, MapPin, Phone, Mail, ShieldCheck, Star } from 'lucide-react';

const STORAGE_URL = 'http://127.0.0.1:8000/storage/';

const BoutiqueProductsPanel = ({ boutique, onClose }) => {
  if (!boutique) return null;

  const getImg = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${STORAGE_URL}${path.startsWith('/') ? path.slice(1) : path}`;
  };

  const logoUrl = getImg(boutique.logo_boutique);
  const produits = boutique.produits || [];

  return (
    <div className="inline-details-panel" style={{ borderColor: '#0284c7' }}>
      <div className="panel-header">
        <div className="panel-user-title">
          {logoUrl ? (
            <img src={logoUrl} alt={boutique.nom} className="panel-avatar-img" />
          ) : (
            <div className="panel-avatar-fallback">
              <Store size={24} />
            </div>
          )}
          <div>
            <h3 className="flex-align">
              {boutique.nom}
              {(boutique.certifiée === 'true' || boutique.certifiée === true) && (
                <ShieldCheck size={18} className="verified-icon" title="Certifiée" />
              )}
            </h3>
            <span className="text-muted flex-align" style={{ gap: 12, marginTop: 4 }}>
              <span><MapPin size={13} /> {boutique.ville}</span>
              <span><Phone size={13} /> {boutique.numtel}</span>
              <span><Mail size={13} /> {boutique.email}</span>
              <span><Star size={13} color="#f59e0b" /> {boutique.stars || 0} ({boutique.count_avis || 0} avis)</span>
            </span>
          </div>
        </div>

        <button className="close-panel-btn" onClick={onClose}>
          <X size={18} />
          <span>Fermer</span>
        </button>
      </div>

      <div>
        <h4 className="section-subtitle">
          <Package size={17} /> Produits de la boutique ({produits.length})
        </h4>

        {produits.length === 0 ? (
          <div className="empty-boutiques">
            Cette boutique n'a publié aucun produit pour le moment.
          </div>
        ) : (
          <div className="boutique-products-grid">
            {produits.map((prod) => {
              const images = prod.images || [];
              const mainImg = images[0]?.image || images[0]?.path || images[0]?.url || prod.image;

              return (
                <div key={prod.id} className="mini-product-card">
                  <div className="mini-prod-img-box">
                    {getImg(mainImg) ? (
                      <img src={getImg(mainImg)} alt={prod.nom} />
                    ) : (
                      <div className="no-prod-img"><Package size={24} /></div>
                    )}
                    <span className={`prod-stock-badge ${prod.stock > 0 ? 'in' : 'out'}`}>
                      {prod.stock > 0 ? `Stock: ${prod.stock}` : 'Épuisé'}
                    </span>
                  </div>

                  {images.length > 1 && (
                    <div className="mini-gallery-strip">
                      {images.map((imgObj, i) => {
                        const src = getImg(imgObj.image || imgObj.path || imgObj.url);
                        return src ? (
                          <a key={i} href={src} target="_blank" rel="noreferrer">
                            <img src={src} alt={`${prod.nom}-${i}`} />
                          </a>
                        ) : null;
                      })}
                    </div>
                  )}

                  <div className="mini-prod-info">
                    <h5>{prod.nom}</h5>
                    <div className="mini-prod-footer">
                      <strong>{Number(prod.prix).toFixed(2)} MAD</strong>
                      <span className="text-muted">{prod.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoutiqueProductsPanel;