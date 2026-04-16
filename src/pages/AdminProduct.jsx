import React, { useState } from 'react';
import './AdminProduct.css';
import { useNavigate } from 'react-router-dom';

function AdminProduct() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    quantity: ''
  });
  const [images, setImages] = useState([]);
  const [droppedImage, setDroppedImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = [
    "Electronics", "Clothing", "Footwear", "Accessories",
    "Home & Kitchen", "Beauty & Personal Care",
    "Sports & Fitness", "Books & Stationery",
    "Toys & Games", "Groceries"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        callback(dataUrl);
      };
    };
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.slice(0, 3 - images.length);
      validFiles.forEach(file => {
        compressImage(file, (dataUrl) => {
          setImages(prev => {
             if (prev.length < 3) return [...prev, dataUrl];
             return prev;
          });
        });
      });
    }
    
    // Reset file input to allow selecting the same file again
    e.target.value = "";
  };

  const handleHeroUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      compressImage(file, (dataUrl) => {
        setDroppedImage(dataUrl);
      });
    }
    
    // Reset file input to allow selecting the same file again
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      compressImage(file, (dataUrl) => {
        setDroppedImage(dataUrl);
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    // Reset the file inputs so you can reselect the same file if needed
    if (document.getElementById('file-upload-add')) document.getElementById('file-upload-add').value = "";
  };

  const handleSave = (status) => {
    // Combine dropped image (if any) with other images up to 3 total
    const combinedImages = [];
    if (droppedImage) combinedImages.push(droppedImage);
    combinedImages.push(...images);
    
    // Trim to 3 max just in case
    const finalImages = combinedImages.slice(0, 3);

    const productData = {
      id: Date.now(),
      ...product,
      images: finalImages,
      status: status || 'draft'
    };
    
    // Always store as draft down here so the Digital Atelier (Order Page) can pick it up
    localStorage.setItem("draftProduct", JSON.stringify(productData));
    
    if (status === 'published') {
      // Instead of publishing, direct to Digital Atelier Order section
      navigate('/order');
    } else {
      setPopupMessage("Draft Saved");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div className="layout">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>ADMIN PORTAL</h2>
            {/* Mobile Close Button */}
            <div className="mobile-sidebar-close" style={{ display: 'none' }} onClick={() => setIsSidebarOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </div>
          </div>
          <p>Management Suite</p>
        </div>
        
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/admin-dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            DASHBOARD
          </li>
          <li onClick={() => navigate('/admin-orders')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            ORDERS
          </li>
          <li className="active" onClick={() => navigate('/admin-product')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            PRODUCTS
          </li>
          <li onClick={() => navigate('/analytics')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            ANALYTICS
          </li>
        </ul>
        
        <div className="sidebar-footer" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>
          <div style={{width: 36, height: 36, borderRadius: '50%', backgroundColor: '#4a3aff', marginRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 'bold'}}>
            AA
          </div>
          <div>
            <h4>Alex Atelier</h4>
            <p>LEAD CURATOR</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header-top" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="hamburger-menu" onClick={() => setIsSidebarOpen(true)} style={{ color: '#111' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </div>
          <div className="breadcrumbs">
            <span className="purple-text">PRODUCTS</span> / CURATE PRODUCT
          </div>
        </div>
        
        <div className="page-header">
          <div className="title-area">
            <h1>New Masterpiece</h1>
            <p>Refine the essence of your next collection item. Our AI assists in every detail of the curation process.</p>
          </div>
          <div className="header-actions">
            <button className="btn-draft" onClick={() => handleSave('draft')}>Save Draft</button>
            <button className="btn-primary" onClick={() => handleSave('published')}>Create Product</button>
          </div>
        </div>

        <div className="content-grid">
          {/* Left Column */}
          <div className="left-column">
            
            <div className="card">
              <div className="card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M3 12h18"/><path d="M7 7l10 10"/><path d="M17 7L7 17"/></svg>
                <h3>Core Identity</h3>
              </div>
              <div className="form-group">
                <label>PRODUCT TITLE</label>
                <input 
                  type="text" 
                  name="name" 
                  value={product.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Midnight Silk Sculpture"
                />
              </div>
              <div className="form-group">
                <label>EDITORIAL DESCRIPTION</label>
                <textarea 
                  name="description" 
                  value={product.description} 
                  onChange={handleInputChange} 
                  placeholder="Describe the soul of this product..."
                ></textarea>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <h3>Logistics & Valuation</h3>
              </div>
              <div className="row">
                <div className="form-group">
                  <label>LISTING PRICE (USD)</label>
                  <div className="input-group">
                    <span>$</span>
                    <input 
                      type="number" 
                      name="price" 
                      value={product.price} 
                      onChange={handleInputChange} 
                      placeholder="0.00" 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>AVAILABLE STOCK</label>
                  <input 
                    type="number" 
                    name="quantity" 
                    value={product.quantity} 
                    onChange={handleInputChange} 
                    placeholder="Quantity" 
                  />
                </div>
              </div>
              <div className="form-group" style={{marginTop: 10, position: 'relative'}}>
                <label>COLLECTION CATEGORY</label>
                <div 
                  className="custom-select-box" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span style={{color: product.category ? 'var(--text-primary)' : '#8c8a9e'}}>{product.category || 'Select Category'}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                
                {dropdownOpen && (
                  <ul className="custom-dropdown-list">
                    {categories.map(c => (
                      <li key={c} onClick={() => {
                        setProduct({ ...product, category: c });
                        setDropdownOpen(false);
                      }}>
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="right-column">
            
            <div className="card visual-portfolio">
              <div className="card-header flex-between">
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 10}}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  <h3 style={{marginLeft: 0}}>Visual Portfolio</h3>
                </div>
                <span className="max-text">MAX 3 IMAGES</span>
              </div>
              
              <div 
                className={`drop-zone ${droppedImage ? 'has-image' : ''}`}
                onDragOver={handleDragOver} 
                onDrop={handleDrop}
                style={droppedImage ? { padding: 0, overflow: 'hidden', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}
              >
                {droppedImage ? (
                  <div style={{position: 'absolute', inset: 0}}>
                     <img src={droppedImage} alt="Hero block" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
                     <button className="remove-btn" style={{top: 10, right: 10}} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDroppedImage(null); }}>✕</button>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </div>
                    <h4>Drop the aesthetic here</h4>
                    <p>PNG, JPG or RAW formats accepted</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleHeroUpload} 
                      id="hero-upload" 
                      style={{display: 'none'}}
                    />
                    <label htmlFor="hero-upload" className="upload-label"></label>
                  </>
                )}
              </div>

              <div className="image-preview-list">
                {images.map((src, i) => (
                  <div key={i} className="image-preview">
                    <img src={src} alt="preview" />
                    <button className="remove-btn" onClick={() => removeImage(i)}>✕</button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="add-image-btn" htmlFor="file-upload-add">
                    +
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      id="file-upload-add" 
                      style={{display: 'none'}}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="card smart-analysis">
              <div className="analysis-header">
                <div className="ai-icon" style={{display:'flex', alignItems:'center', justifyContent:'center', color:'#fff'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </div>
                <div>
                  <h3>Smart Analysis</h3>
                  <p>POWERED BY ATELIER INTELLIGENCE</p>
                </div>
              </div>
              <div className="analysis-box">
                "Based on the description and initial imagery, I recommend focusing on the <strong>hand-stitched detailing</strong> and <strong>sustainable origin</strong> to increase conversion by an estimated 14%."
              </div>
              <div className="tags-section">
                <label>SUGGESTED DISCOVERABILITY TAGS</label>
                <div className="tags">
                  <span className="tag">#sustainableLuxury</span>
                  <span className="tag">#atelierExclusive</span>
                  <span className="tag">#minimalistDesign</span>
                  <span className="tag add-tag">+ Add Tag</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4a3aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{margin:'0 auto 15px'}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <p>{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProduct;
