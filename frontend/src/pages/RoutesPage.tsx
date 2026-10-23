import { useMemo, useState } from "react";
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

const styles = `
  .routes-screen {
    color: #10243d;
    font-family: "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .routes-screen * {
    box-sizing: border-box;
  }

  .routes-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 18px;
  }

  .routes-heading h2 {
    margin: 0 0 5px;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -.4px;
  }

  .routes-heading p {
    margin: 0;
    color: #52647d;
    font-size: 12px;
  }

  .routes-refresh {
    padding: 9px 15px;
    border: 1px solid #cbd5e1;
    border-radius: 5px;
    background: white;
    color: #10243d;
    font-weight: 700;
    cursor: pointer;
  }

  .routes-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(260px, 1fr);
    gap: 12px;
    align-items: stretch;
  }

  .routes-panel {
    min-width: 0;
    padding: 14px;
    border: 1px solid #d8e0ea;
    border-radius: 7px;
    background: #fff;
  }

  .routes-panel h3 {
    margin: 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 13px;
    font-weight: 800;
  }

  .routes-search-row {
    display: flex;
    gap: 8px;
    align-items: end;
    margin: 12px 0 15px;
  }

  .routes-search {
    flex: 1;
    min-width: 0;
  }

  .routes-search label,
  .routes-form label {
    display: block;
    margin-bottom: 6px;
    font-size: 11px;
    font-weight: 700;
  }

  .routes-search input {
    width: 100%;
    height: 34px;
    padding: 0 10px;
    border: 1px solid #a9b8cc;
    border-radius: 5px;
    color: #10243d;
    outline: none;
  }

  .routes-search input:focus {
    border-color: #117f86;
    box-shadow: 0 0 0 2px #117f861c;
  }

  .routes-new-button {
    height: 34px;
    padding: 0 14px;
    border: 0;
    border-radius: 5px;
    background: #117f86;
    color: #fff;
    font-size: 12px;
    font-weight: 800;
    white-space: nowrap;
    cursor: pointer;
  }

  .routes-proposed {
    display: inline-block;
    padding: 3px 7px;
    border-radius: 3px;
    background: #d5f1f2;
    color: #075b66;
    font-size: 10px;
    white-space: nowrap;
  }

  .routes-table-wrap {
    overflow-x: auto;
  }

  .routes-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    text-align: left;
  }

  .routes-table th {
    padding: 0 6px 10px;
    color: #43546d;
    font-size: 10px;
    font-weight: 800;
  }

  .routes-table td {
    padding: 11px 6px;
    border-top: 1px solid #e0e6ee;
    vertical-align: middle;
  }

  .routes-table tr.selected {
    background: #f0f7f8;
  }

  .routes-name-button {
    padding: 0;
    border: 0;
    background: transparent;
    color: #10243d;
    font: inherit;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
  }

  .routes-name-button:hover {
    color: #117f86;
    text-decoration: underline;
  }

  .routes-view-button {
    padding: 4px 0;
    border: 0;
    background: transparent;
    color: #117f86;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .routes-stop-item {
    padding: 11px 0;
    border-bottom: 1px solid #e6ebf1;
  }

  .routes-stop-item:last-child {
    border-bottom: 0;
  }

  .routes-stop-item strong {
    display: block;
    margin-bottom: 4px;
    font-size: 11px;
  }

  .routes-stop-item p {
    margin: 0;
    color: #52647d;
    font-size: 11px;
  }

  .routes-empty {
    padding: 18px 0;
    color: #66758a;
    font-size: 12px;
  }

  .routes-error {
    margin-bottom: 14px;
    color: #b42318;
    font-size: 13px;
  }

  .routes-form {
    display: grid;
    gap: 12px;
    margin-top: 14px;
  }

  .routes-form input,
  .routes-form select {
    width: 100%;
    min-height: 35px;
    padding: 7px 9px;
    border: 1px solid #a9b8cc;
    border-radius: 5px;
    background: #fff;
    color: #10243d;
    font: inherit;
    font-size: 12px;
  }

  .routes-mobile-note {
    margin-top: 10px;
    color: #66758a;
    font-size: 11px;
  }

  @media (max-width: 760px) {
    .routes-layout {
      grid-template-columns: 1fr;
    }

    .routes-heading {
      align-items: flex-start;
    }

    .routes-search-row {
      flex-wrap: wrap;
    }
  }
`;

function RoutesPage({
  routes,
  stops,
  loading,
  error,
  onRefresh,
}: Readonly<RoutesPageProps>) {
  const [search, setSearch] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [showNewRoute, setShowNewRoute] = useState(false);

  const filteredRoutes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return routes.filter(
      (route) =>
        route.name.toLowerCase().includes(query) ||
        route.routeNumber.toLowerCase().includes(query),
    );
  }, [routes, search]);

  const selectedRoute =
    routes.find((route) => route.id === selectedRouteId) ??
    filteredRoutes[0] ??
    routes[0];

  const selectedStops = selectedRoute
    ? [...selectedRoute.routeStops]
        .sort((a, b) => a.sequence - b.sequence)
        .map((item) => item.stop)
    : [];

  return (
    <>
      <style>{styles}</style>

      <section className="routes-screen">
        <div className="routes-heading">
          <div>
            <h2>Routes &amp; Stops</h2>
            <p>Existing: view routes and stops. Create/edit is proposed.</p>
          </div>

          <button className="routes-refresh" type="button" onClick={onRefresh}>
            Refresh
          </button>
        </div>

        {error && <p className="routes-error">{error}</p>}
        {loading && <p className="routes-empty">Loading routes and stops...</p>}

        {!loading && !error && (
          <div className="routes-layout">
            <article className="routes-panel">
              <h3>Configured routes</h3>

              <div className="routes-search-row">
                <div className="routes-search">
                  <label htmlFor="route-search">Search routes</label>
                  <input
                    id="route-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by route name or code"
                  />
                </div>

                <button
                  className="routes-new-button"
                  type="button"
                  onClick={() => setShowNewRoute((current) => !current)}
                >
                  {showNewRoute ? "Close" : "New route"}
                </button>

                <span className="routes-proposed">Proposed</span>
              </div>

              {showNewRoute && (
                <p className="routes-mobile-note">
                  Route creation is not connected to the backend yet. Your
                  existing routes remain unchanged.
                </p>
              )}

              <div className="routes-table-wrap">
                <table className="routes-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Stops</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRoutes.map((route) => (
                      <tr
                        key={route.id}
                        className={
                          selectedRoute?.id === route.id ? "selected" : ""
                        }
                      >
                        <td>{route.routeNumber}</td>
                        <td>
                          <button
                            className="routes-name-button"
                            type="button"
                            onClick={() => setSelectedRouteId(route.id)}
                          >
                            {route.name}
                          </button>
                        </td>
                        <td>{route.routeStops.length}</td>
                        <td>
                          <button
                            className="routes-view-button"
                            type="button"
                            onClick={() => setSelectedRouteId(route.id)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredRoutes.length === 0 && (
                      <tr>
                        <td colSpan={4} className="routes-empty">
                          {routes.length === 0
                            ? "No routes configured yet."
                            : "No routes match your search."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p className="routes-mobile-note">
                Showing {filteredRoutes.length} of {routes.length} routes
              </p>
            </article>

            <article className="routes-panel">
              <h3>
                {selectedRoute
                  ? `Stops on ${selectedRoute.routeNumber}`
                  : "Stops on selected route"}
              </h3>

              {selectedRoute ? (
                <>
                  <p className="routes-mobile-note">{selectedRoute.name}</p>

                  {selectedStops.length > 0 ? (
                    selectedStops.map((stop, index) => (
                      <div
                        className="routes-stop-item"
                        key={`${stop.id}-${index}`}
                      >
                        <strong>{stop.name}</strong>
                        <p>{stop.location}</p>
                      </div>
                    ))
                  ) : (
                    <p className="routes-empty">
                      No stops assigned to this route.
                    </p>
                  )}
                </>
              ) : (
                <p className="routes-empty">
                  Select a route to view its stops.
                </p>
              )}

              <div style={{ marginTop: 14 }}>
                <span className="routes-proposed">Add stop · Proposed</span>
              </div>

              <p className="routes-mobile-note">
                {stops.length} stops are available in the system.
              </p>
            </article>
          </div>
        )}
      </section>
    </>
  );
}

export default RoutesPage;
