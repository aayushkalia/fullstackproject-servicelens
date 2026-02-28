import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";

export default function ProviderList() {
  const [providers, setProviders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filter state from URL
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "",
    page: searchParams.get("page") || "1",
  });

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params[key] = val;
      });
      const res = await api.get("/providers", { params });
      setProviders(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProviders();
  }, [filters.page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, page: "1" }));
    fetchProviders();
    // Update URL
    const params = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setSearchParams(params);
  };

  const handleChange = (field, value) => {
    setFilters((f) => ({ ...f, [field]: value }));
  };

  const changePage = (newPage) => {
    setFilters((f) => ({ ...f, page: String(newPage) }));
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Compare Providers</h1>
        <p>Filter, sort, and find the best deal</p>
      </div>

      <form onSubmit={handleSearch} className="filters-bar">
        <div className="form-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="">All</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Fitness">Fitness</option>
            <option value="Rentals">Rentals</option>
          </select>
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            placeholder="e.g. Mumbai"
            value={filters.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Min Price</label>
          <input
            type="number"
            placeholder="₹0"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Max Price</label>
          <input
            type="number"
            placeholder="₹99999"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange("sortBy", e.target.value)}
          >
            <option value="">Default</option>
            <option value="price">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Rating: High → Low</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          Loading providers...
        </div>
      ) : providers.length === 0 ? (
        <div className="empty-state">
          No providers found matching your filters.
        </div>
      ) : (
        <>
          <div className="provider-grid">
            {providers.map((p) => (
              <div
                key={p.id}
                className="card provider-card"
                onClick={() => navigate(`/providers/${p.id}`)}
              >
                <div className="top-row">
                  <h3>{p.name}</h3>
                  <span className="category-tag">{p.category}</span>
                </div>
                <div className="city">📍 {p.city}</div>
                <div className="stats">
                  <div className="rating">
                    <span className="star">★</span>{" "}
                    {Number(p.avg_rating).toFixed(1)}
                    <span
                      style={{
                        color: "var(--text-dim)",
                        fontWeight: 400,
                        fontSize: "0.8rem",
                      }}
                    >
                      ({p.review_count})
                    </span>
                  </div>
                  <div className="price">
                    {p.min_price
                      ? `From ₹${Number(p.min_price).toLocaleString()}`
                      : "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-ghost btn-sm"
                disabled={pagination.page <= 1}
                onClick={() => changePage(pagination.page - 1)}
              >
                ← Prev
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => changePage(pagination.page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
