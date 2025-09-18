import useCollections from "../hooks/useCollections";

export default function Home() {
  const { collections, loading, error } = useCollections();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading collections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-orange-50">
      {/* Header */}
      <header className="bg-transparent">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-amber-800">
              Cakes With Momo
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {["ABOUT", "COLLECTIONS", "CONTACT"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-amber-800 hover:text-amber-900 font-medium"
                >
                  {link}
                </a>
              ))}
              <button className="border-2 border-red-400 text-red-400 px-6 py-2 rounded-full hover:bg-red-400 hover:text-white transition-colors">
                REGISTER
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 relative text-center">
        <section className="relative flex justify-center items-center py-16">
  <div className="relative text-center">
    {/* Image */}
    <img id="hero-image"
      src="https://www.shutterstock.com/image-photo/closeup-woman-eating-chocolate-cupcake-600nw-164748110.jpg"
      alt="Delicious croissant"
      className="w-80 h-60 object-cover rounded-3xl mx-auto mt-10"
    />
    
    {/* Text Overlays */}
    <h1 className="absolute top-0 left-0 transform -translate-x-1/2 text-2xl md:text-4xl font-bold text-teal-600 drop-shadow-lg">
      Delight in
    </h1>
    
    <h1 className="relative bottom- left-80 transform -translate-x-1/2 text-2xl md:text-4xl font-bold text-red-400 drop-shadow-lg">
      every bites!
    </h1>
  </div>
</section>

        <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
          Experience the joy of perfectly baked cakes, made with love and
          crafted to bring a smile to every celebration
        </p>

        <button className="bg-red-400 hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-full text-lg transition-colors">
          SHOP NOW
        </button>
      </section>

      {/* Our Signature Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-red-400 mb-12">
            Our Collections
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-4">
                  <img
                    src={collection.image?.url || "/api/placeholder/300/200"}
                    alt={collection.title}
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                </div>
                <div className="px-6 pb-6">
                  <h3 className="text-xl font-bold text-teal-600 mb-4">
                    {collection.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-4">
                    <button className="border-2 border-teal-600 text-teal-600 w-10 h-10 rounded-lg hover:bg-teal-600 hover:text-white transition-colors flex items-center justify-center">
                      🛒
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
