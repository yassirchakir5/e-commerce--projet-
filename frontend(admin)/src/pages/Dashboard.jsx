import React, { useState, useEffect } from 'react';
import { Users, Store, ShoppingBag, Clock, AlertTriangle } from 'lucide-react';
import api from '../api/api';
import StatCard from '../component/dashboard/StatCard';
import RecentVendorsTable from '../component/dashboard/RecentVendorsTable';
import RecentUsersList from '../component/dashboard/RecentUsersList';
import '../component/dashboard/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalBoutiques: 0,
    pendingVendors: 0,
  });
  const [vendors, setVendors] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setApiError('');
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats || {
        totalUsers: 0,
        totalVendors: 0,
        totalBoutiques: 0,
        pendingVendors: 0,
      });
      setVendors(response.data.vendors || []);
      setRecentUsers(response.data.recentUsers || []);
    } catch (error) {
      setApiError("Impossible de charger les données depuis Laravel (vérifiez la route /api/admin/dashboard).");
    } finally {
      setLoading(false);
    }
  };

  const handleVendorStatus = async (vendorId, newStatus) => {
    try {
      await api.put(`/admin/vendeurs/${vendorId}/status`, { status: newStatus });
      setVendors((prev) =>
        prev.map((v) => (v.id === vendorId ? { ...v, status: newStatus } : v))
      );
      fetchDashboardData();
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut du vendeur');
    }
  };

  if (loading) {
    return <p>Chargement du tableau de bord...</p>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-top-header">
        <div>
          <h1>Tableau de Bord Administrateur</h1>
          <p>Suivi des utilisateurs, vendeurs et boutiques de la plateforme</p>
        </div>
      </div>

      {apiError && (
        <div className="error-alert">
          <AlertTriangle size={18} />
          <span>{apiError}</span>
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          title="Total Utilisateurs"
          value={stats.totalUsers}
          subtitle="Clients & Vendeurs"
          icon={Users}
          colorClass="bg-blue"
        />
        <StatCard
          title="Vendeurs Inscrits"
          value={stats.totalVendors}
          subtitle="Comptes vendeurs"
          icon={Store}
          colorClass="bg-purple"
        />
        <StatCard
          title="Boutiques Actives"
          value={stats.totalBoutiques}
          subtitle="Magasins enregistrés"
          icon={ShoppingBag}
          colorClass="bg-emerald"
        />
        <StatCard
          title="Vendeurs en Attente"
          value={stats.pendingVendors}
          subtitle="À valider (CNI)"
          icon={Clock}
          colorClass="bg-amber"
        />
      </div>

      <div className="dashboard-main-grid">
        <RecentVendorsTable
          vendors={vendors}
          onStatusChange={handleVendorStatus}
        />
        <RecentUsersList users={recentUsers} />
      </div>
    </div>
  );
};

export default Dashboard;