import { useParams } from "react-router-dom";
import useProductById from "../hooks/useProductsById";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const decodedId = decodeURIComponent(id || "");
  const { product, loading, error } = useProductById(decodedId);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [flavour, setFlavour] = useState("Vanilla");
  const [quantity, setQuantity] = useState(1);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="animate-pulse w-16 h-16 bg-amber-200 rounded-full mb-4"></div>
      <p className="text-lg text-amber-800 font-medium">Preparing your delicious treat...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-red-50 to-red-100 text-center px-4">
      <h2 className="text-2xl font-semibold text-red-700 mb-3">Oops! Something went wrong.</h2>
      <p className="text-red-600 mb-6">We couldn’t fetch this cake’s details. Please try again.</p>
    </div>
  );

  if (!product) return <p className="text-center text-red-500 mt-20">Product not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-10 via-amber-50 to-orange-100 px-6 py-16 lg:px-16 lg:py-24">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* LEFT: Image gallery */}
        <div className="flex-1">
          <div className="border rounded-3xl shadow-lg overflow-hidden">
            <img
              src={selectedImage || product.images?.[0]?.url}
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="flex gap-3 mt-4">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`thumb-${i}`}
                onClick={() => setSelectedImage(img.url)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  selectedImage === img.url ? "border-red-400" : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Info section */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold text-red-400">{product.title}</h1>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"}>⭐</span>
            ))}
            <span className="text-sm text-gray-600 ml-2">(24 reviews)</span>
          </div>

          <p className="text-gray-700">{product.description}</p>

          <p className="text-2xl font-semibold text-red-500">R{product.price || "299"}</p>

          {/* Flavours */}
          <div>
            <label className="block text-sm font-medium mb-1 text-amber-800">Choose Flavour</label>
            <select
              value={flavour}
              onChange={(e) => setFlavour(e.target.value)}
              className="border rounded-lg p-2 w-full"
            >
              <option>Vanilla</option>
              <option>Chocolate</option>
              <option>Red Velvet</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1 text-amber-800">Quantity</label>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded-lg p-2 w-20"
            />
          </div>

          {/* Add to Cart */}
          <button className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-10 py-3 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
