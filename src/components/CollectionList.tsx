
import { useNavigate } from "react-router-dom";

interface Collection {
  id: string;
  title: string;
  description: string;
  image?: { url: string };
}

interface CollectionListProps {
  collections: Collection[];
  loading: boolean;
  error: string | null;
}

export default function CollectionList({ collections, loading, error }: CollectionListProps) {
  const navigate = useNavigate();

  if (loading) return <p>Loading collections...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!collections || collections.length === 0) return <p>No collections found.</p>;

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Featured Collections</h1>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        }}
      >
        {collections.map((collection) => (
          <div
            key={collection.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => navigate(`/collection/${encodeURIComponent(collection.id)}`)}
          >
            {collection.image && (
              <img
                src={collection.image.url}
                alt={collection.title}
                style={{ width: "100%", height: "150px", objectFit: "cover", marginBottom: "0.5rem" }}
              />
            )}
            <h2>{collection.title}</h2>
            <p>{collection.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
