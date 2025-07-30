// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from '@datadog/browser-rum-react/react-router-v6';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';
import { Overlay } from '@cloudinary/url-gen/actions';
import { Position } from '@cloudinary/url-gen/qualifiers';
import { text } from '@cloudinary/url-gen/qualifiers/source';
import './app.css';

// Your massive product images
const products = [
    { id: 1, name: 'Ferrari 488 GTB', image: 'car1', price: '$280,000' },
    { id: 2, name: 'Trek Domane SLR', image: 'bike1', price: '$4,200' },
    { id: 3, name: 'Ferrari F8 Tributo', image: 'car2', price: '$276,550' },
    { id: 4, name: 'Specialized S-Works', image: 'bike2', price: '$8,500' },
    { id: 5, name: 'Canyon Aeroad CFR', image: 'bike3', price: '$3,800' },
    { id: 6, name: 'Ferrari 812 Superfast', image: 'car3', price: '$365,000' },
    { id: 7, name: 'McLaren 720S', image: 'car4', price: '$299,000' },
    { id: 8, name: 'Pinarello Dogma F', image: 'bike4', price: '$6,750' },
    { id: 9, name: 'Giant TCR Advanced', image: 'bike5', price: '$2,400' },
    { id: 10, name: 'Ferrari Roma', image: 'car5', price: '$222,620' },
    { id: 11, name: 'Lamborghini Huracán', image: 'car6', price: '$248,295' },
    { id: 12, name: 'Cervélo S5', image: 'bike6', price: '$5,200' },
    { id: 13, name: 'Porsche 911 Turbo S', image: 'car7', price: '$207,000' },
    { id: 14, name: 'Bianchi Oltre XR4', image: 'bike7', price: '$4,800' },
    { id: 15, name: 'Aston Martin DB11', image: 'car8', price: '$205,600' },
  ];


// Store component that handles the actual display
function Store({ mode }) {
  const location = useLocation();
  const useCloudinary = mode === 'optimized';
  const useStudioMode = mode === 'studio';
  
  // Initialize Cloudinary
  const cld = new Cloudinary({ cloud: { cloudName: 'dj7hg86pg' } });


  // Navigate to the other route with full page reload
const handleToggle = () => {
  let targetPath;
  if (useStudioMode) {
    targetPath = '/cloudinary-demo/standard';
  } else if (useCloudinary) {
    targetPath = '/cloudinary-demo/studio';
  } else {
    targetPath = '/cloudinary-demo/optimized';
  }
  window.location.href = `${window.location.origin}${targetPath}`;
};

  // Track route changes for DataDog
  useEffect(() => {
    console.log(`📊 Route changed to: ${location.pathname}`);
  }, [location.pathname]);

  const getOptimizedImage = (imageName) => {
    const img = cld
      .image(imageName)
      .format('auto')
      .quality('auto') 
      .resize(auto().gravity(autoGravity()).width(400).height(300))
      
    
    console.log(`🔗 Cloudinary URL for ${imageName}:`, img.toURL());
    return img;
  };

  const getStudioBackgroundImage = (imageName, price) => {
      // URL encode the price to handle commas
      const encodedPrice = encodeURIComponent(price);

    const img = cld
      .image(imageName)
      .namedTransformation('t_dealership-showroom-v2')
      .addTransformation(`l_text:Arial_60_bold:${encodedPrice},co_white,g_south_east,x_20,y_20`)

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
          <h1 style={{ color: '#333', marginBottom: '10px' }}>Welcome to SlowStore - Premium E-commerce</h1>
          <p style={{ color: '#666' }}>An Image Optimization / Customization Demo with Cloudinary </p>
          <p style={{ color: '#666' }}>Optimize Performance & Apply AI Transformations with no Performance Sacrifices </p>
          <div style={{ fontSize: '12px', color: '#28a745', marginTop: '5px' }}>
             Monitoring Route: {location.pathname}
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

        {/* Performance Hint
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
        </div> */}

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
                      cldImg={getStudioBackgroundImage(product.image, product.price)} 
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
                  <button 
                  onClick={handleToggle}
                  style={{
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
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Store mode="standard" />,
    },
    {
      path: '/standard',
      element: <Store mode="standard" />,
    },
    {
      path: '/optimized',
      element: <Store mode="optimized" />,
    },
    {
      path: '/studio',
      element: <Store mode="studio" />,
    }
  ],
  {
    basename: '/cloudinary-demo', // ✅ Important!
  });
  return <RouterProvider router={router} />;
}

export default App;