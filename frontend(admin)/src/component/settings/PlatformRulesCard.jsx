import React, { useState } from 'react';
import { Percent, RefreshCw } from 'lucide-react';
import api from '../../api/api';

const PlatformRulesCard = () => {
  const [globalCommission, setGlobalCommission] = useState(10);
  const [updating, setUpdating] = useState(false);

  const handleApplyAll = async (e) => {
    e.preventDefault();
    if (
      !window.confirm(
        `Appliquer une commission de ${globalCommission}% à TOUS les vendeurs ?`
      )
    )
      return;

    setUpdating(true);
    try {
      await api.put('/admin/settings/global-commission', {
        commision: parseFloat(globalCommission),
      });
      alert('Commission mise à jour pour tous les vendeurs !');
    } catch (err) {
      alert('Erreur lors de la mise à jour globale.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="dashboard-card settings-card">
      <div className="card-header">
        <h2>
          <Percent size={19} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Commission Globale
        </h2>
      </div>

      <p className="text-muted" style={{ marginBottom: 14, lineHeight: 1.5 }}>
        Définissez un taux de commission uniforme et appliquez-le à l'ensemble des comptes vendeurs actifs sur la plateforme.
      </p>

      <form onSubmit={handleApplyAll} className="commission-global-form">
        <div className="s-field">
          <label>Taux de commission (%)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="100"
            value={globalCommission}
            onChange={(e) => setGlobalCommission(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-secondary-dark" disabled={updating}>
          <RefreshCw size={15} />
          <span>{updating ? 'Application...' : 'Appliquer à tous les vendeurs'}</span>
        </button>
      </form>
    </div>
  );
};

export default PlatformRulesCard;