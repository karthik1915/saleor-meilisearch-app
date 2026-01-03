import { useTheme } from "@saleor/macaw-ui";
import Link from "next/link";
import { useEffect, useState } from "react";

type MeiliTask = {
  uid: number;
  indexUid?: string;
  type: string;
  status: string;
  enqueuedAt?: string;
  startedAt?: string;
  finishedAt?: string;
  error?: {
    code: string;
    message: string;
    link?: string;
  };
  details?: Record<string, any>;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<MeiliTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTask, setOpenTask] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/meili/tasks", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setTasks(d.results ?? d))
      .finally(() => setLoading(false));
  }, []);

  const { theme } = useTheme();

  const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleString() : "-");

  return (
    <div className={`page ${theme}`}>
      <div className="header">
        <div>
          <Link href="/" className="breadcrumb-item active">
            ← Back to Indexes
          </Link>
          <h1>Task History</h1>
        </div>
      </div>

      {loading && <p>Loading tasks…</p>}

      <div className="task-grid">
        {tasks.map((task) => {
          const isOpen = openTask === task.uid;

          return (
            <div key={task.uid} className="task-card">
              <div className="task-header" onClick={() => setOpenTask(isOpen ? null : task.uid)}>
                <div>
                  <div className="task-title">
                    {task.type}
                    {task.indexUid && <span className="task-index">@ {task.indexUid}</span>}
                  </div>
                  <div className="task-meta">Task #{task.uid}</div>
                </div>

                <span className={`badge ${task.status}`}>{task.status}</span>
              </div>

              {isOpen && (
                <div className="task-body">
                  <div className="task-row">
                    <span>Enqueued</span>
                    <span>{formatDate(task.enqueuedAt)}</span>
                  </div>
                  <div className="task-row">
                    <span>Started</span>
                    <span>{task.startedAt ?? "-"}</span>
                  </div>
                  <div className="task-row">
                    <span>Finished</span>
                    <span>{task.finishedAt ?? "-"}</span>
                  </div>

                  {task.error && (
                    <div className="task-error">
                      <strong>{task.error.code}</strong>
                      <p>{task.error.message}</p>
                      {task.error.link && (
                        <a href={task.error.link} target="_blank" rel="noreferrer">
                          Docs
                        </a>
                      )}
                    </div>
                  )}

                  {task.details && (
                    <pre className="task-details">{JSON.stringify(task.details, null, 2)}</pre>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
