import { useEffect, useState } from "react";

interface Product {
  id: string;
  title: string;
  description: string;
  featuredImage?: {
    url: string;
  };
}

export default function useProductsByCollection(collectionId: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionId) return;

    async function fetchProducts() {
      const query = `
        query getCollectionProducts($id: ID!) {
          collection(id: $id) {
            title
            products(first: 10) {
              edges {
                node {
                  id
                  title
                  description
                  featuredImage {
                    url
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch(
          `https://${import.meta.env.VITE_SHOPIFY_STORE_URL}.myshopify.com/api/2024-10/graphql.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token":
                import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
            },
            body: JSON.stringify({ query, variables: { id: collectionId } }),
          }
        );

        const data = await response.json();

        if (data.errors) {
          setError("Failed to fetch products: " + JSON.stringify(data.errors));
          setLoading(false);
          return;
        }

        setProducts(
          data.data.collection.products.edges.map((edge: any) => edge.node)
        );
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Network error");
        setLoading(false);
      }
    }

    fetchProducts();
  }, [collectionId]);

  return { products, loading, error };
}
