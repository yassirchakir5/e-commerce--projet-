import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, CreditCard, Shield, Image as ImageIcon } from 'lucide-react';

const STORAGE_URL = 'http://127.0.0.1:8000/storage/';

const UserDetailsPanel = ({ user, onClose }) => {
  if (!user) return null;

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${STORAGE_URL}${cleanPath}`;
  };

  const profileImg = getImageUrl(user.path_img_profile);
  const cniRecto = getImageUrl(user.path_CNIfr);
  const cniVerso = getImageUrl(user.path_CNIfv);

  return (
    <div className="inline-details-panel">
      <div className="panel-header">
        <div className="panel-user-title">
          {profileImg ? (
            <img src={profileImg} alt={user.name} className="panel-avatar-img" />
          ) : (
            <div className="panel-avatar-fallback">
              {user.name?.[0]}{user.prenom?.[0]}
            </div>
          )}
          <div>
            <h3>{user.name} {user.prenom}</h3>
            <span className={`role-tag role-${user.role?.toLowerCase()}`}>
              <Shield size={12} style={{ marginRight: 4 }} />
              {user.role} (ID #{user.id})
            </span>
          </div>
        </div>

        <button className="close-panel-btn" onClick={onClose}>
          <X size={18} />
          <span>Fermer</span>
        </button>
      </div>

      <div className="panel-content-grid">
        <div className="panel-info-list">
          <div className="info-row">
            <Mail size={16} />
            <div>
              <small>Adresse Email</small>
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
              <small>Numéro CNI</small>
              <p>{user.CNI || 'Non renseigné'}</p>
            </div>
          </div>

          <div className="info-row">
            <Calendar size={16} />
            <div>
              <small>Date de naissance</small>
              <p>{user.date_naissance || 'N/A'}</p>
            </div>
          </div>

          <div className="info-row">
            <MapPin size={16} />
            <div>
              <small>Adresse & Localisation</small>
              <p>{user.addresselocal} — {user.province}, {user.pays}</p>
            </div>
          </div>
        </div>

        <div className="panel-cni-box">
          <h4><ImageIcon size={16} /> Documents d'identité (CNI)</h4>
          <div className="cni-pair">
            <div className="cni-item">
              <span>Recto (Face avant)</span>
              {cniRecto ? (
                <a href={cniRecto} target="_blank" rel="noreferrer">
                  <img src={cniRecto} alt="CNI Recto" />
                </a>
              ) : (
                <div className="no-doc">Image non fournie</div>
              )}
            </div>

            <div className="cni-item">
              <span>Verso (Face arrière)</span>
              {cniVerso ? (
                <a href={cniVerso} target="_blank" rel="noreferrer">
                  <img src={cniVerso} alt="CNI Verso" />
                </a>
              ) : (
                <div className="no-doc">Image non fournie</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPanel;