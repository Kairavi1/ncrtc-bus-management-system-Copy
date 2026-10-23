import type { Incident } from "../types";

type IncidentsPageProps = {
  incidents: Incident[];
  loading: boolean;
  error: string;
  successMessage: string;
  incidentNotes: Record<string, string>;
  updatingIncident: string;
  onRefresh: () => void;
  onNoteChange: (incidentId: string, note: string) => void;
  onStatusChange: (incidentId: string, status: string) => void;
};

function IncidentsPage({
  incidents,
  loading,
  error,
  successMessage,
  incidentNotes,
  updatingIncident,
  onRefresh,
  onNoteChange,
  onStatusChange,
}: Readonly<IncidentsPageProps>) {
  return (
    <section className="incidents-page">
      <div className="panel-heading">
        <div>
          <h2>Incident management</h2>
          <p>Review operational issues and update their status.</p>
        </div>
        <button type="button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {loading && <p>Loading incidents...</p>}

      {!loading && incidents.length === 0 && !error && (
        <article className="panel">
          <p className="empty-state">No incidents found.</p>
        </article>
      )}

      {incidents.map((incident) => (
        <article className="incident-card" key={incident.id}>
          <div className="incident-card-header">
            <div>
              <span
                className={`severity ${
                  incident.severity === "P1" ? "critical" : ""
                }`}
              >
                {incident.severity}
              </span>
              <h3>{incident.type.replaceAll("_", " ")}</h3>
            </div>
            <span className="incident-status">{incident.status}</span>
          </div>

          <p>{incident.description}</p>

          <div className="incident-meta">
            <span>
              Vehicle: {incident.vehicle?.registrationNo || "Unassigned"}
            </span>
            <span>Reported by: {incident.reporter?.name || "Unknown"}</span>
            <span>
              Assigned to: {incident.assignedTo?.name || "Unassigned"}
            </span>
            <span>Depot: {incident.depot?.name || "Unknown"}</span>
          </div>

          <label htmlFor={`note-${incident.id}`}>Investigation note</label>
          <textarea
            id={`note-${incident.id}`}
            rows={2}
            placeholder="Add an update or resolution note..."
            value={incidentNotes[incident.id] || ""}
            onChange={(event) => onNoteChange(incident.id, event.target.value)}
          />

          <div className="incident-actions">
            <label htmlFor={`status-${incident.id}`}>Update status</label>
            <select
              id={`status-${incident.id}`}
              value={incident.status}
              disabled={updatingIncident === incident.id}
              onChange={(event) =>
                onStatusChange(incident.id, event.target.value)
              }
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <details className="incident-history">
            <summary>Activity history ({incident.events.length})</summary>
            {incident.events.map((event) => (
              <div className="history-event" key={event.id}>
                <strong>{event.status}</strong>
                <p>{event.note}</p>
                <small>
                  {event.user.name} ·{" "}
                  {new Date(event.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </details>
        </article>
      ))}
    </section>
  );
}

export default IncidentsPage;
