import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AtelierHeader from '../components/AtelierHeader';
import './Dashboard.css';

function Settings() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dash-layout">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar - Digital Atelier Style */}
      <aside className={`dash-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="dash-brand blue">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h2>Digital Atelier</h2>
             {/* Mobile Close Button */}
             <div className="mobile-sidebar-close" style={{ display: 'none' }} onClick={() => setIsSidebarOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </div>
          </div>
        </div>
        
        <div className="dash-profile" onClick={() => navigate('/order')} style={{cursor: 'pointer'}}>
          <div className="avatar">
            <img src="https://ui-avatars.com/api/?name=Alex+Rivera&background=111&color=fff" alt="" style={{width:'100%', height:'100%', borderRadius:'50%'}}/>
          </div>
          <div>
            <h4>Alex Rivera</h4>
            <p>Premium Member</p>
          </div>
        </div>

        <ul className="dash-menu">
          <li onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </li>
          <li onClick={() => navigate('/order')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline></svg>
            Orders
          </li>
          <li onClick={() => navigate('/favorites')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            Favorites
          </li>
          <li className="active" onClick={() => navigate('/settings')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Settings
          </li>
          <div style={{flex:1}}></div>
          <li onClick={() => navigate('/support')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Support
          </li>
        </ul>
        
        <div className="dash-upgrade">
          <button className="btn-upgrade">UPGRADE TO PRO</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        <AtelierHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: '60vh' }}>
          <h1 style={{color: '#111', marginBottom: '20px'}}>Digital Atelier Settings Page</h1>
          <p style={{color: '#6a6a7c'}}>This is a placeholder page for your boutique settings.</p>
        </div>
      </main>
    </div>
  );
}

export default Settings;
