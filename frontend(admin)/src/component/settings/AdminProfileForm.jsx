import React, { useState } from 'react';
import { UserCheck, Lock, Save, CheckCircle } from 'lucide-react';
import api from '../../api/api';

const AdminProfileForm = ({ adminData, onProfileUpdated }) => {
  const [form, setForm] = useState({
    name: adminData?.name || '',
    prenom: adminData?.prenom || '',
    email: adminData?.email || '',
    numtel: adminData?.numtel || '',
    password: '',
    password_confirmation: '',
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.password_confirmation) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    setSaving(true);
    try {
      const response = await api.put(`/admin/profile/${adminData.id}`, form);
      localStorage.setItem('admin_user', JSON.stringify(response.data.admin));
      if (onProfileUpdated) onProfileUpdated(response.data.admin);
      setForm((prev) => ({ ...prev, password: '', password_confirmation: '' }));
      setSuccessMsg('Profil administrateur mis à jour avec succès !');
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Erreur lors de la mise à jour du profil.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-card settings-card">
      <div className="card-header">
        <h2>
          <UserCheck size={19} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Profil Administrateur
        </h2>
      </div>

      {successMsg && (
        <div className="alert-success-box">
          <CheckCircle size={16} /> <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && <div className="error-alert">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="settings-form-grid">
        <div className="s-field">
          <label>Nom</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="s-field">
          <label>Prénom</label>
          <input
            type="text"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="s-field">
          <label>Adresse Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="s-field">
          <label>Téléphone</label>
          <input
            type="text"
            name="numtel"
            value={form.numtel}
            onChange={handleChange}
            required
          />
        </div>

        <div className="s-divider full-col">
          <Lock size={15} /> Changer le mot de passe (laisser vide pour conserver l'actuel)
        </div>

        <div className="s-field">
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="s-field">
          <label>Confirmer le mot de passe</label>
          <input
            type="password"
            name="password_confirmation"
            placeholder="••••••••"
            value={form.password_confirmation}
            onChange={handleChange}
          />
        </div>

        <div className="full-col">
          <button type="submit" className="btn-primary-save" disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfileForm;