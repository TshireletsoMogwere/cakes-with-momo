import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchProductsByCollection } from "../slices/productsSlice";

export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductsByCollection(id));
    }
  }, [dispatch, id]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            {product.images?.[0] && (
              <img
                src={product.images[0].url}
                alt={product.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}
            <p className="text-gray-700 text-sm">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
