import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import api from '../api/api';
import VendorsTable from '../component/vendors/VendorsTable';
import UserDetailsPanel from '../component/users/UserDetailsPanel';
import '../component/dashboard/Dashboard.css';
import '../component/users/Users.css';
import '../component/vendors/Vendors.css';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setApiError('');
      const response = await api.get('/admin/vendeurs');
      setVendors(response.data.vendeurs || []);
    } catch (error) {
      setApiError("Impossible de charger les vendeurs depuis Laravel.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVendor = (vendor) => {
    setSelectedVendor((prev) => (prev?.id === vendor.id ? null : vendor));
  };

  const handleStatusChange = async (vendorId, newStatus) => {
    try {
      await api.put(`/admin/vendeurs/${vendorId}/status`, { status: newStatus });
      setVendors((prev) =>
        prev.map((v) => (v.id === vendorId ? { ...v, status: newStatus } : v))
      );
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm('Supprimer ce compte vendeur ?')) return;
    try {
      await api.delete(`/admin/vendeurs/${vendorId}`);
      setVendors((prev) => prev.filter((v) => v.id !== vendorId));
      if (selectedVendor?.id === vendorId) setSelectedVendor(null);
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const user = v.utilisateur || {};
    const matchesSearch = `${user.name || ''} ${user.prenom || ''} ${user.email || ''} ${user.CNI || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <p>Chargement des vendeurs...</p>;

  return (
    <div className="vendors-page">
      <div className="users-header">
        <div>
          <h1>Gestion des Vendeurs</h1>
          <p>Validez les comptes vendeurs, vérifiez leurs CNI et gérez leurs commissions ({vendors.length} vendeurs)</p>
        </div>
      </div>

      {apiError && (
        <div className="error-alert">
          <AlertTriangle size={18} />
          <span>{apiError}</span>
        </div>
      )}

      {selectedVendor && (
        <UserDetailsPanel
          user={selectedVendor.utilisateur}
          onClose={() => setSelectedVendor(null)}
        />
      )}

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
            { key: 'en attente', label: 'En attente' },
            { key: 'accepte', label: 'Validés' },
            { key: 'suspendu', label: 'Suspendus' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`filter-pill ${statusFilter === tab.key ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <VendorsTable
        vendors={filteredVendors}
        selectedVendorId={selectedVendor?.id}
        onToggleVendor={handleToggleVendor}
        onStatusChange={handleStatusChange}
        onDeleteVendor={handleDeleteVendor}
      />
    </div>
  );
};

export default Vendors;