import { useEffect, useState, type FormEvent } from "react";
import "./App.css";

import type {
  User,
  Incident,
  DashboardData,
  Vehicle,
  TransitRoute,
} from "./types";

import IncidentsPage from "./pages/IncidentsPage";
import FleetPage from "./pages/FleetPage";
import DashboardPage from "./pages/DashboardPage";
import RoutesPage from "./pages/RoutesPage";
import DutiesPage from "./pages/DutiesPage";
import LoginPage from "./pages/LoginPage";
import NoticesPage from "./pages/NoticesPage";

const API = "http://localhost:5001";

type Stop = {
  id: string;
  name: string;
  location: string;
};

type Duty = {
  id: string;
  status: string;
  driver: { name: string };
  vehicle: { registrationNo: string };
  route: { code: string; name: string };
  startTime?: string;
  endTime?: string;
};

function App() {
  const [email, setEmail] = useState("admin@ncrtc.demo");
  const [password, setPassword] = useState("Demo@123");
  const [token, setToken] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState("Dashboard");

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [incidentLoading, setIncidentLoading] = useState(false);
  const [incidentError, setIncidentError] = useState("");
  const [updatingIncident, setUpdatingIncident] = useState("");
  const [incidentNotes, setIncidentNotes] = useState<Record<string, string>>(
    {},
  );
  const [successMessage, setSuccessMessage] = useState("");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [vehicleError, setVehicleError] = useState("");

  const [routes, setRoutes] = useState<TransitRoute[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [routesError, setRoutesError] = useState("");

  const [duties, setDuties] = useState<Duty[]>([]);
  const [dutiesLoading, setDutiesLoading] = useState(false);
  const [dutiesError, setDutiesError] = useState("");

  async function loadVehicles() {
    if (!token) return;

    setVehicleLoading(true);
    setVehicleError("");

    try {
      const response = await fetch(`${API}/api/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load vehicles.");
      }

      setVehicles(Array.isArray(data) ? data : (data.vehicles ?? []));
    } catch (err) {
      setVehicleError(
        err instanceof Error ? err.message : "Could not load vehicles.",
      );
    } finally {
      setVehicleLoading(false);
    }
  }

  async function loadIncidents() {
    if (!token) return;

    setIncidentLoading(true);
    setIncidentError("");

    try {
      const response = await fetch(`${API}/api/incidents`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load incidents.");
      }

      setIncidents(Array.isArray(data) ? data : (data.incidents ?? []));
    } catch (err) {
      setIncidentError(
        err instanceof Error ? err.message : "Could not load incidents.",
      );
    } finally {
      setIncidentLoading(false);
    }
  }

  async function loadRoutesAndStops() {
    if (!token) return;

    setRoutesLoading(true);
    setRoutesError("");

    try {
      const [routesResponse, stopsResponse] = await Promise.all([
        fetch(`${API}/api/routes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/stops`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const routesData = await routesResponse.json();
      const stopsData = await stopsResponse.json();

      if (!routesResponse.ok || !stopsResponse.ok) {
        throw new Error("Could not load routes and stops.");
      }

      setRoutes(
        Array.isArray(routesData) ? routesData : (routesData.routes ?? []),
      );

      setStops(Array.isArray(stopsData) ? stopsData : (stopsData.stops ?? []));
    } catch (err) {
      setRoutesError(
        err instanceof Error ? err.message : "Could not load routes and stops.",
      );
    } finally {
      setRoutesLoading(false);
    }
  }

  async function loadDuties() {
    if (!token) return;

    setDutiesLoading(true);
    setDutiesError("");

    try {
      const response = await fetch(`${API}/api/duties`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load duties.");
      }

      setDuties(Array.isArray(data) ? data : (data.duties ?? []));
    } catch (err) {
      setDutiesError(
        err instanceof Error ? err.message : "Could not load duties.",
      );
    } finally {
      setDutiesLoading(false);
    }
  }

  useEffect(() => {
    if (!token) return;

    if (selectedPage === "Fleet management") {
      void loadVehicles();
    }

    if (selectedPage === "Incidents") {
      void loadIncidents();
    }

    if (selectedPage === "Routes & stops") {
      void loadRoutesAndStops();
    }

    if (selectedPage === "Duty scheduling") {
      void loadDuties();
    }
  }, [token, selectedPage]);

  useEffect(() => {
    if (!token || selectedPage !== "Fleet management") {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadVehicles();
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [token, selectedPage]);

  async function updateIncidentStatus(incidentId: string, status: string) {
    setUpdatingIncident(incidentId);
    setIncidentError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API}/api/incidents/${incidentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            note: incidentNotes[incidentId] || `Status changed to ${status}`,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update incident.");
      }

      setSuccessMessage("Incident status updated successfully.");
      await loadIncidents();
    } catch (err) {
      setIncidentError(
        err instanceof Error ? err.message : "Could not update incident.",
      );
    } finally {
      setUpdatingIncident("");
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed.");
      }

      const dashboardResponse = await fetch(`${API}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${result.token}`,
        },
      });

      const dashboardData = await dashboardResponse.json();

      if (!dashboardResponse.ok) {
        throw new Error("Login succeeded, but dashboard loading failed.");
      }

      setToken(result.token);
      setUser(result.user);
      setDashboard(dashboardData);
      setSelectedPage("Dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken("");
    setUser(null);
    setDashboard(null);
    setIncidents([]);
    setVehicles([]);
    setRoutes([]);
    setStops([]);
    setDuties([]);
    setSelectedPage("Dashboard");
    setError("");
    setPassword("");
  }

  if (!token || !user || !dashboard) {
    return (
      <LoginPage
        email={email}
        password={password}
        error={error}
        loading={loading}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  const pages = [
    "Dashboard",
    "Fleet management",
    "Routes & stops",
    "Duty scheduling",
    "Incidents",
    "Notices",
  ];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small">N</div>
          <div>
            <strong>NCRTC</strong>
            <span>Transit Control</span>
          </div>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`nav-item ${selectedPage === page ? "active" : ""}`}
            onClick={() => setSelectedPage(page)}
          >
            {page === "Dashboard" && "▦ "}
            {page === "Fleet management" && "▣ "}
            {page === "Routes & stops" && "↔ "}
            {page === "Duty scheduling" && "◷ "}
            {page === "Incidents" && "⚑ "}
            {page === "Notices" && "▤ "}
            {page}
          </button>
        ))}

        <div className="sidebar-bottom">
          <span className="status-dot" />
          API connected
          <p>Local demonstration environment</p>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">OPERATIONS OVERVIEW</p>
            <h1>{selectedPage}</h1>
          </div>

          <div className="profile">
            <div className="avatar">{user.name.charAt(0)}</div>
            <div className="profile-details">
              <strong>{user.name}</strong>
              <span>{user.role.replaceAll("_", " ")}</span>
            </div>
            <button className="logout" type="button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </header>

        {selectedPage === "Dashboard" && (
          <DashboardPage user={user} dashboard={dashboard} />
        )}

        {selectedPage === "Fleet management" && (
          <FleetPage
            vehicles={vehicles}
            loading={vehicleLoading}
            error={vehicleError}
            onRefresh={() => void loadVehicles()}
          />
        )}

        {selectedPage === "Routes & stops" && (
          <RoutesPage
            routes={routes}
            stops={stops}
            loading={routesLoading}
            error={routesError}
            onRefresh={() => void loadRoutesAndStops()}
          />
        )}

        {selectedPage === "Duty scheduling" && (
          <DutiesPage
            duties={duties}
            loading={dutiesLoading}
            error={dutiesError}
            onRefresh={() => void loadDuties()}
          />
        )}

        {selectedPage === "Incidents" && (
          <IncidentsPage
            incidents={incidents}
            loading={incidentLoading}
            error={incidentError}
            successMessage={successMessage}
            incidentNotes={incidentNotes}
            updatingIncident={updatingIncident}
            onRefresh={() => void loadIncidents()}
            onNoteChange={(incidentId, note) =>
              setIncidentNotes((previous) => ({
                ...previous,
                [incidentId]: note,
              }))
            }
            onStatusChange={(incidentId, status) =>
              void updateIncidentStatus(incidentId, status)
            }
          />
        )}

        {selectedPage === "Notices" && (
          <NoticesPage notices={dashboard.recentNotices} />
        )}

        <footer className="page-footer">
          NCRTC Bus Management System · Assessment demo
        </footer>
      </section>
    </main>
  );
}

export default App;
