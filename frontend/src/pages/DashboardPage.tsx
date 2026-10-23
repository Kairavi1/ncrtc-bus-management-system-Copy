import type { DashboardData, User } from "../types";

type DashboardPageProps = {
  user: User;
  dashboard: DashboardData;
};

function DashboardPage({ user, dashboard }: Readonly<DashboardPageProps>) {
  const cards = [
    {
      label: "Total vehicles",
      value: dashboard.summary.totalVehicles,
      icon: "BUS",
      color: "blue",
    },
    {
      label: "Routes configured",
      value: dashboard.summary.totalRoutes,
      icon: "RTE",
      color: "purple",
    },
    {
      label: "Active duties",
      value: dashboard.summary.activeDuties,
      icon: "DUT",
      color: "green",
    },
    {
      label: "Open incidents",
      value: dashboard.summary.openIncidents,
      icon: "INC",
      color: "orange",
    },
  ];

  return (
    <>
      <div className="welcome">
        <div>
          <h2>Welcome back, {user.name.split(" ")[0]}</h2>
          <p>Here is the current overview of your transit operations.</p>
        </div>
        <span className="live-label">
          <span className="status-dot" /> SYSTEM ONLINE
        </span>
      </div>

      <section className="stats-grid">
        {cards.map((card) => (
          <article className="stat-card" key={card.label}>
            <div className={`stat-icon ${card.color}`}>{card.icon}</div>
            <p>{card.label}</p>
            <strong>{card.value}</strong>
            <span className="stat-foot">From local database</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h3>Recent incidents</h3>
              <p>Latest reported operational issues</p>
            </div>
            <span className="count-badge">
              {dashboard.recentIncidents.length}
            </span>
          </div>

          {dashboard.recentIncidents.length === 0 ? (
            <p className="empty-state">No incidents reported.</p>
          ) : (
            dashboard.recentIncidents.map((incident) => (
              <div className="incident-row" key={incident.id}>
                <div className="incident-symbol">!</div>
                <div className="row-main">
                  <strong>{incident.type.replaceAll("_", " ")}</strong>
                  <p>{incident.description}</p>
                  <span>{incident.status}</span>
                </div>
                <span
                  className={`severity ${
                    incident.severity === "P1" ? "critical" : ""
                  }`}
                >
                  {incident.severity}
                </span>
              </div>
            ))
          )}
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <h3>Notices & announcements</h3>
              <p>Latest operational updates</p>
            </div>
          </div>

          {dashboard.recentNotices.length === 0 ? (
            <p className="empty-state">No notices available.</p>
          ) : (
            dashboard.recentNotices.map((notice) => (
              <div className="notice-row" key={notice.id}>
                <div className="notice-symbol">i</div>
                <div>
                  <strong>{notice.title}</strong>
                  <p>{notice.body}</p>
                </div>
              </div>
            ))
          )}
        </article>
      </section>
    </>
  );
}

export default DashboardPage;
