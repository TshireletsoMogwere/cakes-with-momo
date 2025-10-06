import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Product {
  id: string;
  title: string;
  description: string;
  images: { url: string }[];
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
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
                images(first: 1) {
                  nodes {
                    url
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
    }));
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default productsSlice.reducer;
