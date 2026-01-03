import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

const IndexPage: NextPage = () => {
  const { appBridgeState } = useAppBridge();
  const [indexes, setIndexes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);

  const theme = appBridgeState?.theme || "light";

  const fetchIndexes = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/meili/indexes", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch indexes from server");
      const data = await res.json();
      setIndexes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const runSetup = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/meili/setup", { method: "POST" });
      const data = await res.json();

      if (data.status) {
        setSuccessMsg("Indexing completed successfully!");
        await fetchIndexes(); // Refresh table data
      } else {
        throw new Error(data.message || "Indexing failed midway.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  const handleDelete = async () => {
    if (!selectedIndex) return;
    setLoading(true);
    try {
      // Note: Best practice is to call your own API route,
      // but sticking to your client-side implementation logic:
      await fetch(`/api/meili/delete?index=${selectedIndex}`, { method: "DELETE" });
      setSuccessMsg(`Index ${selectedIndex} deleted.`);
      await fetchIndexes();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsModalOpen(false);
      setSelectedIndex(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndexes();
  }, [fetchIndexes]);

  return (
    <div className={`page ${theme}`}>
      <header className="header">
        <div className="title-group">
          <h1>Search Engine</h1>
          <nav className="breadcrumb">
            <Link href="/" className="breadcrumb-item active">
              Indexes
            </Link>
            <span className="separator">/</span>
            <Link href="/tasks" className="breadcrumb-item">
              Task Queue
            </Link>
          </nav>
        </div>
        <button className="primary-btn" onClick={runSetup} disabled={loading}>
          {loading ? <div className="spinner" /> : "Sync with Saleor"}
        </button>
      </header>

      {/* NEW: Notification area for Errors/Success */}
      <div className="notification-area">
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">✕</span>
            <div className="alert-content">{error}</div>
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            <div className="alert-content">{successMsg}</div>
          </div>
        )}
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="index-table">
            <thead>
              <tr>
                <th>Index Name</th>
                <th>Documents</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {" "}
              {indexes.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="empty-state">
                    No indexes found. Click sync to begin.
                  </td>
                </tr>
              )}
              {indexes.map((idx) => (
                <tr key={idx.uid}>
                  <td className="index-uid-cell">
                    <span className="dot" /> {idx.uid}
                  </td>
                  <td>{idx.numberOfDocuments.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${idx.isIndexing ? "processing" : "succeeded"}`}>
                      {idx.isIndexing ? "Indexing..." : "Healthy"}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      className="action-icon-btn danger"
                      onClick={() => {
                        setSelectedIndex(idx.uid);
                        setIsModalOpen(true);
                      }}
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>
              You are about to remove <strong>{selectedIndex}</strong>. This will break search for
              this category until a resync is performed.
            </p>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="primary-btn danger-bg" onClick={handleDelete}>
                Delete Index
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
