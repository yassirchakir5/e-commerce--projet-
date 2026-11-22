import React from 'react';
import { CheckCircle, XCircle, Clock, ShieldCheck } from 'lucide-react';

const RecentVendorsTable = ({ vendors, onStatusChange }) => {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepte':
      case 'accepté':
      case 'validé':
        return (
          <span className="badge badge-success">
            <CheckCircle size={14} /> Validé
          </span>
        );
      case 'rejeté':
      case 'suspendu':
        return (
          <span className="badge badge-danger">
            <XCircle size={14} /> Suspendu
          </span>
        );
      default:
        return (
          <span className="badge badge-warning">
            <Clock size={14} /> En attente
          </span>
        );
    }
  };

  return (
    <div className="dashboard-card table-card">
      <div className="card-header">
        <h2>Demandes & Vendeurs Récents</h2>
        <span className="header-count">{vendors.length} vendeurs</span>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Vendeur</th>
              <th>CNI / Province</th>
              <th>Boutique</th>
              <th>Commission</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">
                  Aucun vendeur trouvé.
                </td>
              </tr>
            ) : (
              vendors.map((v) => {
                const boutique = v.boutiques?.[0] || v.boutique;

                return (
                  <tr key={v.id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar-circle">
                          {v.utilisateur?.name?.[0]}
                          {v.utilisateur?.prenom?.[0]}
                        </div>
                        <div>
                          <div className="font-bold">
                            {v.utilisateur?.name} {v.utilisateur?.prenom}
                          </div>
                          <div className="text-muted">
                            {v.utilisateur?.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="font-medium">
                        {v.utilisateur?.CNI || 'N/A'}
                      </div>
                      <div className="text-muted">
                        {v.utilisateur?.province}
                      </div>
                    </td>

                    <td>
                      {boutique ? (
                        <div>
                          <div className="font-medium flex-align">
                            {boutique.nom}
                            {(boutique.certifiée === 'true' ||
                              boutique.certifiée === 'oui' ||
                              boutique.certifiée === true) && (
                              <ShieldCheck
                                size={15}
                                className="verified-icon"
                                title="Boutique certifiée"
                              />
                            )}
                          </div>
                          <div className="text-muted">
                            {boutique.categorie} • {boutique.ville}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted">Aucune boutique</span>
                      )}
                    </td>

                    <td>
                      <span className="commission-pill">{v.commision}%</span>
                    </td>

                    <td>{getStatusBadge(v.status)}</td>

                    <td>
                      <div className="action-buttons">
                        {v.status !== 'accepte' && (
                          <button
                            className="btn-action btn-approve"
                            onClick={() => onStatusChange(v.id, 'accepte')}
                            title="Valider le vendeur"
                          >
                            Valider
                          </button>
                        )}
                        {v.status !== 'suspendu' && (
                          <button
                            className="btn-action btn-reject"
                            onClick={() => onStatusChange(v.id, 'suspendu')}
                            title="Suspendre le vendeur"
                          >
                            Suspendre
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentVendorsTable;