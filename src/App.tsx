import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CollectionPage from "./pages/products";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection/:id" element={<CollectionPage />} />
      </Routes>
    </Router>
  );
}
