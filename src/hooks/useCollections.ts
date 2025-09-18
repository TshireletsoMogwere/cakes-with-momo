import { useEffect, useState } from "react";

interface Collection {
  id: string;
  title: string;
  description: string;
  image?: {
    url: string;
  };
}

export default function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollections() {
      const query = `
        {
          collections(first: 3) {
            edges {
              node {
                id
                title
                description
                image {
                  url
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
            body: JSON.stringify({ query }),
          }
        );

        const data = await response.json();

        if (data.errors) {
          setError("Failed to fetch collections: " + JSON.stringify(data.errors));
          setLoading(false);
          return;
        }

        if (!data.data || !data.data.collections) {
          setError("No collections found");
          setLoading(false);
          return;
        }

        setCollections(data.data.collections.edges.map((edge: any) => edge.node));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Network error");
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  return { collections, loading, error };
}

