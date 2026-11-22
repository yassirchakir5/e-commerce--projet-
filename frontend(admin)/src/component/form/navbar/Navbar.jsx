import React from 'react';
import { Shield, Store } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="admin-navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <Store size={22} />
        </div>
        <h1>
          Tableau de Bord <span>- Administrateur</span>
        </h1>
      </div>

      <div className="navbar-status">
        <span className="status-badge">
          <Shield size={15} />
          Accès Sécurisé
        </span>
      </div>
    </header>
  );
};

export default Navbar;