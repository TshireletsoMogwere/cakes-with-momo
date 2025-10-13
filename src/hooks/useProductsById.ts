import { useEffect, useState } from "react";

interface Product {
  id: string;
  title: string;
  description: string;
  images: { url: string }[];
  price?: string;
}

export default function useProductById(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      const query = `
        query getProduct($id: ID!) {
          product(id: $id) {
            id
            title
            description
            images(first: 5) {
              nodes {
                url
              }
            }
            variants(first: 1) {
              nodes {
                price {
                  amount
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
            body: JSON.stringify({ query, variables: { id: productId } }),
          }
        );

        const data = await response.json();

        if (data.errors) {
          setError("Failed to fetch product: " + JSON.stringify(data.errors));
          setLoading(false);
          return;
        }

        const node = data.data.product;
        setProduct({
          id: node.id,
          title: node.title,
          description: node.description,
          images: node.images.nodes,
          price: node.variants.nodes[0]?.price.amount || "0.00",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Network error");
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
}
