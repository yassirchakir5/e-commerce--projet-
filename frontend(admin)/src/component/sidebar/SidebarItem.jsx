import React from 'react';

const SidebarItem = ({ icon: Icon, label, isOpen, active, onClick }) => {
  return (
    <li 
      className={`sidebar-item ${active ? 'active' : ''}`} 
      onClick={onClick}
      title={!isOpen ? label : ''}
    >
      <div className="icon-wrapper">
        <Icon size={22} />
      </div>
      <span className={`item-label ${isOpen ? 'show' : 'hide'}`}>
        {label}
      </span>
    </li>
  );
};

export default SidebarItem;