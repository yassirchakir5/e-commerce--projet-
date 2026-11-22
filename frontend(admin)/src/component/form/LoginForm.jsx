import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../../api/api';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/admin/login', {
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.admin));

      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Erreur de connexion au serveur.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="admin-badge">
            <ShieldCheck size={32} />
          </div>
          <h2>Espace <span>Admin</span></h2>
          <p>Connectez-vous pour gérer la plateforme</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <InputField
            label="Adresse Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@store.com"
            icon={Mail}
          />

          <InputField
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={Lock}
          />

          <SubmitButton text="Se connecter" isLoading={isLoading} />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;