import React from 'react';
import { useNavigate } from 'react-router-dom';

function AtelierHeader({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <div className="atelier-header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="hamburger-menu" onClick={onMenuClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
        <div className="atelier-nav-links">
          <span>SHOP</span>
          <span>COLLECTIONS</span>
          <span>EDITORIAL</span>
          <span>JOURNAL</span>
        </div>
      </div>
      <div className="atelier-nav-icons">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" onClick={() => navigate('/admin-product')} style={{cursor: 'pointer'}}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    </div>
  );
}

export default AtelierHeader;
