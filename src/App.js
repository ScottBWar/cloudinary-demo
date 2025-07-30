// src/App.js
import React, { useState } from 'react';
import './app.css';

// Your massive product images (replace with your actual image filenames)
const products = [
  { id: 1, name: 'Premium Product 1', image: './car1.jpg', price: '$299' },
  { id: 2, name: 'Premium Product 2', image: './car2.jpg', price: '$399' },
  { id: 3, name: 'Premium Product 3', image: './car3.jpg', price: '$199' },
  { id: 4, name: 'Premium Product 3', image: './car4.jpg', price: '$199' },
];

function App() {
  const [useCloudinary, setUseCloudinary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Replace with your actual Cloudinary cloud name
  const CLOUDINARY_CLOUD_NAME = 'dj7hg86pg';

  const getImageUrl = (imagePath) => {
    if (useCloudinary) {
      // Cloudinary optimization: auto format, auto quality, width 400px
      return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto,w_400,c_fill,g_center/${window.location.origin}${imagePath}`;
    }
    // Original massive image
    return imagePath;
  };

  const handleToggle = () => {
    setIsLoading(true);
    setUseCloudinary(!useCloudinary);
    
    // Simulate brief loading state for dramatic effect
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <h1>SlowStore - Premium E-commerce</h1>
        <p>Experience the difference optimization makes</p>
      </header>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="status">
          <strong>Current Status:</strong> 
          <span className={useCloudinary ? 'optimized' : 'unoptimized'}>
            {useCloudinary ? '⚡ Cloudinary Optimized' : '🐌 Unoptimized Images'}
          </span>
        </div>
        
        <button 
          className={`toggle-btn ${useCloudinary ? 'optimized' : 'slow'}`}
          onClick={handleToggle}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Loading...' : (
            useCloudinary ? '🐌 Show Original (Slow)' : '⚡ Enable Cloudinary'
          )}
        </button>
      </div>

      {/* Performance Hint */}
      <div className="performance-hint">
        <p>💡 <strong>Demo Tip:</strong> Open DevTools → Network tab to see the file size difference!</p>
        {!useCloudinary && (
          <p className="warning">⚠️ Warning: Loading large unoptimized images...</p>
        )}
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <h2>Featured Products</h2>
        <div className="hero-image">
          <img 
            src={getImageUrl('/hero.jpg')} 
            alt="Hero Product"
            onLoad={() => console.log('Hero image loaded')}
          />
        </div>
      </section>

      {/* Product Grid */}
      <section className="products-section">
        <h2>Our Premium Collection</h2>
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={getImageUrl(product.image)} 
                  alt={product.name}
                  loading="lazy"
                  onLoad={() => console.log(`${product.name} loaded`)}
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">{product.price}</p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Stats */}
      <div className="performance-stats">
        <h3>Performance Impact</h3>
        <div className="stats-grid">
          <div className="stat">
            <span className="label">Image Format:</span>
            <span className="value">{useCloudinary ? 'Auto (WebP/AVIF)' : 'Original (JPEG)'}</span>
          </div>
          <div className="stat">
            <span className="label">Compression:</span>
            <span className="value">{useCloudinary ? 'Auto-optimized' : 'Uncompressed'}</span>
          </div>
          <div className="stat">
            <span className="label">Resize:</span>
            <span className="value">{useCloudinary ? 'Dynamic (400px)' : 'Original (4000px+)'}</span>
          </div>
          <div className="stat">
            <span className="label">CDN:</span>
            <span className="value">{useCloudinary ? 'Global Edge Network' : 'Single Server'}</span>
          </div>
        </div>
      </div>

      {/* Footer with Datadog Integration Note */}
      <footer className="footer">
        <p>💻 <strong>Monitor this performance with Datadog RUM</strong></p>
        <p>Track Core Web Vitals, page load times, and user experience metrics in real-time</p>
      </footer>
    </div>
  );
}

export default App;