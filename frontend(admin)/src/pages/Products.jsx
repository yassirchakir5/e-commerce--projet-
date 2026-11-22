import React, { useState, useEffect } from 'react';
import { Search, Package, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import api from '../api/api';
import '../component/dashboard/Dashboard.css';
import '../component/users/Users.css';
import '../component/boutiques/Boutiques.css';

const STORAGE_URL = 'http://127.0.0.1:8000/storage/';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setApiError('');
      const res = await api.get('/admin/produits');
      setProducts(res.data.produits || []);
    } catch (err) {
      setApiError("Impossible de charger les produits depuis Laravel.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/produits/${id}/status`, { status: newStatus });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      alert('Erreur lors de la modification du statut');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Supprimer définitivement ce produit ?')) return;
    try {
      await api.delete(`/produit/delete/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (selectedProduct?.id === id) setSelectedProduct(null);
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const getImg = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${STORAGE_URL}${path.startsWith('/') ? path.slice(1) : path}`;
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = `${p.nom} ${p.boutique?.nom || ''} ${p.categorie?.nom || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <p>Chargement des produits...</p>;

  return (
    <div className="boutiques-page">
      <div className="users-header">
        <div>
          <h1>Gestion des Produits</h1>
          <p>Contrôlez l'ensemble des produits publiés sur la plateforme ({products.length} produits)</p>
        </div>
      </div>

      {apiError && (
        <div className="error-alert">
          <AlertTriangle size={18} />
          <span>{apiError}</span>
        </div>
      )}

      {selectedProduct && (
        <div className="inline-details-panel">
          <div className="panel-header">
            <div>
              <h3>{selectedProduct.nom}</h3>
              <span className="text-muted">
                Boutique: {selectedProduct.boutique?.nom || 'N/A'} • Prix: {selectedProduct.prix} MAD • Stock: {selectedProduct.stock}
              </span>
            </div>
            <button className="close-panel-btn" onClick={() => setSelectedProduct(null)}>
              Fermer
            </button>
          </div>
          <p style={{ marginBottom: 14, color: '#334155', fontSize: '0.92rem' }}>
            {selectedProduct.description || selectedProduct.desc || 'Aucune description.'}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {(selectedProduct.images || []).length > 0 ? (
              selectedProduct.images.map((img, i) => {
                const src = getImg(img.image || img.path || img.url);
                return src ? (
                  <a key={i} href={src} target="_blank" rel="noreferrer">
                    <img
                      src={src}
                      alt=""
                      style={{ width: 130, height: 130, objectFit: 'cover', borderRadius: 10, border: '1px solid #cbd5e1' }}
                    />
                  </a>
                ) : null;
              })
            ) : (
              <span className="text-muted">Aucune image disponible pour ce produit.</span>
            )}
          </div>
        </div>
      )}

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Rechercher par produit, boutique ou catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="role-filters">
          {[
            { key: 'all', label: 'Tous' },
            { key: 'disponible', label: 'Disponibles' },
            { key: 'vendue', label: 'Épuisés' },
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

      <div className="dashboard-card table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Boutique</th>
                <th>Catégorie</th>
                <th>Prix & Stock</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">Aucun produit trouvé.</td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isSelected = selectedProduct?.id === p.id;
                  const firstImg = p.images?.[0]?.image || p.images?.[0]?.path || p.images?.[0]?.url;

                  return (
                    <tr key={p.id} className={isSelected ? 'selected-row' : ''}>
                      <td>
                        <div className="user-cell">
                          {getImg(firstImg) ? (
                            <img src={getImg(firstImg)} alt={p.nom} className="table-avatar-img" style={{ borderRadius: 8 }} />
                          ) : (
                            <div className="avatar-circle" style={{ borderRadius: 8 }}><Package size={18} /></div>
                          )}
                          <div>
                            <div className="font-bold">{p.nom}</div>
                            <div className="text-muted">ID #{p.id}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="font-medium">{p.boutique?.nom || `Boutique #${p.id_boutique}`}</div>
                      </td>

                      <td>
                        <span className="commission-pill">{p.categorie?.nom || 'Général'}</span>
                      </td>

                      <td>
                        <div className="font-bold" style={{ color: '#0284c7' }}>{Number(p.prix).toFixed(2)} MAD</div>
                        <div className="text-muted">Stock: {p.stock}</div>
                      </td>

                      <td>
                        <select
                          className="role-select"
                          value={p.status || 'disponible'}
                          onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        >
                          <option value="disponible">Disponible</option>
                          <option value="vendue">Épuisé (Vendue)</option>
                          <option value="suspendu">Suspendu</option>
                        </select>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className={`toggle-details-btn ${isSelected ? 'active' : ''}`}
                            onClick={() => setSelectedProduct(isSelected ? null : p)}
                          >
                            {isSelected ? <EyeOff size={15} /> : <Eye size={15} />}
                            <span>{isSelected ? 'Masquer' : 'Photos'}</span>
                          </button>

                          <button
                            className="icon-btn btn-delete"
                            onClick={() => handleDeleteProduct(p.id)}
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

export default Products;