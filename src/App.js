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
    const [useCloudinary, setUseCloudinary] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [forceRerender, setForceRerender] = useState(0);
  
    // Initialize Cloudinary
    const cld = new Cloudinary({ cloud: { cloudName: 'dj7hg86pg' } });
  
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
  
    const handleToggle = () => {
      console.log('🔄 Toggle clicked! Current useCloudinary:', useCloudinary);
      setIsLoading(true);
      
      setTimeout(() => {
        const newValue = !useCloudinary;
        console.log('🔄 Setting useCloudinary to:', newValue);
        setUseCloudinary(newValue);
        setForceRerender(prev => prev + 1); // Force complete re-render
        setIsLoading(false);
      }, 300);
    };
  
    // Initialize DataDog RUM properly
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
                sessionReplaySampleRate: 20,
                trackResources: true,
                trackLongTasks: true,
                defaultPrivacyLevel: 'mask-user-input'
            });

            // Start session replay recording
            datadogRum.startSessionReplayRecording();
            
            console.log('🐕 DataDog RUM initialized successfully!');
        } catch (error) {
            console.error('❌ DataDog RUM initialization failed:', error);
        }
    }, []); // Only run once on mount
      

    // Force re-render when toggle changes
    useEffect(() => {
      console.log('✨ useCloudinary changed to:', useCloudinary, 'forceRerender:', forceRerender);
    }, [useCloudinary, forceRerender]);
  
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '30px' }}>
          
          {/* Header */}
          <header style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#333', marginBottom: '10px' }}>SlowStore - Premium E-commerce</h1>
            <p style={{ color: '#666' }}>Experience the difference optimization makes</p>
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
              <strong>Current Status:</strong> 
              <span style={{ 
                color: useCloudinary ? '#28a745' : '#dc3545',
                marginLeft: '10px',
                fontWeight: 'bold'
              }}>
                {useCloudinary ? '⚡ Cloudinary Optimized' : '🐌 Unoptimized Images'}
              </span>
              <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
                Debug: useCloudinary = {useCloudinary.toString()}, forceRerender = {forceRerender}
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
                useCloudinary ? '🐌 Show Original (Slow)' : '⚡ Enable Cloudinary'
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
              💡 <strong>Demo Tip:</strong> Open DevTools → Network tab to see the file size difference!
            </p>
            {!useCloudinary && (
              <p style={{ margin: '0', color: '#721c24', backgroundColor: '#f8d7da', padding: '8px', borderRadius: '4px' }}>
                ⚠️ Warning: Loading large unoptimized images...
              </p>
            )}
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
                <div key={`${product.id}-${useCloudinary}-${forceRerender}`} style={{
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
            Force rerender key: {forceRerender}<br />
            Image keys will be: {products.map(p => `${useCloudinary ? 'cloudinary' : 'original'}-${p.id}-${forceRerender}`).join(', ')}
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
            <p style={{ margin: '0 0 10px 0' }}>💻 <strong>Monitor this performance with Datadog RUM</strong></p>
            <p style={{ margin: '0 0 10px 0' }}>Track Core Web Vitals, page load times, and user experience metrics in real-time</p>
            <div style={{ fontSize: '14px', opacity: '0.8' }}>
              <p style={{ margin: '0' }}>🔧 <strong>Tech Stack:</strong> React + Cloudinary SDK + GitHub Actions + Datadog RUM</p>
            </div>
          </footer>
        </div>
      </div>
    );
  }
  
  export default App;