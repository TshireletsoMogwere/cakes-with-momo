import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Collection {
  id: string;
  title: string;
  description: string;
  image?: { url: string };
}

interface CollectionsState {
  items: Collection[];
  loading: boolean;
  error: string | null;
}

const initialState: CollectionsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async () => {
    const query = `
      {
        collections(first: 5) {
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
    return data.data.collections.edges.map((edge: any) => edge.node);
  }
);

const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch collections";
      });
  },
});

export default collectionsSlice.reducer;
