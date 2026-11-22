import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, CreditCard, Shield } from 'lucide-react';

const STORAGE_URL = 'http://127.0.0.1:8000/storage/';

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Détails de l'utilisateur</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="profile-banner">
            {user.path_img_profile ? (
              <img
                src={`${STORAGE_URL}${user.path_img_profile}`}
                alt={user.name}
                className="profile-img-large"
              />
            ) : (
              <div className="avatar-large">
                {user.name?.[0]}{user.prenom?.[0]}
              </div>
            )}
            <div>
              <h4>{user.name} {user.prenom}</h4>
              <span className={`role-tag role-${user.role?.toLowerCase()}`}>
                <Shield size={12} style={{ marginRight: 4 }} />
                {user.role}
              </span>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <Mail size={16} />
              <div>
                <small>Email</small>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="detail-item">
              <Phone size={16} />
              <div>
                <small>Téléphone</small>
                <p>{user.numtel}</p>
              </div>
            </div>

            <div className="detail-item">
              <CreditCard size={16} />
              <div>
                <small>Numéro CNI</small>
                <p>{user.CNI || 'Non renseigné'}</p>
              </div>
            </div>

            <div className="detail-item">
              <Calendar size={16} />
              <div>
                <small>Date de naissance</small>
                <p>{user.date_naissance || 'N/A'}</p>
              </div>
            </div>

            <div className="detail-item full-span">
              <MapPin size={16} />
              <div>
                <small>Adresse & Localisation</small>
                <p>{user.addresselocal} — {user.province}, {user.pays}</p>
              </div>
            </div>
          </div>

          <div className="cni-section">
            <h5>Documents d'identité (CNI)</h5>
            <div className="cni-images-grid">
              <div className="cni-card">
                <span>Recto (Face avant)</span>
                {user.path_CNIfr ? (
                  <img src={`${STORAGE_URL}${user.path_CNIfr}`} alt="CNI Recto" />
                ) : (
                  <div className="no-doc">Image non fournie</div>
                )}
              </div>

              <div className="cni-card">
                <span>Verso (Face arrière)</span>
                {user.path_CNIfv ? (
                  <img src={`${STORAGE_URL}${user.path_CNIfv}`} alt="CNI Verso" />
                ) : (
                  <div className="no-doc">Image non fournie</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;