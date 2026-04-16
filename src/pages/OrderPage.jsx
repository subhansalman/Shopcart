import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AtelierHeader from '../components/AtelierHeader';
import './OrderPage.css';

function OrderPage() {
  const navigate = useNavigate();
  const initialProductState = {
    name: '',
    category: '',
    sku: '',
    description: '',
    price: '',
    basePrice: '',
    discountRate: '',
    inStock: true,
    quantity: '',
    shippingWeight: '',
    visibilityNew: true,
    visibilitySustainable: false
  };
  const [product, setProduct] = useState(() => {
    const draft = localStorage.getItem("draftProduct");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        return {
          ...initialProductState,
          ...parsed,
          basePrice: parsed.price || '',
          stockQuantity: parsed.quantity || ''
        };
      } catch (e) { return initialProductState; }
    }
    return initialProductState;
  });

  const [images, setImages] = useState(() => {
    const draft = localStorage.getItem("draftProduct");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        const loadedImages = parsed.images || [];
        return loadedImages.slice(1);
      } catch (e) { return []; }
    }
    return [];
  });

  const [droppedImage, setDroppedImage] = useState(() => {
    const draft = localStorage.getItem("draftProduct");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        const loadedImages = parsed.images || [];
        return loadedImages.length > 0 ? loadedImages[0] : null;
      } catch (e) { return null; }
    }
    return null;
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = [
    "Electronics", "Clothing", "Footwear", "Accessories",
    "Home & Garden", "Sports", "Beauty", "Toys"
  ];

  // Auto-save effect
  useEffect(() => {
    const combinedImages = [];
    if (droppedImage) combinedImages.push(droppedImage);
    combinedImages.push(...images);
    const finalImages = combinedImages.slice(0, 3);
    
    const draftData = {
      ...product,
      images: finalImages
    };
    localStorage.setItem("draftProduct", JSON.stringify(draftData));
  }, [product, images, droppedImage]);

  // Clear draft on page refresh as requested
  useEffect(() => {
    const navigationEntries = window.performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
      localStorage.removeItem("draftProduct");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    e.target.value = "";
  };

  const handleHeroUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      compressImage(file, (dataUrl) => {
        setDroppedImage(dataUrl);
      });
    }
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (document.getElementById('order-file-upload-add')) document.getElementById('order-file-upload-add').value = "";
  };

  const handleDiscard = () => {
    localStorage.removeItem("draftProduct");
    setProduct(initialProductState);
    setImages([]);
    setDroppedImage(null);
  };

  const handlePublish = () => {
    // Validation: Require name and at least one image
    const hasImages = droppedImage || images.length > 0;
    if (!product.name.trim() || !hasImages) {
      setPopupText("Please fill the product info");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    try {
      let publishedProducts = [];
      try {
        const stored = localStorage.getItem('publishedProducts');
        publishedProducts = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(publishedProducts)) publishedProducts = [];
      } catch (e) {
        publishedProducts = [];
      }
      
      const combinedImages = [];
      if (droppedImage) combinedImages.push(droppedImage);
      combinedImages.push(...images);
      const finalImages = combinedImages.slice(0, 3);
      
      const finalProduct = {
        ...product,
        price: product.basePrice || product.price || "0.00",
        quantity: product.stockQuantity || product.quantity || "0",
        images: finalImages,
        id: Date.now(),
        status: 'published'
      };
      
      publishedProducts.push(finalProduct);
      
      try {
        localStorage.setItem('publishedProducts', JSON.stringify(publishedProducts));
      } catch (e) {
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          // If storage is full, remove oldest half and try again
          if (publishedProducts.length > 1) {
            const halfIndex = Math.floor(publishedProducts.length / 2);
            publishedProducts.splice(0, halfIndex);
            try {
              localStorage.setItem('publishedProducts', JSON.stringify(publishedProducts));
            } catch (retryError) {
              // Still full? Keep only the new one
              localStorage.setItem('publishedProducts', JSON.stringify([finalProduct]));
            }
          } else {
            // New product itself is too big? Just clear published list and try once more
            localStorage.setItem('publishedProducts', JSON.stringify([finalProduct]));
          }
        } else {
          throw e;
        }
      }

      localStorage.removeItem('draftProduct');
      // Reset form state correctly after publication
      setProduct(initialProductState);
      setImages([]);
      setDroppedImage(null);

      setPopupText("Product Published Successfully!");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error("Error publishing product:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };


  return (
    <div className="dash-layout">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
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
          <li className="active" onClick={() => navigate('/order')}>
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
      <main className="order-main">
        {/* Top Navbar */}
        <AtelierHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="order-top">
          <div className="order-breadcrumbs">
            Products &gt; <strong>Create New Product</strong>
          </div>
          <div className="order-actions">
            <button className="btn-discard" onClick={handleDiscard}>Discard</button>
            <button className="btn-publish" onClick={handlePublish}>Publish Product</button>
          </div>
        </div>
        
        <div className="order-header">
          <h1>New Creation</h1>
          <p>Define the core identity, visual aesthetic, and logistical details of your next masterpiece.</p>
        </div>

        <div className="order-grid">
          {/* Left Large Column */}
          <div>
            {/* Core Identity */}
            <div className="order-card">
              <div className="order-card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a3aff" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                <h3>CORE IDENTITY</h3>
              </div>
              
              <div className="fieldset">
                <label>PRODUCT NAME</label>
                <input 
                  type="text" 
                  name="name" 
                  value={product.name || ''} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Midnight Silk Blazer" 
                />
              </div>

              <div className="row-group">
                <div className="fieldset" style={{position: 'relative'}}>
                  <label>CATEGORY</label>
                  <div 
                    className="order-custom-select-box" 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span style={{color: product.category ? '#111' : '#6a6a7c'}}>{product.category || 'Select Category'}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                  
                  {dropdownOpen && (
                    <ul className="order-custom-dropdown-list">
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
                <div className="fieldset">
                  <label>SKU REFERENCE</label>
                  <input 
                    type="text" 
                    name="sku" 
                    value={product.sku || ''} 
                    onChange={handleInputChange} 
                    placeholder="DA-2024-001" 
                  />
                </div>
              </div>

              <div className="fieldset" style={{marginBottom: 0}}>
                <label>EDITORIAL DESCRIPTION</label>
                <textarea 
                  name="description" 
                  value={product.description || ''} 
                  onChange={handleInputChange} 
                  placeholder="Describe the craftsmanship and inspiration..." 
                />
              </div>
            </div>

            {/* Visual Portfolio */}
            <div className="order-card">
              <div className="order-card-header between">
                <div style={{display:'flex', alignItems:'center'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a3aff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  <h3>VISUAL PORTFOLIO</h3>
                </div>
                <span style={{fontSize: 9, fontWeight: 700, backgroundColor: '#eaeaf0', padding: '3px 8px', borderRadius: 4, color: '#6a6a7c'}}>MAX 3 IMAGES</span>
              </div>
              
              <div className="visual-grid">
                <div className="main-hero">
                  {droppedImage ? (
                    <>
                      <img src={droppedImage} alt="Hero" />
                      <button className="rem-btn-hero" onClick={(e) => { e.preventDefault(); setDroppedImage(null); }}>✕</button>
                    </>
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginBottom: 5, color: '#a09fb0'}}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      MAIN HERO IMAGE
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleHeroUpload} 
                        id="order-hero-upload" 
                        style={{display: 'none'}}
                      />
                      <label htmlFor="order-hero-upload" style={{position: 'absolute', inset: 0, cursor: 'pointer'}}></label>
                    </>
                  )}
                </div>
                <div className="small-images">
                  {images.map((src, i) => (
                    <div key={i} className="small-image-box">
                      <img src={src} alt={`Img ${i}`} />
                      <button className="rem-btn-hero" onClick={() => removeImage(i)}>✕</button>
                    </div>
                  ))}
                  {images.length < 3 && (
                    <label className="small-image-box" htmlFor="order-file-upload-add">
                      +
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        id="order-file-upload-add" 
                        style={{display: 'none'}}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Narrow Column */}
          <div>
            
            {/* Valuation */}
            <div className="order-card">
              <div className="order-card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a3aff" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                <h3>VALUATION</h3>
              </div>
              
              <div className="fieldset">
                <label>BASE RETAIL PRICE (USD)</label>
                <div className="input-with-symbol">
                  <span>$</span>
                  <input 
                    type="text" 
                    name="basePrice" 
                    value={product.basePrice || ''} 
                    onChange={handleInputChange} 
                    placeholder="0.00" 
                  />
                </div>
              </div>
              
              <div className="fieldset" style={{marginBottom: 0}}>
                <label>DISCOUNTED RATE (OPTIONAL)</label>
                <div className="input-with-symbol">
                  <span>$</span>
                  <input 
                    type="text" 
                    name="discountRate" 
                    value={product.discountRate || ''} 
                    onChange={handleInputChange} 
                    placeholder="0.00" 
                  />
                </div>
              </div>
            </div>

            {/* Logistics */}
            <div className="order-card">
              <div className="order-card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a3aff" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M7 15h0M2 9h20"></path></svg>
                <h3>LOGISTICS</h3>
              </div>
              
              <div className="stock-toggle-box">
                <div className="stock-toggle-text">
                  <strong>In Stock</strong>
                  <span>ACTIVE INVENTORY</span>
                </div>
                <label className="switch">
                  <input type="checkbox" name="inStock" checked={product.inStock} onChange={handleInputChange} />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="fieldset">
                <label>STOCK QUANTITY</label>
                <input 
                  type="text" 
                  name="stockQuantity" 
                  value={product.stockQuantity || ''} 
                  onChange={handleInputChange} 
                  placeholder="12" 
                />
              </div>

              <div className="fieldset">
                <label>SHIPPING WEIGHT (KG)</label>
                <input 
                  type="text" 
                  name="shippingWeight" 
                  value={product.shippingWeight || ''} 
                  onChange={handleInputChange} 
                  placeholder="0.85" 
                />
              </div>

              <div style={{marginTop: 20}}>
                <label style={{display: 'block', fontSize: 10, fontWeight: 700, color: '#6a6a7c', marginBottom: 10, letterSpacing: 0.5}}>GLOBAL VISIBILITY</label>
                <div className="checkbox-group">
                  <input type="checkbox" id="newarrivals" name="visibilityNew" checked={product.visibilityNew} onChange={handleInputChange}/>
                  <label htmlFor="newarrivals">Feature in "New Arrivals" gallery</label>
                </div>
                <div className="checkbox-group" style={{marginBottom: 0}}>
                  <input type="checkbox" id="sustainable" name="visibilitySustainable" checked={product.visibilitySustainable} onChange={handleInputChange}/>
                  <label htmlFor="sustainable">Apply "Sustainable" badge</label>
                </div>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="order-card ai-card">
              <div className="order-card-header" style={{marginBottom: 10}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a3aff" strokeWidth="2"><path d="M12 3v18"/><path d="M3 12h18"/><path d="M7 7l10 10"/><path d="M17 7L7 17"/></svg>
                <h3>AI SUGGESTION</h3>
              </div>
              <p>Based on your title, "{product.name || 'Midnight Silk'}" typically performs best in the Evening Wear collection with a premium margin.</p>
            </div>

          </div>
        </div>
      </main>

      {/* Published Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>{popupText}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderPage;
