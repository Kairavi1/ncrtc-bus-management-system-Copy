import type { DashboardData, User } from "../types";

type DashboardPageProps = {
  user: User;
  dashboard: DashboardData;
};

function DashboardPage({ dashboard }: Readonly<DashboardPageProps>) {
  const cards = [
    {
      label: "Total vehicles",
      value: dashboard.summary.totalVehicles,
      color: "#168b91",
    },
    {
      label: "Total routes",
      value: dashboard.summary.totalRoutes,
      color: "#4678bd",
    },
    {
      label: "Active duties",
      value: dashboard.summary.activeDuties,
      color: "#7b879c",
    },
    {
      label: "Open incidents",
      value: dashboard.summary.openIncidents,
      color: "#d92d20",
    },
  ];

  return (
    <div className="ncrtc-dashboard">
      <div className="ncrtc-dashboard-intro">
        <div>
          <h2>Dashboard</h2>
          <p>Operational overview for today. Sample data is illustrative.</p>
        </div>
      </div>

      <section className="ncrtc-dashboard-stats">
        {cards.map((card) => (
          <article
            className="ncrtc-dashboard-stat"
            key={card.label}
            style={{ borderTopColor: card.color }}
          >
            <p>{card.label}</p>
            <strong>{card.value ?? "—"}</strong>
          </article>
        ))}
      </section>

      <section className="ncrtc-dashboard-panels">
        <article className="ncrtc-dashboard-panel">
          <h3>Recent incidents</h3>

          {dashboard.recentIncidents.length === 0 ? (
            <p className="ncrtc-dashboard-empty">No incidents reported.</p>
          ) : (
            dashboard.recentIncidents.map((incident) => (
              <div className="ncrtc-dashboard-incident" key={incident.id}>
                <div className="ncrtc-dashboard-incident-main">
                  <strong>
                    {incident.type.replaceAll("_", " ")}
                    {incident.vehicle?.registrationNo
                      ? ` · ${incident.vehicle.registrationNo}`
                      : ""}
                  </strong>
                  <p>{incident.description}</p>
                </div>

                <div className="ncrtc-dashboard-badges">
                  <span
                    className={`ncrtc-dashboard-badge ${
                      incident.severity === "P1" ? "danger" : "warning"
                    }`}
                  >
                    {incident.severity === "P1" ? "● " : "▲ "}
                    {incident.severity}
                  </span>

                  <span
                    className={`ncrtc-dashboard-badge ${
                      incident.status.toLowerCase() === "resolved"
                        ? "success"
                        : "warning"
                    }`}
                  >
                    {incident.status === "IN_PROGRESS"
                      ? "▲ In progress"
                      : incident.status === "OPEN"
                        ? "▲ Open"
                        : incident.status.replaceAll("_", " ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </article>

        <article className="ncrtc-dashboard-panel">
          <h3>Notices &amp; announcements</h3>

          {dashboard.recentNotices.length === 0 ? (
            <p className="ncrtc-dashboard-empty">No notices available.</p>
          ) : (
            dashboard.recentNotices.map((notice) => (
              <div className="ncrtc-dashboard-notice" key={notice.id}>
                <strong>{notice.title}</strong>
                <p>{notice.body}</p>
              </div>
            ))
          )}
        </article>
      </section>

      <style>{`
        .ncrtc-dashboard {
          color: #10243d;
          font-family: "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif;
          text-align: left;
        }

        .ncrtc-dashboard * {
          box-sizing: border-box;
        }

        .ncrtc-dashboard-intro {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0 15px;
        }

        .ncrtc-dashboard-intro h2 {
          margin: 0 0 5px;
          color: #10243d;
          font-family: Manrope, sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .ncrtc-dashboard-intro p {
          margin: 0;
          color: #53647c;
          font-size: 11px;
          line-height: 1.5;
        }

        .ncrtc-dashboard-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
        }

        .ncrtc-dashboard-stat {
          min-width: 0;
          min-height: 76px;
          padding: 13px;
          border: 1px solid #dce3ec;
          border-top: 2px solid;
          border-radius: 6px;
          background: #fff;
        }

        .ncrtc-dashboard-stat p {
          margin: 0 0 8px;
          color: #344966;
          font-size: 10px;
        }

        .ncrtc-dashboard-stat strong {
          display: block;
          color: #10243d;
          font-family: Manrope, sans-serif;
          font-size: 23px;
          font-weight: 800;
          line-height: 1.1;
        }

        .ncrtc-dashboard-panels {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: stretch;
          gap: 13px;
          margin-top: 16px;
        }

        .ncrtc-dashboard-panel {
          min-width: 0;
          padding: 13px;
          border: 1px solid #dce3ec;
          border-radius: 6px;
          background: #fff;
        }

        .ncrtc-dashboard-panel h3 {
          margin: 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #e8edf3;
          color: #10243d;
          font-family: Manrope, sans-serif;
          font-size: 12px;
          font-weight: 800;
        }

        .ncrtc-dashboard-incident {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 9px 0;
          border-bottom: 1px solid #e8edf3;
        }

        .ncrtc-dashboard-incident:last-child {
          border-bottom: 0;
        }

        .ncrtc-dashboard-incident-main {
          min-width: 0;
          flex: 1;
        }

        .ncrtc-dashboard-incident-main strong,
        .ncrtc-dashboard-notice strong {
          display: block;
          color: #10243d;
          font-size: 10px;
          font-weight: 800;
          line-height: 1.4;
          text-transform: capitalize;
          overflow-wrap: anywhere;
        }

        .ncrtc-dashboard-incident-main p,
        .ncrtc-dashboard-notice p {
          margin: 2px 0 0;
          color: #344966;
          font-size: 10px;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .ncrtc-dashboard-badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 4px;
          flex-shrink: 0;
        }

        .ncrtc-dashboard-badge {
          display: inline-block;
          padding: 4px 6px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 700;
          white-space: nowrap;
        }

        .ncrtc-dashboard-badge.danger {
          background: #fbdede;
          color: #a82424;
        }

        .ncrtc-dashboard-badge.warning {
          background: #ffedca;
          color: #8b5500;
        }

        .ncrtc-dashboard-badge.success {
          background: #d9f4e7;
          color: #176744;
        }

        .ncrtc-dashboard-notice {
          padding: 11px 0;
          border-bottom: 1px solid #e8edf3;
        }

        .ncrtc-dashboard-notice:last-child {
          border-bottom: 0;
        }

        .ncrtc-dashboard-empty {
          margin: 0;
          padding: 14px 0;
          color: #718096;
          font-size: 11px;
        }

        @media (max-width: 900px) {
          .ncrtc-dashboard-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ncrtc-dashboard-panels {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .ncrtc-dashboard-incident {
            align-items: flex-start;
            flex-direction: column;
          }

          .ncrtc-dashboard-badges {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default DashboardPage;
