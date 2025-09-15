import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      const query = `
        {
          products(first: 10) {
            edges {
              node {
                id
                title
                description
                images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch(
          `https://${import.meta.env.VITE_SHOPIFY_STORE_URL}/api/2024-10/graphql.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token":
                import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
            },
            body: JSON.stringify({ query }),
          }
        );

        const data = await response.json();

        if (data.errors) {
          console.error("Shopify API error:", data.errors);
          setError("Failed to fetch products from Shopify");
          setLoading(false);
          return;
        }

        // Check if products exist
        if (!data.data || !data.data.products) {
          setError("No products found");
          setLoading(false);
          return;
        }

        setProducts(data.data.products.edges.map((edge: any) => edge.node));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Network error");
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Products</h1>
      <div style={{ display: "grid", gap: "1rem" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            {product.images.edges[0] && (
              <img
                src={product.images.edges[0].node.url}
                alt={product.title}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
            )}
            <h2>{product.title}</h2>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
