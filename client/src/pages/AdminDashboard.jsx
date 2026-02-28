import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pending, setPending] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add provider form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category_id: "",
    name: "",
    description: "",
    city: "",
    address: "",
    phone: "",
  });
  const [formMsg, setFormMsg] = useState("");
  const [formErr, setFormErr] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [pendingRes, allRes] = await Promise.all([
        api.get("/admin/providers/pending"),
        api.get("/providers?limit=50"),
      ]);
      setPending(pendingRes.data.data);
      setProviders(allRes.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const approveProvider = async (id) => {
    await api.patch(`/admin/providers/${id}/approve`);
    fetchData();
  };

  const deleteProvider = async (id) => {
    if (!confirm("Delete this provider?")) return;
    await api.delete(`/admin/providers/${id}`);
    fetchData();
  };

  const handleFormChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleAddProvider = async (e) => {
    e.preventDefault();
    setFormMsg("");
    setFormErr("");
    try {
      await api.post("/admin/providers", {
        ...form,
        category_id: Number(form.category_id),
      });
      setFormMsg("Provider created (pending approval)");
      setForm({
        category_id: "",
        name: "",
        description: "",
        city: "",
        address: "",
        phone: "",
      });
      fetchData();
    } catch (err) {
      setFormErr(err.response?.data?.error || "Failed to create provider");
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

  return (
    <div
      className="container"
      style={{ paddingTop: "32px", paddingBottom: "48px" }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
        Admin Dashboard
      </h1>
      <p style={{ color: "var(--text-dim)", marginBottom: "32px" }}>
        Manage providers and services
      </p>

      {/* Pending Approval */}
      <div className="admin-section">
        <h2>⏳ Pending Approval ({pending.length})</h2>
        {pending.length === 0 ? (
          <div className="empty-state">No pending providers</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.city}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="admin-actions">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => approveProvider(p.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteProvider(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Provider */}
      <div className="admin-section">
        <h2>
          ➕ Add Provider &nbsp;
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Hide" : "Show Form"}
          </button>
        </h2>
        {showForm && (
          <div className="card" style={{ maxWidth: "600px" }}>
            {formMsg && <div className="success-msg">{formMsg}</div>}
            {formErr && <div className="error-msg">{formErr}</div>}
            <form onSubmit={handleAddProvider}>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) =>
                      handleFormChange("category_id", e.target.value)
                    }
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">Healthcare</option>
                    <option value="2">Education</option>
                    <option value="3">Fitness</option>
                    <option value="4">Rentals</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    value={form.city}
                    onChange={(e) => handleFormChange("city", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Provider Name</label>
                <input
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  value={form.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Address</label>
                  <input
                    value={form.address}
                    onChange={(e) =>
                      handleFormChange("address", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                  />
                </div>
              </div>
              <button className="btn btn-primary" type="submit">
                Add Provider
              </button>
            </form>
          </div>
        )}
      </div>

      {/* All Providers */}
      <div className="admin-section">
        <h2>📋 All Approved Providers ({providers.length})</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>City</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.city}</td>
                <td>⭐ {Number(p.avg_rating).toFixed(1)}</td>
                <td className="admin-actions">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteProvider(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
