import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-title">{title}</span>
        <h3 className="stat-value">{value}</h3>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
      <div className={`stat-icon ${colorClass}`}>
        <Icon size={26} />
      </div>
    </div>
  );
};

export default StatCard;