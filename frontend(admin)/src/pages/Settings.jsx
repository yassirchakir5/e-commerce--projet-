import React, { useState, useEffect } from 'react';
import api from '../api/api';
import AdminProfileForm from '../component/settings/AdminProfileForm';
import CategoriesManager from '../component/settings/CategoriesManager';
import PlatformRulesCard from '../component/settings/PlatformRulesCard';
import '../component/dashboard/Dashboard.css';
import '../component/settings/Settings.css';

const Settings = () => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    try {
      const catRes = await api.get('/categorie');
      setCategories(catRes.data.categorie || []);

      if (!adminUser) {
        const usersRes = await api.get('/admin/utilisateurs');
        const foundAdmin = (usersRes.data.utilisateurs || []).find(
          (u) => u.role === 'admin'
        );
        if (foundAdmin) {
          setAdminUser(foundAdmin);
          localStorage.setItem('admin_user', JSON.stringify(foundAdmin));
        }
      }
    } catch (err) {
      console.error('Erreur chargement paramètres', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement des paramètres...</p>;

  return (
    <div className="settings-page">
      <div className="users-header">
        <div>
          <h1>Paramètres de la Plateforme</h1>
          <p>Gérez votre compte administrateur, les catégories et les règles de commission</p>
        </div>
      </div>

      <div className="settings-layout-grid">
        {adminUser ? (
          <AdminProfileForm
            adminData={adminUser}
            onProfileUpdated={(updated) => setAdminUser(updated)}
          />
        ) : (
          <div className="dashboard-card">
            <p className="text-muted">Aucun compte avec le rôle "admin" trouvé.</p>
          </div>
        )}

        <div className="settings-right-col">
          <CategoriesManager
            categories={categories}
            setCategories={setCategories}
          />
          <PlatformRulesCard />
        </div>
      </div>
    </div>
  );
};

export default Settings;    