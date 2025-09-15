import React, { useEffect, useState } from 'react';

// TypeScript interfaces for type safety
interface ShopifyImage {
  url: string;
  altText?: string;
}

interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  priceRange: {
    minVariantPrice: ShopifyPrice;
  };
  availableForSale: boolean;
}

interface ProductsResponse {
  data?: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
  errors?: Array<{
    message: string;
    extensions?: {
      code: string;
    };
  }>;
}

const ProductFetcher: React.FC = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // GraphQL query to fetch products
  const PRODUCTS_QUERY = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            availableForSale
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    const storeUrl = import.meta.env.VITE_SHOPIFY_STORE_URL;
    const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

    setDebugInfo({
      storeUrl: storeUrl || 'NOT FOUND',
      tokenExists: !!token,
      tokenValid: token?.startsWith('shpat_')
    });

    if (!storeUrl || !token) {
      setError('Missing environment variables. Check your .env file.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${storeUrl}/api/2023-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': token,
          },
          body: JSON.stringify({
            query: PRODUCTS_QUERY,
            variables: { first: 10 }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ProductsResponse = await response.json();

      if (result.errors) {
        const errorMessage = result.errors
          .map(err => `${err.message} (${err.extensions?.code || 'Unknown'})`)
          .join(', ');
        setError(`Shopify API Error: ${errorMessage}`);
        return;
      }

      if (result.data?.products?.edges) {
        const productList = result.data.products.edges.map(edge => edge.node);
        setProducts(productList);
        setError(null);
      } else {
        setError('No products data received from API');
      }

    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatPrice = (price: ShopifyPrice): string => {
    const amount = parseFloat(price.amount);
    return `${price.currencyCode} ${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '18px' }}>Loading products...</div>
        <div style={{ marginTop: '10px', color: '#666' }}>Fetching from Shopify...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Our Products</h1>
      
      {/* Debug Info - Remove in production */}
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        marginBottom: '20px',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>Debug Info (remove in production):</strong>
        <br />Store: {debugInfo?.storeUrl}
        <br />Token exists: {debugInfo?.tokenExists ? 'Yes' : 'No'}
        <br />Token valid: {debugInfo?.tokenValid ? 'Yes' : 'No'}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          color: '#c00'
        }}>
          <strong>Error:</strong> {error}
          <br />
          <button 
            onClick={fetchProducts}
            style={{
              marginTop: '10px',
              padding: '5px 15px',
              backgroundColor: '#007cba',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No products found. Make sure you have products in your Shopify store.
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            {/* Product Image */}
            {product.images.edges.length > 0 ? (
              <img
                src={product.images.edges[0].node.url}
                alt={product.images.edges[0].node.altText || product.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
                marginBottom: '10px',
                color: '#999'
              }}>
                No Image
              </div>
            )}

            {/* Product Title */}
            <h3 style={{
              margin: '0 0 10px 0',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              {product.title}
            </h3>

            {/* Product Description */}
            <p style={{
              margin: '0 0 10px 0',
              color: '#666',
              fontSize: '14px',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {product.description || 'No description available'}
            </p>

            {/* Price and Availability */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '15px'
            }}>
              <span style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#2c5aa0'
              }}>
                {formatPrice(product.priceRange.minVariantPrice)}
              </span>
              
              <span style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '12px',
                backgroundColor: product.availableForSale ? '#e8f5e8' : '#fee',
                color: product.availableForSale ? '#2d5016' : '#c00'
              }}>
                {product.availableForSale ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* View Product Button */}
            <button
              style={{
                width: '100%',
                marginTop: '15px',
                padding: '10px',
                backgroundColor: product.availableForSale ? '#007cba' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: product.availableForSale ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              disabled={!product.availableForSale}
              onClick={() => {
                // Handle product click - could navigate to product page
                console.log('Product clicked:', product.handle);
                alert(`Product: ${product.title}\nHandle: ${product.handle}`);
              }}
            >
              {product.availableForSale ? 'View Product' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={fetchProducts}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Refresh Products
        </button>
      </div>
    </div>
  );
};

export default ProductFetcher;