import React from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

const VendorsTable = ({
  vendors,
  selectedVendorId,
  onToggleVendor,
  onStatusChange,
  onDeleteVendor,
}) => {
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
      case 'suspendu':
      case 'rejeté':
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
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Vendeur</th>
              <th>CNI / Ville</th>
              <th>Boutique(s)</th>
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
                const isSelected = selectedVendorId === v.id;
                const boutiques = v.boutiques || (v.boutique ? [v.boutique] : []);

                return (
                  <tr key={v.id} className={isSelected ? 'selected-row' : ''}>
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
                      {boutiques.length > 0 ? (
                        <div>
                          <div className="font-medium flex-align">
                            {boutiques[0].nom}
                            {(boutiques[0].certifiée === 'true' ||
                              boutiques[0].certifiée === true) && (
                              <ShieldCheck
                                size={15}
                                className="verified-icon"
                                title="Boutique certifiée"
                              />
                            )}
                          </div>
                          <div className="text-muted">
                            {boutiques[0].categorie}
                            {boutiques.length > 1 && ` (+${boutiques.length - 1} autre)`}
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
                          >
                            Valider
                          </button>
                        )}
                        {v.status !== 'suspendu' && (
                          <button
                            className="btn-action btn-reject"
                            onClick={() => onStatusChange(v.id, 'suspendu')}
                          >
                            Suspendre
                          </button>
                        )}
                        <button
                          className={`toggle-details-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => onToggleVendor(v)}
                          title="Voir boutiques & CNI"
                        >
                          {isSelected ? <EyeOff size={15} /> : <Eye size={15} />}
                          <span>{isSelected ? 'Masquer' : 'Gérer'}</span>
                        </button>
                        <button
                          className="icon-btn btn-delete"
                          onClick={() => onDeleteVendor(v.id)}
                          title="Supprimer le vendeur"
                        >
                          <Trash2 size={16} />
                        </button>
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

export default VendorsTable;