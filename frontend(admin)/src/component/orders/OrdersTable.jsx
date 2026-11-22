import React from 'react';
import { Eye, EyeOff, Trash2, CreditCard, Banknote } from 'lucide-react';

const OrdersTable = ({
  orders,
  selectedOrderId,
  onToggleOrder,
  onStatusChange,
  onDeleteOrder,
}) => {
  const getStatusClass = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('livr') || s.includes('pay')) return 'status-green';
    if (s.includes('annul')) return 'status-red';
    if (s.includes('cours') || s.includes('expéd')) return 'status-blue';
    return 'status-amber';
  };

  return (
    <div className="dashboard-card table-card">
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>N° Commande</th>
              <th>Client</th>
              <th>Boutique</th>
              <th>Paiement</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-cell">
                  Aucune commande trouvée.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isSelected = selectedOrderId === order.id;
                const isCarte = order.mode_paiement?.toLowerCase().includes('carte');

                return (
                  <tr key={order.id} className={isSelected ? 'selected-row' : ''}>
                    <td>
                      <div className="font-bold">#{order.id}</div>
                      <div className="text-muted">{order.date_commande}</div>
                    </td>

                    <td>
                      <div className="font-bold">{order.client_nom}</div>
                      <div className="text-muted">{order.client_tel}</div>
                    </td>

                    <td>
                      <div className="font-medium">{order.boutique_nom}</div>
                      <div className="text-muted">{order.boutique_ville}</div>
                    </td>

                    <td>
                      <span className="payment-pill">
                        {isCarte ? <CreditCard size={14} /> : <Banknote size={14} />}
                        {isCarte ? 'Carte' : 'Livraison'}
                      </span>
                    </td>

                    <td>
                      <span className="font-bold" style={{ color: '#0f172a' }}>
                        {Number(order.total).toFixed(2)} MAD
                      </span>
                    </td>

                    <td>
                      <select
                        className={`order-status-select ${getStatusClass(order.status)}`}
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                      >
                        <option value="En attente">En attente</option>
                        <option value="Payée">Payée</option>
                        <option value="En cours">En cours</option>
                        <option value="Livrée">Livrée</option>
                        <option value="Annulée">Annulée</option>
                      </select>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className={`toggle-details-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => onToggleOrder(order)}
                          title="Détails de la commande"
                        >
                          {isSelected ? <EyeOff size={15} /> : <Eye size={15} />}
                          <span>{isSelected ? 'Masquer' : 'Détails'}</span>
                        </button>

                        <button
                          className="icon-btn btn-delete"
                          onClick={() => onDeleteOrder(order.id)}
                          title="Supprimer la commande"
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

export default OrdersTable;