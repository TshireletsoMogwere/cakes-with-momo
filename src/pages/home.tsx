import { Link } from "react-router-dom";
import { memo, useCallback, useMemo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchCollections, type Collection } from "../slices/collectionsSlices";

const Home = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: collections, loading, error } = useSelector(
    (state: RootState) => state.collections
  );

  const collectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchCollections());
  }, [dispatch]);

  const navigationItems = useMemo(
    () => ["ABOUT", "COLLECTIONS", "CONTACT"],
    []
  );

  const handleRegisterClick = useCallback(() => {
    console.log("Registration initiated");
  }, []);

  const handleShopNowClick = useCallback(() => {
    if (collectionsRef.current) {
      collectionsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  if (loading) {
    return (
      <div
        className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100"
        role="status"
        aria-live="polite"
      >
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-amber-200 rounded-full mb-4"></div>
        </div>
        <p className="text-lg text-amber-800 font-medium">
          Preparing your delicious experience...
        </p>
        <p className="text-sm text-amber-600 mt-2">Good things take time</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-red-50 to-red-100"
        role="alert"
      >
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-red-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Something's not quite right
          </h2>
          <p className="text-red-700 mb-4">
            We're having trouble loading our collections right now.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* HEADER */}
      <header className="backdrop-blur-sm sticky top-0 z-50">
        <nav
          className="container mx-auto px-6 py-4"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl font-bold text-amber-800 hover:text-amber-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg px-2 py-1"
              aria-label="Cakes With Momo - Home"
            >
              Cakes With Momo
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-amber-800 hover:text-amber-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg px-2 py-1"
                  aria-label={`Navigate to ${item}`}
                >
                  {item}
                </Link>
              ))}

              <button
                onClick={handleRegisterClick}
                className="border-2 border-red-400 text-red-400 px-6 py-2 rounded-full hover:bg-red-400 hover:text-white transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-105"
                aria-label="Register for exclusive offers"
              >
                JOIN US
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section
        className="container mx-auto px-6 py-16"
        aria-labelledby="hero-heading"
      >
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="space-y-2">
              <h1
                id="hero-heading"
                className="text-4xl md:text-6xl font-bold leading-tight"
              >
                <span className="text-teal-600 block">Delight in</span>
                <span className="text-red-400">every bite!</span>
              </h1>
            </div>

            <p className="text-gray-700 text-lg lg:text-xl max-w-xl leading-relaxed">
              Experience the joy of perfectly baked cakes, made with love and
              crafted to bring a smile to every celebration. Each creation tells
              a story of passion and precision.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleShopNowClick}
                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold px-10 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Start shopping for cakes"
              >
                EXPLORE COLLECTIONS
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img
                src="https://www.shutterstock.com/image-photo/closeup-woman-eating-chocolate-cupcake-600nw-164748110.jpg"
                alt="A person joyfully enjoying a chocolate cupcake"
                className="w-full h-80 lg:h-96 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section
        className="bg-white py-20"
        aria-labelledby="collections-heading"
        ref={collectionsRef}
      >
        <div className="container mx-auto px-6">
          <header className="text-center mb-16">
            <h2
              id="collections-heading"
              className="text-4xl md:text-5xl font-bold text-red-400 mb-4"
            >
              Our Signature Collections
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our carefully curated collections, each designed to create
              memorable moments and satisfy your sweetest cravings.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection: Collection, index: number) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
});

interface CollectionCardProps {
  collection: Collection;
  index: number;
}

const CollectionCard = memo(({ collection, index }: CollectionCardProps) => {
  const handleCardClick = useCallback(() => {
    console.log(`Collection ${collection.title} clicked`);
  }, [collection.title]);

  return (
    <Link
      to={`/collection/${encodeURIComponent(collection.id)}`}
      onClick={handleCardClick}
      className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-4"
      aria-label={`View ${collection.title} collection`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="relative overflow-hidden">
        <img
          src={collection.image?.url || "/api/placeholder/300/200"}
          alt={`${collection.title} collection`}
          className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <span className="text-white font-semibold px-4 py-2 bg-red-500 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Explore Collection
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-red-500 mb-2 group-hover:text-red-600 transition-colors">
          {collection.title}
        </h3>
      </div>
    </Link>
  );
});

export default Home;
