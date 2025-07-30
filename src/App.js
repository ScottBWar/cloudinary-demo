// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';
import './app.css';

// Your massive product images
const products = [
  { id: 1, name: 'Premium Product 1', image: 'car1', price: '$299' },
  { id: 2, name: 'Premium Product 2', image: 'car2', price: '$399' },
  { id: 3, name: 'Premium Product 3', image: 'car3', price: '$199' },
  { id: 4, name: 'Premium Product 4', image: 'car4', price: '$199' },
];

// Store component that handles the actual display
function Store({ mode }) {
  const location = useLocation();
  const useCloudinary = mode === 'optimized';
  const useStudioMode = mode === 'studio';
  
  // Initialize Cloudinary
  const cld = new Cloudinary({ cloud: { cloudName: 'dj7hg86pg' } });

  // Initialize DataDog RUM once with React Router support
  useEffect(() => {
    try {
      datadogRum.init({
        applicationId: '60464aa4-95a0-47ff-8643-1a23528e905a',
        clientToken: 'pub9144959c13149ab658ae482098a43ff4',
        site: 'us5.datadoghq.com',
        service: 'cloudinary-demo',
        env: 'production',
        version: '1.0.0',
        sessionSampleRate: 100,
        sessionReplaySampleRate: 0,
        trackResources: false,
        trackLongTasks: false, 
        trackUserInteractions: false,
        defaultPrivacyLevel: 'mask-user-input',
        plugins: [
          reactPlugin({ router: true }) // Enable React Router tracking
        ]
      });
      
      console.log(`🐕 DataDog RUM initialized with React Router support - route: ${location.pathname}`);
    } catch (error) {
      console.error('❌ DataDog RUM initialization failed:', error);
    }
  }, []);

  // Track route changes for DataDog
  useEffect(() => {
    console.log(`📊 Route changed to: ${location.pathname}`);
  }, [location.pathname]);

  const getOptimizedImage = (imageName) => {
    const img = cld
      .image(imageName)
      .format('auto')
      .quality('auto') 
      .resize(auto().gravity(autoGravity()).width(400).height(300));
    
    console.log(`🔗 Cloudinary URL for ${imageName}:`, img.toURL());
    return img;
  };

  const getStudioBackgroundImage = (imageName) => {
    const img = cld
      .image(imageName)
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()).width(400).height(300))
      .effect('background_removal')
      .backgroundColor('#f8f9fa');
    
    console.log(`🔗 Studio background URL for ${imageName}:`, img.toURL());
    return img;
  };

  // Get mode info for display
  const getModeInfo = () => {
    if (useStudioMode) {
      return {
        color: '#7c3aed',
        label: '🎨 Studio Mode (AI Backgrounds)',
        nextRoute: '/standard',
        nextLabel: '🐌 Go to Standard Mode'
      };
    } else if (useCloudinary) {
      return {
        color: '#28a745', 
        label: '⚡ Optimized Mode (Cloudinary)',
        nextRoute: '/studio',
        nextLabel: '🎨 Go to Studio Mode'
      };
    } else {
      return {
        color: '#dc3545',
        label: '🐌 Standard Mode (Unoptimized)', 
        nextRoute: '/optimized',
        nextLabel: '⚡ Go to Optimized Mode'
      };
    }
  };

  const modeInfo = getModeInfo();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '30px' }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '10px' }}>SlowStore - Premium E-commerce</h1>
          <p style={{ color: '#666' }}>Experience the difference optimization makes</p>
          <div style={{ fontSize: '12px', color: '#28a745', marginTop: '5px' }}>
            🐕 DataDog RUM Active - Route: {location.pathname}
          </div>
        </header>

        {/* Control Panel */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          border: '1px solid #dee2e6'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <strong>Current Route:</strong> 
            <span style={{ 
              color: modeInfo.color,
              marginLeft: '10px',
              fontWeight: 'bold'
            }}>
              {modeInfo.label}
            </span>
            <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
              Path: {location.pathname}
            </div>
          </div>
          
          <Link 
            to={modeInfo.nextRoute}
            style={{
              backgroundColor: modeInfo.color,
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            {modeInfo.nextLabel}
          </Link>
        </div>

        {/* Performance Hint */}
        <div style={{ 
          backgroundColor: '#e7f3ff', 
          padding: '15px', 
          borderRadius: '6px', 
          marginBottom: '30px',
          border: '1px solid #b8daff'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#004085' }}>
            💡 <strong>DataDog Monitoring:</strong> Each route appears as a separate view
          </p>
          <p style={{ margin: '0 0 10px 0', color: '#004085' }}>
            🐕 <strong>Clean Analytics:</strong> /standard vs /optimized vs /studio
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: '#004085' }}>
            📋 <strong>Routes:</strong> /standard • /optimized • /studio
          </p>
        </div>

        {/* Product Grid */}
        <section>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Our Premium Collection</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '20px' 
          }}>
            {products.map(product => (
              <div key={`${product.id}-${mode}`} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'transform 0.2s'
              }}>
                <div style={{ height: '250px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                <div className="product-image">
                  {useStudioMode && (
                      <AdvancedImage 
                      key={`studio-${product.id}`}
                      cldImg={getStudioBackgroundImage(product.image)} 
                      alt={product.name}
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                      />
                  )}
                  {useCloudinary && !useStudioMode && (
                      <AdvancedImage 
                      key={`cloud-${product.id}`}
                      cldImg={getOptimizedImage(product.image)} 
                      alt={product.name}
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                      />
                  )}
                  {!useCloudinary && !useStudioMode && (
                      <img 
                      key={`local-${product.id}`}
                      src={`${process.env.PUBLIC_URL}/${product.image}.jpg`} 
                      alt={product.name}
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                      />
                  )}
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{product.name}</h3>
                  <p style={{ 
                    margin: '0 0 15px 0', 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: '#28a745' 
                  }}>
                    {product.price}
                  </p>
                  <button style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%'
                  }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Stats */}
        <div style={{ 
          marginTop: '40px', 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px' 
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Performance Impact</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#666' }}>Image Format:</span><br />
              <span style={{ color: (useCloudinary || useStudioMode) ? '#28a745' : '#dc3545' }}>
                {(useCloudinary || useStudioMode) ? 'Auto (WebP/AVIF)' : 'Original (JPEG)'}
              </span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#666' }}>Compression:</span><br />
              <span style={{ color: (useCloudinary || useStudioMode) ? '#28a745' : '#dc3545' }}>
                {(useCloudinary || useStudioMode) ? 'Auto-optimized' : 'Uncompressed'}
              </span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#666' }}>Processing:</span><br />
              <span style={{ color: useStudioMode ? '#7c3aed' : (useCloudinary ? '#28a745' : '#dc3545') }}>
                {useStudioMode ? 'AI Background Removal' : useCloudinary ? 'Smart Crop (400x300)' : 'Original (4000px+)'}
              </span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#666' }}>CDN:</span><br />
              <span style={{ color: (useCloudinary || useStudioMode) ? '#28a745' : '#dc3545' }}>
                {(useCloudinary || useStudioMode) ? 'Global Edge Network' : 'Local Server'}
              </span>
            </div>
          </div>
        </div>

        {/* Debug Section */}
        <div style={{ 
          marginTop: '30px', 
          backgroundColor: '#1a1a1a', 
          color: '#00ff00', 
          padding: '15px', 
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          <strong style={{ color: 'white' }}>🐛 Debug Info:</strong><br />
          Current route: {location.pathname}<br />
          Mode: {mode}<br />
          Processing: {useStudioMode ? 'AI_STUDIO' : useCloudinary ? 'CLOUDINARY' : 'LOCAL'}<br />
          DataDog view name: {location.pathname}<br />
        </div>

        {/* Footer */}
        <footer style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          padding: '20px', 
          backgroundColor: '#343a40', 
          color: 'white', 
          borderRadius: '6px' 
        }}>
          <p style={{ margin: '0 0 10px 0' }}>💻 <strong>DataDog RUM: Clean Route Tracking</strong></p>
          <p style={{ margin: '0 0 10px 0' }}>Perfect separation of performance metrics by route</p>
          <div style={{ fontSize: '14px', opacity: '0.8' }}>
            <p style={{ margin: '0' }}>🔧 <strong>Routes:</strong> /standard vs /optimized vs /studio</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router basename="/cloudinary-demo">
      <Routes>
        <Route path="/" element={<Store mode="standard" />} />
        <Route path="/standard" element={<Store mode="standard" />} />
        <Route path="/optimized" element={<Store mode="optimized" />} />
        <Route path="/studio" element={<Store mode="studio" />} />
      </Routes>
    </Router>
  );
}

export default App;