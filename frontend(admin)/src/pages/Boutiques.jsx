import React, { useState, useEffect } from 'react';
import { Search, Store, ShieldCheck, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-react';
import api from '../api/api';
import BoutiqueProductsPanel from '../component/boutiques/BoutiqueProductsPanel';
import '../component/dashboard/Dashboard.css';
import '../component/users/Users.css';
import '../component/boutiques/Boutiques.css';

const STORAGE_URL = 'http://127.0.0.1:8000/storage/';

const Boutiques = () => {
  const [boutiques, setBoutiques] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedBoutique, setSelectedBoutique] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    fetchBoutiques();
  }, []);

  const fetchBoutiques = async () => {
    try {
      setApiError('');
      const res = await api.get('/admin/boutiques');
      setBoutiques(res.data.boutiques || []);
    } catch (err) {
      setApiError("Impossible de charger les boutiques depuis Laravel.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBoutique = async (id, payload) => {
    try {
      const res = await api.put(`/admin/boutiques/${id}/status`, payload);
      const updated = res.data.boutique;
      setBoutiques((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
      );
      if (selectedBoutique?.id === id) {
        setSelectedBoutique((prev) => ({ ...prev, ...updated }));
      }
    } catch (err) {
      alert('Erreur lors de la mise à jour de la boutique');
    }
  };

  const handleDeleteBoutique = async (id) => {
    if (!window.confirm('Supprimer cette boutique et ses produits ?')) return;
    try {
      await api.delete(`/boutique/delete/${id}`);
      setBoutiques((prev) => prev.filter((b) => b.id !== id));
      if (selectedBoutique?.id === id) setSelectedBoutique(null);
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const filteredBoutiques = boutiques.filter((b) => {
    const owner = `${b.vendeur?.utilisateur?.name || ''} ${b.vendeur?.utilisateur?.prenom || ''}`;
    const matchesSearch = `${b.nom} ${b.ville} ${b.categorie} ${owner}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (filter === 'certifiee') return matchesSearch && b.certifiée === 'true';
    if (filter === 'accepte') return matchesSearch && b.status === 'accepte';
    if (filter === 'en attente') return matchesSearch && b.status === 'en attente';
    return matchesSearch;
  });

  if (loading) return <p>Chargement des boutiques...</p>;

  return (
    <div className="boutiques-page">
      <div className="users-header">
        <div>
          <h1>Gestion des Boutiques</h1>
          <p>Gérez les magasins, certifiez-les et inspectez leurs produits ({boutiques.length} boutiques)</p>
        </div>
      </div>

      {apiError && (
        <div className="error-alert">
          <AlertTriangle size={18} />
          <span>{apiError}</span>
        </div>
      )}

      <BoutiqueProductsPanel
        boutique={selectedBoutique}
        onClose={() => setSelectedBoutique(null)}
      />

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Rechercher par boutique, ville, catégorie ou vendeur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="role-filters">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'en attente', label: 'En attente' },
            { key: 'accepte', label: 'Actives' },
            { key: 'certifiee', label: 'Certifiées' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`filter-pill ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-card table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Boutique</th>
                <th>Propriétaire (Vendeur)</th>
                <th>Catégorie & Ville</th>
                <th>Produits</th>
                <th>Statut & Certification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBoutiques.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">Aucune boutique trouvée.</td>
                </tr>
              ) : (
                filteredBoutiques.map((b) => {
                  const isSelected = selectedBoutique?.id === b.id;
                  const isCertified = b.certifiée === 'true' || b.certifiée === true;
                  const isActive = b.status === 'accepte';
                  const owner = b.vendeur?.utilisateur;

                  return (
                    <tr key={b.id} className={isSelected ? 'selected-row' : ''}>
                      <td>
                        <div className="user-cell">
                          {b.logo_boutique ? (
                            <img
                              src={`${STORAGE_URL}${b.logo_boutique}`}
                              alt={b.nom}
                              className="table-avatar-img"
                            />
                          ) : (
                            <div className="avatar-circle"><Store size={18} /></div>
                          )}
                          <div>
                            <div className="font-bold flex-align">
                              {b.nom}
                              {isCertified && <ShieldCheck size={15} className="verified-icon" />}
                            </div>
                            <div className="text-muted">{b.email}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        {owner ? (
                          <div>
                            <div className="font-medium">{owner.name} {owner.prenom}</div>
                            <div className="text-muted">{owner.numtel}</div>
                          </div>
                        ) : (
                          <span className="text-muted">Vendeur #{b.vendeur_id}</span>
                        )}
                      </td>

                      <td>
                        <div className="font-medium">{b.categorie}</div>
                        <div className="text-muted">{b.ville}</div>
                      </td>

                      <td>
                        <span className="commission-pill">
                          {b.produits?.length || 0} produits
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <span className={`badge ${isActive ? 'badge-success' : 'badge-warning'}`}>
                            {isActive ? 'Active' : b.status}
                          </span>
                          <button
                            type="button"
                            className={`btn-certify ${isCertified ? 'active' : ''}`}
                            onClick={() =>
                              handleUpdateBoutique(b.id, {
                                certifiée: isCertified ? 'false' : 'true',
                              })
                            }
                            title="Basculer la certification"
                          >
                            <ShieldCheck size={13} />
                            {isCertified ? 'Certifiée' : 'Certifier'}
                          </button>
                        </div>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className={`btn-action ${isActive ? 'btn-reject' : 'btn-approve'}`}
                            onClick={() =>
                              handleUpdateBoutique(b.id, {
                                status: isActive ? 'suspendu' : 'accepte',
                              })
                            }
                          >
                            {isActive ? 'Suspendre' : 'Activer'}
                          </button>

                          <button
                            className={`toggle-details-btn ${isSelected ? 'active' : ''}`}
                            onClick={() => setSelectedBoutique(isSelected ? null : b)}
                          >
                            {isSelected ? <EyeOff size={15} /> : <Eye size={15} />}
                            <span>{isSelected ? 'Masquer' : 'Produits'}</span>
                          </button>

                          <button
                            className="icon-btn btn-delete"
                            onClick={() => handleDeleteBoutique(b.id)}
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
    </div>
  );
};

export default Boutiques;