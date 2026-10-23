type Duty = {
  id: string;
  status: string;
  driver: { name: string };
  vehicle: { registrationNo: string };
  route: { code: string; name: string };
  startTime?: string;
  endTime?: string;
};

type DutiesPageProps = {
  duties: Duty[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
};

function DutiesPage({ duties, loading, error, onRefresh }: DutiesPageProps) {
  return (
    <section className="incidents-page duties-page">
      <style>{`
        .duties-page {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .duties-page .duties-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(280px, 1fr);
          gap: 12px;
          align-items: start;
        }

        .duties-page .duties-table-panel,
        .duties-page .assign-duty-panel {
          min-width: 0;
          padding: 16px;
          border: 1px solid #dce3eb;
          border-radius: 8px;
          background: #fff;
        }

        .duties-page .duties-filters {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }

        .duties-page .duties-filters > div {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .duties-page label {
          display: block;
          margin: 8px 0 5px;
          color: #26364d;
          font-size: 12px;
          font-weight: 600;
        }

        .duties-page input,
        .duties-page select {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding: 9px 10px;
          border: 1px solid #aebccc;
          border-radius: 5px;
          background: #fff;
          color: #15243b;
          font: inherit;
          font-size: 12px;
        }

        .duties-page input:focus,
        .duties-page select:focus {
          outline: 2px solid #b9dce0;
          border-color: #397e86;
        }

        .duties-page .duties-table-scroll {
          width: 100%;
          overflow-x: auto;
        }

        .duties-page .duties-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 12px;
        }

        .duties-page .duties-table th {
          padding: 9px 7px;
          border-bottom: 1px solid #e1e7ef;
          color: #44516a;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .duties-page .duties-table td {
          padding: 12px 7px;
          border-bottom: 1px solid #e1e7ef;
          color: #182943;
          white-space: nowrap;
        }

        .duties-page .duties-table tbody tr:last-child td {
          border-bottom: none;
        }

        .duties-page .duties-empty {
          text-align: center;
          padding: 24px 8px !important;
          color: #64748b !important;
        }

        .duties-page .duty-status {
          display: inline-block;
          padding: 3px 7px;
          border-radius: 4px;
          background: #e8edf3;
          color: #40516a;
          font-size: 10px;
          font-weight: 600;
        }

        .duties-page .duty-status-active {
          background: #dff3e7;
          color: #28734b;
        }

        .duties-page .duty-status-scheduled {
          background: #e8edf3;
          color: #40516a;
        }

        .duties-page .duty-status-completed {
          background: #e4e8ef;
          color: #465368;
        }

        .duties-page .assign-duty-panel h3 {
          margin: 0 0 8px;
          color: #192b46;
          font-size: 16px;
        }

        .duties-page .proposed-badge {
          display: block;
          padding: 5px 8px;
          margin-bottom: 10px;
          border-radius: 4px;
          background: #dceff0;
          color: #245c65;
          font-size: 10px;
        }

        .duties-page .assign-duty-panel form {
          display: flex;
          flex-direction: column;
        }

        .duties-page .assign-duty-button {
          margin-top: 8px;
          padding: 10px 14px;
          border: none;
          border-radius: 5px;
          background: #117f87;
          color: white;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .duties-page .assign-duty-button:hover {
          background: #0d6970;
        }

        @media (max-width: 900px) {
          .duties-page .duties-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="panel-heading">
        <div>
          <h2>Duties &amp; Scheduling</h2>
          <p>Review driver assignments, vehicles and routes.</p>
        </div>

        <button type="button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {loading && <p>Loading duties...</p>}

      {!loading && !error && (
        <div className="duties-layout">
          <article className="panel duties-table-panel">
            <div className="duties-filters">
              <div>
                <label htmlFor="duty-date-filter">Date</label>
                <input id="duty-date-filter" type="date" />
              </div>

              <div>
                <label htmlFor="duty-status-filter">Status</label>
                <select id="duty-status-filter" defaultValue="">
                  <option value="">All statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div className="duties-table-scroll">
              <table className="duties-table">
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Vehicle</th>
                    <th>Route</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {duties.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="duties-empty">
                        No duties found.
                      </td>
                    </tr>
                  ) : (
                    duties.map((duty) => (
                      <tr key={duty.id}>
                        <td>{duty.driver.name}</td>
                        <td>{duty.vehicle.registrationNo}</td>
                        <td>{duty.route.code}</td>
                        <td>
                          {duty.startTime
                            ? new Date(duty.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                          {" – "}
                          {duty.endTime
                            ? new Date(duty.endTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </td>
                        <td>
                          <span
                            className={`duty-status duty-status-${duty.status
                              .toLowerCase()
                              .replaceAll("_", "-")}`}
                          >
                            {duty.status.replaceAll("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="panel assign-duty-panel">
            <h3>Assign duty</h3>
            <span className="proposed-badge">Proposed</span>

            <form onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="assign-driver">Driver</label>
              <input
                id="assign-driver"
                type="text"
                placeholder="Select driver"
              />

              <label htmlFor="assign-vehicle">Vehicle</label>
              <input
                id="assign-vehicle"
                type="text"
                placeholder="Enter vehicle registration"
              />

              <label htmlFor="assign-route">Route</label>
              <input
                id="assign-route"
                type="text"
                placeholder="Enter route code"
              />

              <button type="submit" className="assign-duty-button">
                Assign
              </button>
            </form>
          </article>
        </div>
      )}
    </section>
  );
}

export default DutiesPage;
