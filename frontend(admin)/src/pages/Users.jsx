import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import api from '../api/api';
import UsersTable from '../component/users/UsersTable';
import UserDetailsPanel from '../component/users/UserDetailsPanel';
import '../component/dashboard/Dashboard.css';
import '../component/users/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setApiError('');
      const response = await api.get('/admin/utilisateurs');
      setUsers(response.data.utilisateurs || []);
    } catch (error) {
      setApiError("Impossible de charger les données depuis Laravel (vérifiez la route /api/admin/utilisateurs).");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = (user) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/utilisateurs/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => ({ ...prev, role: newRole }));
      }
    } catch (err) {
      alert('Erreur lors de la modification du rôle');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/admin/utilisateurs/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      if (selectedUser?.id === userId) setSelectedUser(null);
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      `${u.name || ''} ${u.prenom || ''} ${u.email || ''} ${u.CNI || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <p>Chargement des utilisateurs...</p>;

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Gestion des Utilisateurs</h1>
          <p>Consultez les profils, vérifiez les CNI et gérez les rôles ({users.length} inscrits)</p>
        </div>
      </div>

      {apiError && (
        <div className="error-alert">
          <AlertTriangle size={18} />
          <span>{apiError}</span>
        </div>
      )}

      <UserDetailsPanel
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou CNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="role-filters">
          {[
            { key: 'all', label: 'Tous' },
            { key: 'user', label: 'Clients' },
            { key: 'vendeur', label: 'Vendeurs' },
            { key: 'admin', label: 'Admins' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`filter-pill ${roleFilter === tab.key ? 'active' : ''}`}
              onClick={() => setRoleFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <UsersTable
        users={filteredUsers}
        selectedUserId={selectedUser?.id}
        onToggleUser={handleToggleUser}
        onRoleChange={handleRoleChange}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default Users;