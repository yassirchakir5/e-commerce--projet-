import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import api from '../api/api';
import StatCard from '../component/dashboard/StatCard';
import OrdersTable from '../component/orders/OrdersTable';
import OrderDetailsPanel from '../component/orders/OrderDetailsPanel';
import '../component/dashboard/Dashboard.css';
import '../component/users/Users.css';
import '../component/orders/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setApiError('');
      const response = await api.get('/admin/commandes');
      setOrders(response.data.commandes || []);
    } catch (error) {
      setApiError("Impossible de charger les commandes depuis Laravel (vérifiez /api/admin/commandes).");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOrder = (order) => {
    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder(null);
    } else {
      setSelectedOrder(order);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/commandes/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Supprimer définitivement la commande #${orderId} ?`)) return;
    try {
      await api.delete(`/admin/commandes/${orderId}`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const totalRevenus = orders
    .filter((o) => o.status !== 'Annulée')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const pendingCount = orders.filter((o) => o.status === 'En attente').length;
  const deliveredCount = orders.filter((o) => o.status === 'Livrée').length;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = `#${o.id} ${o.client_nom || ''} ${o.boutique_nom || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <p>Chargement des commandes...</p>;

  return (
    <div className="orders-page">
      <div className="users-header">
        <div>
          <h1>Gestion des Commandes</h1>
          <p>Suivez toutes les commandes de la plateforme, les paiements et les livraisons</p>
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
          title="Total Commandes"
          value={orders.length}
          subtitle="Toutes boutiques confondues"
          icon={ShoppingBag}
          colorClass="bg-blue"
        />
        <StatCard
          title="Volume des Ventes"
          value={`${totalRevenus.toFixed(0)} MAD`}
          subtitle="Hors commandes annulées"
          icon={DollarSign}
          colorClass="bg-emerald"
        />
        <StatCard
          title="En Attente"
          value={pendingCount}
          subtitle="À traiter par les vendeurs"
          icon={Clock}
          colorClass="bg-amber"
        />
        <StatCard
          title="Commandes Livrées"
          value={deliveredCount}
          subtitle="Terminées avec succès"
          icon={CheckCircle2}
          colorClass="bg-purple"
        />
      </div>

      <OrderDetailsPanel
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Rechercher par N° (#12), client ou boutique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="role-filters">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'En attente', label: 'En attente' },
            { key: 'Payée', label: 'Payées' },
            { key: 'En cours', label: 'En cours' },
            { key: 'Livrée', label: 'Livrées' },
            { key: 'Annulée', label: 'Annulées' },
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

      <OrdersTable
        orders={filteredOrders}
        selectedOrderId={selectedOrder?.id}
        onToggleOrder={handleToggleOrder}
        onStatusChange={handleStatusChange}
        onDeleteOrder={handleDeleteOrder}
      />
    </div>
  );
};

export default Orders;