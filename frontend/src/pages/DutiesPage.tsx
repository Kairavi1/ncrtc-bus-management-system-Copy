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
    <section className="incidents-page">
      <div className="panel-heading">
        <div>
          <h2>Duty Scheduling</h2>
          <p>Review driver assignments, vehicles and routes.</p>
        </div>
        <button type="button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading duties...</p>}

      {!loading && !error && (
        <article className="panel">
          {duties.length === 0 ? (
            <p>No duties found.</p>
          ) : (
            duties.map((duty) => (
              <div className="incident-row" key={duty.id}>
                <div className="incident-symbol">D</div>
                <div className="row-main">
                  <strong>{duty.driver.name}</strong>
                  <p>
                    {duty.vehicle.registrationNo} · {duty.route.code} —{" "}
                    {duty.route.name}
                  </p>
                  <span>Status: {duty.status}</span>
                  {duty.startTime && (
                    <p>Start: {new Date(duty.startTime).toLocaleString()}</p>
                  )}
                  {duty.endTime && (
                    <p>End: {new Date(duty.endTime).toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </article>
      )}
    </section>
  );
}

export default DutiesPage;
