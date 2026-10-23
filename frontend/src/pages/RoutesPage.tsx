import type { TransitRoute } from "../types";

type Stop = {
  id: string;
  name: string;
  location: string;
};

type RoutesPageProps = {
  routes: TransitRoute[];
  stops: Stop[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
};

function RoutesPage({
  routes,
  stops,
  loading,
  error,
  onRefresh,
}: Readonly<RoutesPageProps>) {
  return (
    <section className="incidents-page">
      <div className="panel-heading">
        <div>
          <h2>Routes & Stops</h2>
          <p>View configured routes and their ordered stops.</p>
        </div>
        <button type="button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading routes and stops...</p>}

      {!loading && !error && (
        <>
          <section className="stats-grid">
            <article className="stat-card">
              <p>Total routes</p>
              <strong>{routes.length}</strong>
            </article>
            <article className="stat-card">
              <p>Total stops</p>
              <strong>{stops.length}</strong>
            </article>
          </section>

          <article className="panel">
            <h3>Configured routes</h3>
            {routes.length === 0 ? (
              <p>No routes found.</p>
            ) : (
              routes.map((route) => (
                <div className="incident-row" key={route.id}>
                  <div className="incident-symbol">R</div>
                  <div className="row-main">
                    <strong>
                      {route.routeNumber} — {route.name}
                    </strong>
                    <p>
                      {route.routeStops
                        .sort((a, b) => a.sequence - b.sequence)
                        .map((item) => item.stop.name)
                        .join(" → ") || "No stops assigned"}
                    </p>
                    <span>Status: {route.status}</span>
                  </div>
                </div>
              ))
            )}
          </article>

          <article className="panel">
            <h3>All stops</h3>
            {stops.length === 0 ? (
              <p>No stops found.</p>
            ) : (
              stops.map((stop) => (
                <div className="incident-row" key={stop.id}>
                  <div className="incident-symbol">S</div>
                  <div className="row-main">
                    <strong>{stop.name}</strong>
                    <p>{stop.location}</p>
                  </div>
                </div>
              ))
            )}
          </article>
        </>
      )}
    </section>
  );
}

export default RoutesPage;
