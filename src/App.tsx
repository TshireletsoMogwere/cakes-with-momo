import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CollectionPage from "./pages/products";
import ProductDetail from "./pages/product-details";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection/:id" element={<CollectionPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />

      </Routes>
    </Router>
  );
}
