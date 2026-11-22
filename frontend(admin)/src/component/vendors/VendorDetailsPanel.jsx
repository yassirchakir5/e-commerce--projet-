import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Store,
  ShieldCheck,
  Percent,
  Check,
  Image as ImageIcon,
} from 'lucide-react';

const STORAGE_URL = 'http://127.0.0.1:8000/storage/';

const VendorDetailsPanel = ({
  vendor,
  onClose,
  onCommissionUpdate,
  onBoutiqueUpdate,
}) => {
  const [commission, setCommission] = useState(vendor?.commision || 10);

  if (!vendor) return null;

  const user = vendor.utilisateur || {};
  const boutiques = vendor.boutiques || (vendor.boutique ? [vendor.boutique] : []);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${STORAGE_URL}${cleanPath}`;
  };

  const cniRecto = getImageUrl(user.path_CNIfr);
  const cniVerso = getImageUrl(user.path_CNIfv);

  const handleSaveCommission = (e) => {
    e.preventDefault();
    onCommissionUpdate(vendor.id, parseFloat(commission));
  };

  return (
    <div className="inline-details-panel vendor-panel">
      <div className="panel-header">
        <div className="panel-user-title">
          <div className="panel-avatar-fallback">
            {user.name?.[0]}{user.prenom?.[0]}
          </div>
          <div>
            <h3>{user.name} {user.prenom}</h3>
            <span className="text-muted">
              Vendeur #{vendor.id} • Inscrit le{' '}
              {new Date(vendor.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        <button className="close-panel-btn" onClick={onClose}>
          <X size={18} />
          <span>Fermer</span>
        </button>
      </div>

      <div className="vendor-panel-grid">
        <div className="vendor-col">
          <h4 className="section-subtitle">Informations & Commission</h4>
          <div className="panel-info-list">
            <div className="info-row">
              <Mail size={16} />
              <div>
                <small>Email</small>
                <p>{user.email}</p>
              </div>
            </div>
            <div className="info-row">
              <Phone size={16} />
              <div>
                <small>Téléphone</small>
                <p>{user.numtel}</p>
              </div>
            </div>
            <div className="info-row">
              <CreditCard size={16} />
              <div>
                <small>CNI</small>
                <p>{user.CNI || 'N/A'}</p>
              </div>
            </div>
            <div className="info-row">
              <MapPin size={16} />
              <div>
                <small>Localisation</small>
                <p>{user.province}, {user.pays}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveCommission} className="commission-form">
            <label>
              <Percent size={15} /> Taux de commission de la plateforme (%) :
            </label>
            <div className="commission-input-group">
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
              />
              <button type="submit" className="btn-save-comm">
                <Check size={16} /> Appliquer
              </button>
            </div>
          </form>

          <div className="panel-cni-box" style={{ marginTop: 14 }}>
            <h4><ImageIcon size={16} /> Documents CNI</h4>
            <div className="cni-pair">
              <div className="cni-item">
                <span>Recto</span>
                {cniRecto ? (
                  <a href={cniRecto} target="_blank" rel="noreferrer">
                    <img src={cniRecto} alt="CNI Recto" />
                  </a>
                ) : (
                  <div className="no-doc">Non fournie</div>
                )}
              </div>
              <div className="cni-item">
                <span>Verso</span>
                {cniVerso ? (
                  <a href={cniVerso} target="_blank" rel="noreferrer">
                    <img src={cniVerso} alt="CNI Verso" />
                  </a>
                ) : (
                  <div className="no-doc">Non fournie</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="vendor-col">
          <h4 className="section-subtitle">
            <Store size={16} /> Boutiques du vendeur ({boutiques.length})
          </h4>

          {boutiques.length === 0 ? (
            <div className="empty-boutiques">
              Ce vendeur n'a pas encore créé de boutique.
            </div>
          ) : (
            <div className="boutiques-cards-list">
              {boutiques.map((b) => {
                const isCertified = b.certifiée === 'true' || b.certifiée === true;
                const isActive = b.status === 'accepte' || b.status === 'active';

                return (
                  <div key={b.id} className="boutique-admin-card">
                    <div className="boutique-card-top">
                      <div>
                        <div className="boutique-title-row">
                          <h5>{b.nom}</h5>
                          {isCertified && (
                            <span className="certified-badge">
                              <ShieldCheck size={14} /> Certifiée
                            </span>
                          )}
                        </div>
                        <p className="text-muted">
                          {b.categorie} • {b.ville} • {b.numtel}
                        </p>
                      </div>
                      <span className={`badge ${isActive ? 'badge-success' : 'badge-warning'}`}>
                        {isActive ? 'Active' : b.status}
                      </span>
                    </div>

                    <p className="boutique-desc">{b.desc}</p>

                    <div className="boutique-actions-bar">
                      <button
                        type="button"
                        className={`btn-action ${isActive ? 'btn-reject' : 'btn-approve'}`}
                        onClick={() =>
                          onBoutiqueUpdate(b.id, {
                            status: isActive ? 'suspendu' : 'accepte',
                          })
                        }
                      >
                        {isActive ? 'Suspendre boutique' : 'Activer boutique'}
                      </button>

                      <button
                        type="button"
                        className={`btn-certify ${isCertified ? 'active' : ''}`}
                        onClick={() =>
                          onBoutiqueUpdate(b.id, {
                            certifiée: isCertified ? 'false' : 'true',
                          })
                        }
                      >
                        <ShieldCheck size={15} />
                        {isCertified ? 'Retirer certification' : 'Certifier'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsPanel;