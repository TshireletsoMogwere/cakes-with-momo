
import useCollections from "../hooks/useCollections"

export default function Home() {
  const { collections, loading, error } = useCollections();

  if (loading) {
    return <p>Loading collections...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Collections</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        {collections.map((collection) => (
          <div
            key={collection.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <h2>{collection.title}</h2>
            <p>{collection.description}</p>
            {collection.image && (
              <img
                src={collection.image.url}
                alt={collection.title}
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
