import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AtelierHeader from '../components/AtelierHeader';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const pubProducts = JSON.parse(localStorage.getItem('publishedProducts') || '[]');
    setProducts(pubProducts.reverse());
  }, []);

  const handleDelete = (id) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    
    const originalPubProducts = JSON.parse(localStorage.getItem('publishedProducts') || '[]');
    const newPubProducts = originalPubProducts.filter(p => p.id !== id);
    localStorage.setItem('publishedProducts', JSON.stringify(newPubProducts));
    setActiveMenuId(null);
  };

  const toggleMenu = (id) => {
    setActiveMenuId(prev => prev === id ? null : id);
  };

  const barHeights = [40, 60, 45, 100, 65, 80, 45, 75, 40, 65];

  return (
    <div className="dash-layout">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`dash-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="dash-brand">
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
          <li className="active" onClick={() => navigate('/dashboard')}>
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
          <li onClick={() => navigate('/settings')}>
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
        {/* Top Navbar */}
        <AtelierHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Header */}
        <div className="canvas-header">
          <h1>Performance Canvas</h1>
          <p>An editorial overview of your boutique's metrics, seasonal curations, and fulfillment velocity.</p>
        </div>

        {/* Metrics Row */}
        <div className="metrics-row">
          <div className="bg-white-card metric-card-main">
            <div className="metric-header">
              <div className="icon-box">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <span className="live-pulse">LIVE PULSE</span>
            </div>
            <span className="metric-label">REVENUE GROWTH</span>
            <div className="metric-value-huge">$142,850.00</div>
            <div className="metric-growth">↑ 12.4% from last period</div>
          </div>

          <div className="metric-card-side">
             <span className="metric-label">CONVERSION</span>
             <div className="metric-value-large">3.82%</div>
             <div className="mini-bar"><div className="mini-fill"></div></div>
          </div>

          <div className="metric-card-side">
             <span className="metric-label">ACTIVE CURATION</span>
             <div className="metric-value-large">24 Flows</div>
             <div className="avatar-stack">
                <img src="https://ui-avatars.com/api/?name=A" alt="UI" />
                <img src="https://ui-avatars.com/api/?name=B" alt="UI" />
                <img src="https://ui-avatars.com/api/?name=C" alt="UI" />
                <div className="more">+12</div>
             </div>
          </div>
        </div>

        {/* Middle Row (Analytics & Spotlight) */}
        <div className="charts-row">
          <div className="bg-white-card">
            <div className="chart-header">
               <h3>Curation Analytics</h3>
               <div className="chart-toggles">
                  <span>7D</span>
                  <span className="active">30D</span>
               </div>
            </div>
            <div className="bar-wrapper">
               {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((day, i) => (
                 <div className="bar-col" key={day}>
                   <div className={`bar ${day === 'WED' ? 'highlight' : ''}`} style={{height: `${barHeights[i]}%`}}></div>
                   <span>{day}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="spotlight-card">
            <span className="spotlight-badge">SPOTLIGHT</span>
            <h3>New Seasonal Campaign</h3>
            <p>Your Autumn curation is outperforming projections by 22%. Review the heatmaps to optimize placement.</p>
            <a href="#" className="explore-btn">Explore Strategy →</a>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-section">
          <div className="table-header">
             <div>
                <h2>Recent Curation Flow</h2>
                <p>Live updates of incoming artisan inventory.</p>
             </div>
             <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
               <div className="search-box">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a09eb5" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input type="text" placeholder="Search curations..." />
               </div>
               <button 
                 onClick={() => { localStorage.clear(); window.location.reload(); }} 
                 style={{padding: '8px 12px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'}}
               >
                 Clear Storage
               </button>
             </div>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">No products available</div>
          ) : (
            <table className="curation-table">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>CATEGORY</th>
                  <th>QUANTITY</th>
                  <th>STATUS</th>
                  <th>VALUE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="td-item">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} />
                      ) : (
                        <div className="img-placeholder">img</div>
                      )}
                      {product.name || 'Untitled Item'}
                    </td>
                    <td data-label="Category">{product.category || 'N/A'}</td>
                    <td data-label="Quantity">{product.quantity || product.stockQuantity || '0'}</td>
                    <td data-label="Status"><span className="status-badge status-active">ACTIVE</span></td>
                    <td data-label="Value" className="td-value">${product.price || product.basePrice || '0.00'}</td>
                    <td data-label="Action" style={{position:'relative'}}>
                      <button className="action-btn" onClick={() => toggleMenu(product.id)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                      </button>
                      {activeMenuId === product.id && (
                         <div className="menu-dropdown">
                            <button onClick={() => handleDelete(product.id)}>Delete product</button>
                         </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
