import React, { useState } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';
import api from '../../api/api';

const CategoriesManager = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setAdding(true);
    try {
      const response = await api.post('/admin/categorie', {
        nom: newCategory.trim(),
      });
      setCategories((prev) => [...prev, response.data.categorie]);
      setNewCategory('');
    } catch (err) {
      alert("Erreur lors de l'ajout de la catégorie");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try {
      await api.delete(`/admin/categorie/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert('Impossible de supprimer cette catégorie (elle contient peut-être des produits).');
    }
  };

  return (
    <div className="dashboard-card settings-card">
      <div className="card-header">
        <h2>
          <Tag size={19} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Catégories de la Plateforme
        </h2>
        <span className="header-count">{categories.length} catégories</span>
      </div>

      <form onSubmit={handleAdd} className="add-cat-form">
        <input
          type="text"
          placeholder="Nouvelle catégorie (ex: Électronique, Mode...)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="submit" className="btn-add-cat" disabled={adding}>
          <Plus size={16} />
          <span>Ajouter</span>
        </button>
      </form>

      <div className="categories-tags-list">
        {categories.length === 0 ? (
          <p className="text-muted">Aucune catégorie enregistrée.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="cat-chip">
              <span>{cat.nom || cat.name || cat.titre}</span>
              <button
                type="button"
                onClick={() => handleDelete(cat.id)}
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoriesManager;