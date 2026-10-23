import type { Vehicle } from "../types";
import FleetMap from "../components/FleetMap";

type FleetPageProps = {
  vehicles: Vehicle[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
};

function FleetPage({
  vehicles,
  loading,
  error,
  onRefresh,
}: Readonly<FleetPageProps>) {
  const activeVehicles = vehicles.filter(
    (vehicle) => vehicle.status.toLowerCase() === "active",
  );

  const vehiclesWithGps = vehicles.filter(
    (vehicle) => vehicle.gpsPings?.length > 0,
  );

  return (
    <section className="fleet-page">
      <style>{`
        .fleet-page {
          color: #10243d;
          font-size: 12px;
        }

        .fleet-page .fleet-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
        }

        .fleet-page .fleet-heading h2 {
          margin: 0 0 5px;
          font-size: 20px;
          font-weight: 800;
        }

        .fleet-page .fleet-heading p {
          margin: 0;
          color: #52647c;
          font-size: 12px;
        }

        .fleet-page .fleet-refresh {
          padding: 9px 15px;
          border: 1px solid #d6deea;
          border-radius: 5px;
          background: #fff;
          color: #10243d;
          font-weight: 700;
          cursor: pointer;
        }

        .fleet-page .fleet-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 13px;
          margin-bottom: 15px;
        }

        .fleet-page .fleet-stat {
          min-width: 0;
          padding: 14px;
          border: 1px solid #dce3ec;
          border-top: 2px solid #11838a;
          border-radius: 6px;
          background: #fff;
        }

        .fleet-page .fleet-stat:nth-child(2) {
          border-top-color: #477dbb;
        }

        .fleet-page .fleet-stat:nth-child(3) {
          border-top-color: #75839a;
        }

        .fleet-page .fleet-stat p {
          margin: 0 0 8px;
          color: #465873;
        }

        .fleet-page .fleet-stat strong {
          font-size: 25px;
          line-height: 1;
        }

        .fleet-page .fleet-map-panel {
          overflow: hidden;
          margin-bottom: 15px;
          border: 1px solid #dce3ec;
          border-radius: 6px;
          background: #fff;
        }

        .fleet-page .fleet-map-panel .leaflet-container {
          width: 100%;
          height: 340px;
          background: #e5eef2;
        }

        .fleet-page .fleet-map-caption {
          margin: 0;
          padding: 9px 12px;
          color: #465873;
          font-size: 11px;
        }

        .fleet-page .fleet-lower-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(240px, 2fr);
          gap: 12px;
          align-items: stretch;
        }

        .fleet-page .fleet-vehicle-card,
        .fleet-page .fleet-history-card {
          min-width: 0;
          padding: 13px;
          border: 1px solid #dce3ec;
          border-radius: 6px;
          background: #fff;
        }

        .fleet-page .fleet-vehicle-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 8px;
        }

        .fleet-page .fleet-vehicle-top strong,
        .fleet-page .fleet-history-card h3 {
          margin: 0;
          font-size: 12px;
          font-weight: 800;
        }

        .fleet-page .fleet-status {
          padding: 3px 7px;
          border-radius: 3px;
          background: #e3e9f0;
          color: #34445b;
          font-size: 10px;
        }

        .fleet-page .fleet-status.active {
          background: #d9f3e7;
          color: #146747;
        }

        .fleet-page .fleet-vehicle-card p,
        .fleet-page .fleet-history-card p {
          margin: 5px 0 0;
          color: #354965;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .fleet-page .fleet-history-card {
          border-style: dashed;
        }

        .fleet-page .fleet-proposed {
          margin-left: 6px;
          padding: 3px 6px;
          border-radius: 3px;
          background: #d4f0f1;
          color: #12636a;
          font-size: 10px;
          font-weight: 500;
        }

        .fleet-page .fleet-error {
          margin-bottom: 12px;
          color: #b42318;
        }

        @media (max-width: 900px) {
          .fleet-page .fleet-lower-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .fleet-page .fleet-history-card {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 560px) {
          .fleet-page .fleet-stats {
            grid-template-columns: 1fr;
          }

          .fleet-page .fleet-lower-grid {
            grid-template-columns: 1fr;
          }

          .fleet-page .fleet-history-card {
            grid-column: auto;
          }

          .fleet-page .fleet-map-panel .leaflet-container {
            height: 280px;
          }
        }
      `}</style>

      <div className="fleet-heading">
        <div>
          <h2>Fleet Management</h2>
          <p>Live-style GPS monitoring from simulated pings.</p>
        </div>

        <button
          className="fleet-refresh"
          type="button"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <p className="fleet-error">{error}</p>}

      <section className="fleet-stats">
        <article className="fleet-stat">
          <p>Registered</p>
          <strong>{vehicles.length}</strong>
        </article>

        <article className="fleet-stat">
          <p>Active</p>
          <strong>{activeVehicles.length}</strong>
        </article>

        <article className="fleet-stat">
          <p>With GPS</p>
          <strong>{vehiclesWithGps.length}</strong>
        </article>
      </section>

      <article className="fleet-map-panel">
        <FleetMap vehicles={vehicles} />
        <p className="fleet-map-caption">
          Live fleet positions · Select a bus marker to view its details.
        </p>
      </article>

      <section className="fleet-lower-grid">
        {vehicles.slice(0, 2).map((vehicle) => {
          const gps = vehicle.gpsPings?.[0];
          const duty = vehicle.duties?.[0];

          return (
            <article className="fleet-vehicle-card" key={vehicle.id}>
              <div className="fleet-vehicle-top">
                <strong>{vehicle.registrationNo}</strong>
                <span
                  className={`fleet-status ${
                    vehicle.status.toLowerCase() === "active" ? "active" : ""
                  }`}
                >
                  {vehicle.status}
                </span>
              </div>

              <p>
                Depot: {vehicle.depot?.name ?? "Not assigned"}
                {duty?.route?.code ? ` · ${duty.route.code}` : ""}
              </p>

              <p>
                Driver: {duty?.driver?.name ?? "Not assigned"}
                {gps ? ` · ${gps.speed} km/h` : ""}
              </p>

              {gps && (
                <p>
                  {Number(gps.latitude).toFixed(4)},{" "}
                  {Number(gps.longitude).toFixed(4)}
                  {" · GPS "}
                  {new Date(gps.recordedAt).toLocaleTimeString()}
                </p>
              )}
            </article>
          );
        })}

        <article className="fleet-history-card">
          <h3>
            Trip history
            <span className="fleet-proposed">In progress</span>
          </h3>
          <p>
            GPS history for individual buses, including timestamps, coordinates,
            speed and plotted route.
          </p>
          <p>Select a bus to view its recorded journey.</p>
        </article>
      </section>
    </section>
  );
}

export default FleetPage;
