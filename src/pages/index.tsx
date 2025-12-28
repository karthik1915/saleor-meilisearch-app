import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

const IndexPage: NextPage = () => {
  const { appBridgeState } = useAppBridge();
  const [indexes, setIndexes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Determine theme from Saleor State
  const theme = appBridgeState?.theme || "light";

  const fetchIndexes = async () => {
    const res = await fetch("/api/meili/indexes", { cache: "no-store" });
    const data = await res.json();
    setIndexes(data);
  };

  const runSetup = async () => {
    setLoading(true);
    await fetch("/api/meili/setup", { method: "POST" });
    await fetchIndexes();
    setLoading(false);
  };

  useEffect(() => {
    fetchIndexes();
  }, []);

  return (
    <div className={`page ${theme}`}>
      <header className="header">
        <div>
          <h1>MeiliSearch Indexes</h1>
          <Link href="/tasks" className="secondary-link">
            View Task Queue →
          </Link>
        </div>
        <button className="primary-btn" onClick={runSetup} disabled={loading}>
          {loading ? "Indexing..." : "Run Indexing"}
        </button>
      </header>

      <div className="table-container">
        <table className="index-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Documents</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {indexes.map((idx) => (
              <tr key={idx.uid}>
                <td className="font-bold">{idx.uid}</td>
                <td>{idx.numberOfDocuments.toLocaleString()}</td>
                <td>
                  <span className={`badge ${idx.isIndexing ? "running" : "idle"}`}>
                    {idx.isIndexing ? "Indexing" : "Idle"}
                  </span>
                </td>
                <td>
                  <button
                    className="text-btn danger"
                    onClick={() => {
                      /* delete func */
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
  );
};

export default IndexPage;
