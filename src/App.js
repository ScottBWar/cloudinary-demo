// src/App.js
import React, { useState, useEffect } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import './app.css';
import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';


// Your massive product images (these should match your actual image files in public/)
const products = [
  { id: 1, name: 'Premium Product 1', image: 'car1', price: '$299' },
  { id: 2, name: 'Premium Product 2', image: 'car2', price: '$399' },
  { id: 3, name: 'Premium Product 3', image: 'car3', price: '$199' },
  { id: 4, name: 'Premium Product 4', image: 'car4', price: '$199' },
];

function App() {
    // Check URL for cloudinary parameter
    const urlParams = new URLSearchParams(window.location.search);
    const useCloudinary = urlParams.get('cloudinary') === 'true';
    
    const [isLoading, setIsLoading] = useState(false);
  
    // Initialize Cloudinary
    const cld = new Cloudinary({ cloud: { cloudName: 'dj7hg86pg' } });

    // Initialize DataDog RUM - ONLY track page loads
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
                sessionReplaySampleRate: 0, // Disabled
                trackResources: false, // Disabled - only page loads
                trackLongTasks: false, // Disabled
                trackUserInteractions: false, // Disabled
                defaultPrivacyLevel: 'mask-user-input'
            });
            
            console.log('🐕 DataDog RUM initialized - tracking page loads only');
        } catch (error) {
            console.error('❌ DataDog RUM initialization failed:', error);
        }
    }, []);
  
    const getOptimizedImage = (imageName) => {
      const img = cld
        .image(imageName)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(400).height(300));
      
      // Debug: Log the generated URL
      console.log(`🔗 Cloudinary URL for ${imageName}:`, img.toURL());
      return img;
    };

    // Navigate to different mode
    const handleToggle = () => {
      setIsLoading(true);
      const newUrl = useCloudinary 
        ? window.location.pathname // Remove cloudinary param
        : `${window.location.pathname}?cloudinary=true`; // Add cloudinary param
      
      setTimeout(() => {
        window.location.href = newUrl; // Full page reload for DataDog page load tracking
      }, 300);
    };
  
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '30px' }}>
          
          {/* Header */}
          <header style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#333', marginBottom: '10px' }}>SlowStore - Premium E-commerce</h1>
            <p style={{ color: '#666' }}>Experience the difference optimization makes</p>
            <div style={{ fontSize: '12px', color: '#28a745', marginTop: '5px' }}>
              🐕 DataDog RUM Active - Page Load Tracking Only
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
              <strong>Current Mode:</strong> 
              <span style={{ 
                color: useCloudinary ? '#28a745' : '#dc3545',
                marginLeft: '10px',
                fontWeight: 'bold'
              }}>
                {useCloudinary ? '⚡ Cloudinary Optimized' : '🐌 Unoptimized Images'}
              </span>
              <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
                URL: {window.location.href}
              </div>
            </div>
            
            <button 
              onClick={handleToggle}
              disabled={isLoading}
              style={{
                backgroundColor: useCloudinary ? '#dc3545' : '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? '0.6' : '1'
              }}
            >
              {isLoading ? '⏳ Loading...' : (
                useCloudinary ? '🐌 Switch to Original (Slow)' : '⚡ Switch to Cloudinary'
              )}
            </button>
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
              💡 <strong>Demo Tip:</strong> Each mode switch triggers a full page reload for DataDog tracking
            </p>
            <p style={{ margin: '0 0 10px 0', color: '#004085' }}>
              🐕 <strong>DataDog:</strong> Recording page load performance for each mode
            </p>
            <p style={{ margin: '0', fontSize: '12px', color: '#004085' }}>
              📋 <strong>URLs:</strong><br />
              • Unoptimized: {window.location.origin}{window.location.pathname}<br />
              • Optimized: {window.location.origin}{window.location.pathname}?cloudinary=true
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
                <div key={`${product.id}-${useCloudinary}`} style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s'
                }}>
                  <div style={{ height: '250px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                  <div className="product-image">
                    {useCloudinary && (
                        <AdvancedImage 
                        key={`cloud-${product.id}`}
                        cldImg={getOptimizedImage(product.image)} 
                        alt={product.name}
                        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                        />
                    )}
                    {!useCloudinary && (
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
                <span style={{ color: useCloudinary ? '#28a745' : '#dc3545' }}>
                  {useCloudinary ? 'Auto (WebP/AVIF)' : 'Original (JPEG)'}
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontWeight: 'bold', color: '#666' }}>Compression:</span><br />
                <span style={{ color: useCloudinary ? '#28a745' : '#dc3545' }}>
                  {useCloudinary ? 'Auto-optimized' : 'Uncompressed'}
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontWeight: 'bold', color: '#666' }}>Resize:</span><br />
                <span style={{ color: useCloudinary ? '#28a745' : '#dc3545' }}>
                  {useCloudinary ? 'Smart Crop (400x300)' : 'Original (4000px+)'}
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontWeight: 'bold', color: '#666' }}>CDN:</span><br />
                <span style={{ color: useCloudinary ? '#28a745' : '#dc3545' }}>
                  {useCloudinary ? 'Global Edge Network' : 'Local Server'}
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
            Current mode: {useCloudinary ? 'CLOUDINARY' : 'LOCAL'}<br />
            URL Parameter: cloudinary={urlParams.get('cloudinary') || 'not set'}<br />
            DataDog RUM: Tracking page loads only<br />
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
            <p style={{ margin: '0 0 10px 0' }}>💻 <strong>Monitor page load performance with Datadog RUM</strong></p>
            <p style={{ margin: '0 0 10px 0' }}>Compare page load times between optimized and unoptimized versions</p>
            <div style={{ fontSize: '14px', opacity: '0.8' }}>
              <p style={{ margin: '0' }}>🔧 <strong>Tech Stack:</strong> React + Cloudinary SDK + GitHub Actions + Datadog RUM</p>
            </div>
          </footer>
        </div>
      </div>
    );
  }
  
  export default App;