import React from 'react';
import { UserCheck } from 'lucide-react';

const RecentUsersList = ({ users }) => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2>Nouveaux Utilisateurs</h2>
        <UserCheck size={18} className="text-muted" />
      </div>

      <div className="users-list">
        {users.map((u) => (
          <div key={u.id} className="user-list-item">
            <div className="user-cell">
              <div className="avatar-circle secondary">
                {u.name?.[0]}{u.prenom?.[0]}
              </div>
              <div>
                <div className="font-bold">{u.name} {u.prenom}</div>
                <div className="text-muted">{u.numtel} • {u.pays}</div>
              </div>
            </div>
            <span className={`role-tag role-${u.role?.toLowerCase()}`}>
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsersList;