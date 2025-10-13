import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Product {
  id: string;
  title: string;
  description: string;
  images: { url: string }[];
  price?: string; // optional for now
}

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const fetchProductsByCollection = createAsyncThunk(
  "products/fetchProductsByCollection",
  async (collectionId: string) => {
    const query = `
      {
        collection(id: "${collectionId}") {
          products(first: 10) {
            edges {
              node {
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
          }
        }
      }
    `;

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
    return data.data.collection.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      description: edge.node.description,
      images: edge.node.images.nodes,
      price: edge.node.variants.nodes[0]?.price.amount || "0.00",
    }));
  }
);


export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId: string) => {
    const query = `
      {
        product(id: "${productId}") {
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
    const product = data.data.product;
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      images: product.images.nodes,
      price: product.variants.nodes[0]?.price.amount || "0.00",
    };
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Collection fetching
      .addCase(fetchProductsByCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCollection.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsByCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      // Single product fetching
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
      });
  },
});

export default productsSlice.reducer;
