// components/TestShopifyConnection.tsx
import React, { useState } from 'react';

const TestShopifyConnection: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${import.meta.env.VITE_SHOPIFY_STORE_URL}/api/2023-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
          },
          body: JSON.stringify({
            query: `{
              products(first: 3) {
                edges {
                  node {
                    id
                    title
                    handle
                  }
                }
              }
            }`
          })
        }
      );

      const data = await response.json();
      
      if (data.errors) {
        setResult(`Error: ${JSON.stringify(data.errors, null, 2)}`);
      } else {
        setResult(`Success! Found ${data.data.products.edges.length} products:\n${JSON.stringify(data.data, null, 2)}`);
      }
    } catch (error) {
      setResult(`Network Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Test Shopify Connection</h2>
      <button 
        onClick={testConnection} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007cba', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      {result && (
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          marginTop: '15px',
          borderRadius: '4px',
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          {result}
        </pre>
      )}
    </div>
  );
};

export default TestShopifyConnection;