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
  return (
    <section className="incidents-page">
      <div className="panel-heading">
        <div>
          <h2>Fleet overview</h2>
          <p>Vehicle status, depot assignments and latest GPS data.</p>
        </div>
        <button type="button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading fleet...</p>}

      <FleetMap vehicles={vehicles} />

      {!loading && !error && vehicles.length === 0 && (
        <article className="panel">
          <p>No vehicles found.</p>
        </article>
      )}

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon blue">BUS</div>
          <p>Total vehicles</p>
          <strong>{vehicles.length}</strong>
          <span className="stat-foot">Registered in the system</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon green">ON</div>
          <p>Active vehicles</p>
          <strong>
            {vehicles.filter((v) => v.status.toLowerCase() === "active").length}
          </strong>
          <span className="stat-foot">Based on recorded status</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon purple">GPS</div>
          <p>Vehicles with GPS</p>
          <strong>
            {vehicles.filter((v) => v.gpsPings.length > 0).length}
          </strong>
          <span className="stat-foot">Have a recorded GPS ping</span>
        </article>
      </section>

      {vehicles.map((vehicle) => {
        const gps = vehicle.gpsPings[0];
        const duty = vehicle.duties[0];

        return (
          <article className="incident-card" key={vehicle.id}>
            <div className="incident-card-header">
              <div>
                <span className="eyebrow">VEHICLE REGISTRATION</span>
                <h3>{vehicle.registrationNo}</h3>
              </div>
              <span className="incident-status">{vehicle.status}</span>
            </div>

            <div className="incident-meta">
              <span>Depot: {vehicle.depot.name}</span>
              <span>Location: {vehicle.depot.location}</span>
            </div>

            <h4>Latest GPS information</h4>

            {gps ? (
              <div className="incident-meta">
                <span>Latitude: {gps.latitude}</span>
                <span>Longitude: {gps.longitude}</span>
                <span>Speed: {gps.speed} km/h</span>
                <span>
                  Recorded: {new Date(gps.recordedAt).toLocaleString()}
                </span>
              </div>
            ) : (
              <p>No GPS data recorded.</p>
            )}

            <h4>Duty assignment</h4>

            {duty ? (
              <div className="incident-meta">
                <span>Driver: {duty.driver.name}</span>
                <span>
                  Route: {duty.route.code} — {duty.route.name}
                </span>
                <span>Duty status: {duty.status}</span>
              </div>
            ) : (
              <p>No duty currently associated with this vehicle.</p>
            )}
          </article>
        );
      })}
    </section>
  );
}

export default FleetPage;
