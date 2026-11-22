import React from 'react';
import { Eye, EyeOff, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_URL = 'http://127.0.0.1:8000/storage/';

const UsersTable = ({ users, selectedUserId, onToggleUser, onRoleChange, onDeleteUser }) => {
  return (
    <div className="dashboard-card table-card">
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Contact</th>
              <th>CNI & Ville</th>
              <th>Email Vérifié</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isSelected = selectedUserId === u.id;

                return (
                  <tr key={u.id} className={isSelected ? 'selected-row' : ''}>
                    <td>
                      <div className="user-cell">
                        {u.path_img_profile ? (
                          <img
                            src={`${STORAGE_URL}${u.path_img_profile}`}
                            alt={u.name}
                            className="table-avatar-img"
                          />
                        ) : (
                          <div className="avatar-circle">
                            {u.name?.[0]}{u.prenom?.[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold">{u.name} {u.prenom}</div>
                          <div className="text-muted">ID #{u.id}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="font-medium">{u.email}</div>
                      <div className="text-muted">{u.numtel}</div>
                    </td>

                    <td>
                      <div className="font-medium">{u.CNI || 'N/A'}</div>
                      <div className="text-muted">{u.province}, {u.pays}</div>
                    </td>

                    <td>
                      {u.email_verified_at ? (
                        <span className="badge badge-success">
                          <CheckCircle2 size={13} /> Vérifié
                        </span>
                      ) : (
                        <span className="badge badge-warning">
                          <AlertCircle size={13} /> Non vérifié
                        </span>
                      )}
                    </td>

                    <td>
                      <select
                        className={`role-select role-${u.role?.toLowerCase()}`}
                        value={u.role || 'user'}
                        onChange={(e) => onRoleChange(u.id, e.target.value)}
                      >
                        <option value="user">User / Client</option>
                        <option value="vendeur">Vendeur</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className={`toggle-details-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => onToggleUser(u)}
                          title={isSelected ? 'Masquer les détails' : 'Afficher les détails'}
                        >
                          {isSelected ? <EyeOff size={15} /> : <Eye size={15} />}
                          <span>{isSelected ? 'Masquer' : 'Détails'}</span>
                        </button>

                        <button
                          className="icon-btn btn-delete"
                          onClick={() => onDeleteUser(u.id)}
                          title="Supprimer l'utilisateur"
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

export default UsersTable;