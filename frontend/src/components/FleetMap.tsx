import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Vehicle } from "../types";

type FleetMapProps = {
  vehicles: Vehicle[];
};

const busIcon = L.divIcon({
  className: "bus-map-marker",
  html: `<div style="
    background:#2563eb;
    color:white;
    border:2px solid white;
    border-radius:50%;
    width:30px;
    height:30px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:16px;
    box-shadow:0 2px 6px #0005;
  ">🚌</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

export default function FleetMap({ vehicles }: FleetMapProps) {
  const vehiclesWithLocation = vehicles.filter((vehicle) => {
    const gps = vehicle.gpsPings?.[0];

    return (
      gps &&
      Number.isFinite(Number(gps.latitude)) &&
      Number.isFinite(Number(gps.longitude))
    );
  });

  return (
    <div
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "24px",
        border: "1px solid #e2e8f0",
      }}
    >
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehiclesWithLocation.map((vehicle) => {
          const gps = vehicle.gpsPings![0];

          return (
            <Marker
              key={vehicle.id}
              position={[Number(gps.latitude), Number(gps.longitude)]}
              icon={busIcon}
            >
              <Popup>
                <strong>{vehicle.registrationNo}</strong>
                <br />
                Status: {vehicle.status}
                <br />
                Depot: {vehicle.depot?.name ?? "Not assigned"}
                <br />
                Last GPS update:{" "}
                {gps.recordedAt
                  ? new Date(gps.recordedAt).toLocaleString()
                  : "Unavailable"}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {vehiclesWithLocation.length === 0 && (
        <p style={{ padding: "8px 12px", fontSize: "13px" }}>
          No GPS locations are available for the vehicles yet.
        </p>
      )}
    </div>
  );
}
