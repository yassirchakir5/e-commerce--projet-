import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Store, 
  Package, 
  ShoppingBag, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

const menuItems = [
  { id: 'Dashboard', path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'Users', path: '/users', label: 'Utilisateurs', icon: Users },
  { id: 'Vendors', path: '/vendors', label: 'Vendeurs', icon: UserCheck },
  { id: 'Boutiques', path: '/boutiques', label: 'Boutiques', icon: Store },
  { id: 'Products', path: '/products', label: 'Produits', icon: Package },
  { id: 'Orders', path: '/orders', label: 'Commandes', icon: ShoppingBag },
  { id: 'Settings', path: '/settings', label: 'Paramètres', icon: Settings },
];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="toggle-btn" 
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Réduire le menu' : 'Agrandir le menu'}
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="sidebar-inner">
        <div className="sidebar-header">
          <div className={`logo ${isOpen ? 'show' : 'hide'}`}>
            <h2>Admin<span>Panel</span></h2>
          </div>
          {!isOpen && <div className="logo-mini">AP</div>}
        </div>

        <ul className="sidebar-menu" style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isOpen={isOpen}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </ul>

        <ul className="sidebar-menu" style={{ borderTop: '1px solid #334155' }}>
          <SidebarItem
            icon={LogOut}
            label="Déconnexion"
            isOpen={isOpen}
            active={false}
            onClick={onLogout}
          />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;