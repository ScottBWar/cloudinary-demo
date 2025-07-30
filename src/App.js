// src/App.js
import React, { useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import './app.css';

// Your massive product images (these should match your actual image files in public/)
const products = [
  { id: 1, name: 'Premium Product 1', image: 'car1', price: '$299' },
  { id: 2, name: 'Premium Product 2', image: 'car2', price: '$399' },
  { id: 3, name: 'Premium Product 3', image: 'car3', price: '$199' },
];

function App() {
    const [useCloudinary, setUseCloudinary] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  
    // Initialize Cloudinary with your cloud name
    const cld = new Cloudinary({ cloud: { cloudName: 'dj7hg86pg' } });
  
    const getOptimizedImage = (imageName) => {
      return cld
        .image(imageName)
        .format('auto')              // Auto format (WebP, AVIF when supported)
        .quality('auto')             // Auto quality optimization
        .resize(auto().gravity(autoGravity()).width(400).height(300)); // Smart crop to 400x300
    };
  
    const handleToggle = () => {
      setIsLoading(true);
      
      if (!useCloudinary) {
        // Preload Cloudinary images before showing them
        const imagesToPreload = ['hero', ...products.map(p => p.image)];
        let loadedCount = 0;
        
        imagesToPreload.forEach(imageName => {
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            if (loadedCount === imagesToPreload.length) {
              setUseCloudinary(true);
              setIsLoading(false);
            }
          };
          // Generate Cloudinary URL for preloading
          const cloudinaryUrl = getOptimizedImage(imageName).toURL();
          img.src = cloudinaryUrl;
        });
      } else {
        setUseCloudinary(false);
        setTimeout(() => setIsLoading(false), 200);
      }
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
            {useCloudinary ? (
              <AdvancedImage 
                cldImg={getOptimizedImage('hero')} 
                alt="Hero Product"
                onLoad={() => console.log('Cloudinary hero image loaded')}
                onError={(e) => console.error('Failed to load Cloudinary image:', e)}
              />
            ) : (
              <img 
                src={`${process.env.PUBLIC_URL}/hero.jpg`} 
                alt="Hero Product"
                onLoad={() => console.log('Original hero image loaded')}
                onError={(e) => console.error('Failed to load original image:', e)}
              />
            )}
          </div>
        </section>
  
        {/* Product Grid */}
        <section className="products-section">
          <h2>Our Premium Collection</h2>
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {/* Render both images but show/hide based on state */}
                  <AdvancedImage 
                    cldImg={getOptimizedImage(product.image)} 
                    alt={product.name}
                    loading="lazy"
                    style={{ display: useCloudinary ? 'block' : 'none' }}
                    onLoad={() => console.log(`Cloudinary ${product.name} loaded`)}
                    onError={(e) => {
                      console.error(`Failed to load Cloudinary image for ${product.name}:`, e);
                    }}
                  />
                  <img 
                    src={`${process.env.PUBLIC_URL}/${product.image}.jpg`} 
                    alt={product.name}
                    loading="lazy"
                    style={{ display: useCloudinary ? 'none' : 'block' }}
                    onLoad={() => console.log(`Original ${product.name} loaded`)}
                    onError={(e) => console.error(`Failed to load original image for ${product.name}:`, e)}
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
              <span className="value">{useCloudinary ? 'Smart Crop (400x300)' : 'Original (4000px+)'}</span>
            </div>
            <div className="stat">
              <span className="label">CDN:</span>
              <span className="value">{useCloudinary ? 'Global Edge Network' : 'GitHub Pages'}</span>
            </div>
          </div>
        </div>
  
        {/* Footer with Datadog Integration Note */}
        <footer className="footer">
          <p>💻 <strong>Monitor this performance with Datadog RUM</strong></p>
          <p>Track Core Web Vitals, page load times, and user experience metrics in real-time</p>
          <div style={{ marginTop: '10px', fontSize: '0.9em', opacity: '0.8' }}>
            <p>🔧 <strong>Tech Stack:</strong> React + Cloudinary SDK + GitHub Actions + Datadog RUM</p>
          </div>
        </footer>
      </div>
    );
  }
  
  export default App;