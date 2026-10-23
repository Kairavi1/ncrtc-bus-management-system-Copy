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
    <section className="incident-management">
      <style>{`
        .incident-management {
          color: #10243d;
          font-size: 12px;
        }

        .incident-management * {
          box-sizing: border-box;
        }

        .incident-management .im-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 15px;
        }

        .incident-management .im-heading h2 {
          margin: 0 0 5px;
          font-size: 20px;
          font-weight: 800;
        }

        .incident-management .im-heading p {
          margin: 0;
          color: #52647c;
        }

        .incident-management .im-refresh {
          padding: 9px 15px;
          border: 1px solid #d6deea;
          border-radius: 5px;
          background: #fff;
          color: #10243d;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        .incident-management .im-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(280px, 1fr);
          gap: 13px;
          align-items: start;
        }

        .incident-management .im-panel {
          min-width: 0;
          padding: 13px;
          border: 1px solid #dce3ec;
          border-radius: 6px;
          background: #fff;
        }

        .incident-management .im-panel-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5eaf0;
        }

        .incident-management .im-panel-heading h3 {
          margin: 0;
          font-size: 13px;
          font-weight: 800;
        }

        .incident-management .im-muted {
          color: #52647c;
          font-size: 10px;
        }

        .incident-management .im-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          padding: 11px 0;
          border-bottom: 1px solid #e8edf2;
          cursor: pointer;
        }

        .incident-management .im-row:last-child {
          border-bottom: 0;
        }

        .incident-management .im-row-main {
          min-width: 0;
        }

        .incident-management .im-row-main strong {
          display: block;
          margin-bottom: 3px;
          font-size: 11px;
          overflow-wrap: anywhere;
        }

        .incident-management .im-row-main p {
          margin: 0;
          color: #354965;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .incident-management .im-badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 5px;
          flex-shrink: 0;
        }

        .incident-management .im-badge {
          display: inline-block;
          padding: 4px 7px;
          border-radius: 3px;
          background: #e6ebf2;
          color: #34445b;
          font-size: 10px;
          white-space: nowrap;
        }

        .incident-management .im-badge.critical {
          background: #fbdada;
          color: #a51d1d;
        }

        .incident-management .im-badge.open {
          background: #ffedcc;
          color: #8a5200;
        }

        .incident-management .im-badge.resolved {
          background: #d9f3e7;
          color: #146747;
        }

        .incident-management .im-details h3 {
          margin: 0 0 10px;
          font-size: 13px;
        }

        .incident-management .im-details-description {
          margin: 0 0 10px;
          color: #354965;
          line-height: 1.5;
        }

        .incident-management .im-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 10px;
        }

        .incident-management .im-field label {
          font-size: 11px;
          font-weight: 700;
        }

        .incident-management .im-field textarea,
        .incident-management .im-field select {
          width: 100%;
          min-width: 0;
          border: 1px solid #aebdd0;
          border-radius: 5px;
          background: #fff;
          color: #10243d;
          font: inherit;
          font-size: 12px;
        }

        .incident-management .im-field textarea {
          min-height: 62px;
          padding: 9px;
          resize: vertical;
        }

        .incident-management .im-field select {
          height: 35px;
          padding: 0 8px;
        }

        .incident-management .im-field textarea:focus,
        .incident-management .im-field select:focus {
          outline: 2px solid #b8e2e4;
          border-color: #117f86;
        }

        .incident-management .im-update {
          width: 100%;
          min-height: 36px;
          border: 0;
          border-radius: 5px;
          background: #117f86;
          color: #fff;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .incident-management .im-update:hover:not(:disabled) {
          background: #0d6d74;
        }

        .incident-management .im-update:disabled {
          opacity: .65;
          cursor: wait;
        }

        .incident-management .im-message {
          margin: 8px 0 0;
          padding: 9px;
          border-radius: 4px;
          line-height: 1.5;
        }

        .incident-management .im-message.success {
          background: #d9f3e7;
          color: #146747;
        }

        .incident-management .im-message.error {
          background: #fbdada;
          color: #a51d1d;
        }

        .incident-management .im-history {
          margin-top: 12px;
          border-top: 1px solid #e5eaf0;
          padding-top: 10px;
        }

        .incident-management .im-history summary {
          cursor: pointer;
          font-weight: 700;
        }

        .incident-management .im-event {
          margin-top: 10px;
          padding-left: 10px;
          border-left: 2px solid #c7d9e5;
        }

        .incident-management .im-event p {
          margin: 4px 0;
          color: #354965;
          overflow-wrap: anywhere;
        }

        .incident-management .im-event small {
          color: #718096;
        }

        .incident-management .im-empty {
          padding: 20px 0;
          color: #52647c;
        }

        @media (max-width: 760px) {
          .incident-management .im-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 420px) {
          .incident-management .im-row {
            flex-direction: column;
          }

          .incident-management .im-badges {
            justify-content: flex-start;
          }
        }
      `}</style>

      <div className="im-heading">
        <div>
          <h2>Incident Management</h2>
          <p>Existing workflow: review, add notes, update status.</p>
        </div>

        <button
          className="im-refresh"
          type="button"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <p className="im-message error" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="im-empty">Loading incidents...</p>}

      {!loading && incidents.length === 0 && !error && (
        <div className="im-panel im-empty">No incidents found.</div>
      )}

      <div className="im-grid">
        <article className="im-panel">
          <div className="im-panel-heading">
            <h3>Incidents</h3>
            <span className="im-muted">Filter: status · severity · type</span>
          </div>

          {incidents.map((incident) => (
            <div className="im-row" key={incident.id}>
              <div className="im-row-main">
                <strong>
                  {incident.type.replaceAll("_", " ")}
                  {incident.vehicle?.registrationNo
                    ? ` · ${incident.vehicle.registrationNo}`
                    : ""}
                </strong>
                <p>{incident.description}</p>
                <p className="im-muted">
                  {incident.depot?.name ?? "Depot not assigned"}
                </p>
              </div>

              <div className="im-badges">
                <span
                  className={`im-badge ${
                    incident.severity === "P1" ? "critical" : ""
                  }`}
                >
                  {incident.severity}
                </span>
                <span
                  className={`im-badge ${
                    incident.status.toLowerCase() === "resolved"
                      ? "resolved"
                      : "open"
                  }`}
                >
                  {incident.status}
                </span>
              </div>
            </div>
          ))}
        </article>

        <article className="im-panel im-details">
          <h3>Incident details</h3>

          {incidents.length === 0 ? (
            <p className="im-empty">Incident details will appear here.</p>
          ) : (
            <>
              <p className="im-details-description">
                {incidents[0].description}
              </p>

              <div className="im-muted" style={{ marginBottom: 10 }}>
                {incidents[0].type.replaceAll("_", " ")}
                {" · "}
                {incidents[0].vehicle?.registrationNo ?? "No vehicle"}
              </div>

              <div className="im-field">
                <label htmlFor={`im-note-${incidents[0].id}`}>Notes</label>
                <textarea
                  id={`im-note-${incidents[0].id}`}
                  rows={3}
                  placeholder="Add an investigation or resolution note..."
                  value={incidentNotes[incidents[0].id] || ""}
                  onChange={(event) =>
                    onNoteChange(incidents[0].id, event.target.value)
                  }
                />
              </div>

              <div className="im-field">
                <label htmlFor={`im-status-${incidents[0].id}`}>Status</label>
                <select
                  id={`im-status-${incidents[0].id}`}
                  value={incidents[0].status}
                  disabled={updatingIncident === incidents[0].id}
                  onChange={(event) =>
                    onStatusChange(incidents[0].id, event.target.value)
                  }
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <button
                className="im-update"
                type="button"
                disabled={updatingIncident === incidents[0].id}
                onClick={() =>
                  onStatusChange(incidents[0].id, incidents[0].status)
                }
              >
                {updatingIncident === incidents[0].id
                  ? "Updating..."
                  : "Update status"}
              </button>

              {successMessage && (
                <p className="im-message success" role="status">
                  ● {successMessage}
                </p>
              )}

              <details className="im-history">
                <summary>
                  Activity history ({incidents[0].events.length})
                </summary>

                {incidents[0].events.map((event) => (
                  <div className="im-event" key={event.id}>
                    <strong>{event.status}</strong>
                    <p>{event.note}</p>
                    <small>
                      {event.user.name} ·{" "}
                      {new Date(event.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))}
              </details>
            </>
          )}
        </article>
      </div>
    </section>
  );
}

export default IncidentsPage;
