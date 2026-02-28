import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import api from "../api";

export default function ProviderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewErr, setReviewErr] = useState("");

  useEffect(() => {
    Promise.all([
      api.get(`/providers/${id}`),
      api.get(`/providers/${id}/reviews`),
    ])
      .then(([provRes, revRes]) => {
        setProvider(provRes.data.data);
        setReviews(revRes.data.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg("");
    setReviewErr("");
    try {
      await api.post(`/providers/${id}/reviews`, {
        rating: Number(rating),
        comment,
      });
      setReviewMsg("Review submitted!");
      setComment("");
      // Refresh
      const [provRes, revRes] = await Promise.all([
        api.get(`/providers/${id}`),
        api.get(`/providers/${id}/reviews`),
      ]);
      setProvider(provRes.data.data);
      setReviews(revRes.data.data);
    } catch (err) {
      setReviewErr(err.response?.data?.error || "Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner" />
          Loading...
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container">
        <div className="empty-state">Provider not found.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="detail-header">
        <div>
          <Link
            to="/providers"
            style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}
          >
            ← Back to list
          </Link>
          <h1>{provider.name}</h1>
          <div className="detail-meta">
            <span>
              📍 {provider.city}
              {provider.address ? `, ${provider.address}` : ""}
            </span>
            <span>
              ⭐ {Number(provider.avg_rating).toFixed(1)} (
              {provider.review_count} reviews)
            </span>
            <span style={{ color: "var(--accent)" }}>{provider.category}</span>
          </div>
          {provider.description && (
            <p style={{ marginTop: "12px", color: "var(--text-dim)" }}>
              {provider.description}
            </p>
          )}
        </div>
        {provider.phone && (
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
              Contact
            </div>
            <div style={{ fontWeight: 600 }}>📞 {provider.phone}</div>
            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: "0.85rem" }}
              >
                Visit Website →
              </a>
            )}
          </div>
        )}
      </div>

      {/* Services & Pricing Table */}
      <h2 className="section-title">Services & Pricing</h2>
      {provider.services && provider.services.length > 0 ? (
        <table className="services-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Price</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {provider.services.map((s) => (
              <tr key={s.id}>
                <td>{s.service_name}</td>
                <td style={{ color: "var(--accent)", fontWeight: 700 }}>
                  ₹{Number(s.price).toLocaleString()}
                </td>
                <td style={{ color: "var(--text-dim)" }}>{s.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">No services listed yet.</div>
      )}

      {/* Reviews */}
      <h2 className="section-title">Reviews</h2>
      {reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews.map((r) => (
            <div key={r.id} className="card review-card">
              <div className="review-top">
                <span className="review-user">
                  {r.user_name} &nbsp;
                  <span className="rating">
                    {Array.from({ length: r.rating }, (_, i) => (
                      <span key={i} className="star">
                        ★
                      </span>
                    ))}
                  </span>
                </span>
                <span className="review-date">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              {r.comment && <p className="review-comment">{r.comment}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ marginBottom: "24px" }}>
          No reviews yet. Be the first!
        </div>
      )}

      {/* Review Form */}
      {user ? (
        <div className="review-form" style={{ marginBottom: "48px" }}>
          <h3 style={{ marginBottom: "12px" }}>Write a Review</h3>
          {reviewMsg && <div className="success-msg">{reviewMsg}</div>}
          {reviewErr && <div className="error-msg">{reviewErr}</div>}
          <form onSubmit={submitReview}>
            <div className="form-group">
              <label>Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="5">5 — Excellent</option>
                <option value="4">4 — Good</option>
                <option value="3">3 — Average</option>
                <option value="2">2 — Poor</option>
                <option value="1">1 — Terrible</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea
                rows="3"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Submit Review
            </button>
          </form>
        </div>
      ) : (
        <p style={{ color: "var(--text-dim)", marginBottom: "48px" }}>
          <Link to="/login">Login</Link> to write a review.
        </p>
      )}
    </div>
  );
}
