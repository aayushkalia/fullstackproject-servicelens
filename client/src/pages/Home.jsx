import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CATEGORY_ICONS = {
  Healthcare: "🏥",
  Education: "🎓",
  Fitness: "💪",
  Rentals: "🏠",
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.data));
  }, []);

  return (
    <div className="container">
      <div className="hero">
        <h1>
          Compare Services.
          <br />
          <span className="gradient">Save Smarter.</span>
        </h1>
        <p>
          Find and compare service providers across healthcare, education,
          fitness, and more — by price, rating, and location.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/providers")}
        >
          Start Comparing →
        </button>
      </div>

      <h2
        style={{
          textAlign: "center",
          marginBottom: "8px",
          fontSize: "1.4rem",
          fontWeight: 700,
        }}
      >
        Browse by Category
      </h2>
      <p
        style={{
          textAlign: "center",
          color: "var(--text-dim)",
          marginBottom: "24px",
        }}
      >
        Choose a category to explore providers
      </p>

      <div className="categories-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="card category-card"
            onClick={() => navigate(`/providers?category=${cat.name}`)}
          >
            <div className="icon">{CATEGORY_ICONS[cat.name] || "📦"}</div>
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
