import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
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
    if (id) dispatch(fetchProductsByCollection(id));
  }, [dispatch, id]);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
        <div className="animate-pulse w-16 h-16 bg-amber-200 rounded-full mb-4"></div>
        <p className="text-lg text-amber-800 font-medium">
          Fetching your delicious cakes...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-red-50 to-red-100 text-center px-4">
        <h2 className="text-2xl font-semibold text-red-700 mb-3">
          Oops! Something went wrong.
        </h2>
        <p className="text-red-600 mb-6">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-10 via-amber-50 to-orange-100 px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-red-400 mb-8 text-center">
        Our Delicious Cakes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${encodeURIComponent(product.id)}`}
          >
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              {product.images?.[0] && (
                <img
                  src={product.images[0].url}
                  alt={product.title}
                  className="w-full h-56 object-cover rounded-t-3xl"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-red-400 mb-2">
                  {product.title}
                </h2>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {product.description}
                </p>
                <p className="text-red-500 font-bold mt-2">
                  R{product.price || "299"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
