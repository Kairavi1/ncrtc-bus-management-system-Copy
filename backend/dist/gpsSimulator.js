"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_1 = require("./prisma");
const INTERVAL_MS = 5000;
const buses = [
    {
        registrationNo: "DL01AB1234",
        start: { latitude: 28.5889, longitude: 77.2572 },
        end: { latitude: 28.6469, longitude: 77.316 },
        progress: 0,
        direction: 1,
    },
    {
        registrationNo: "UP14CD5678",
        start: { latitude: 28.6692, longitude: 77.4538 },
        end: { latitude: 28.6469, longitude: 77.316 },
        progress: 0,
        direction: 1,
    },
];
async function saveGpsPings() {
    for (const bus of buses) {
        const vehicle = await prisma_1.prisma.vehicle.findUnique({
            where: { registrationNo: bus.registrationNo },
        });
        if (!vehicle) {
            console.warn(`Vehicle ${bus.registrationNo} not found; skipping.`);
            continue;
        }
        bus.progress += 0.015 * bus.direction;
        if (bus.progress >= 1) {
            bus.progress = 1;
            bus.direction = -1;
        }
        else if (bus.progress <= 0) {
            bus.progress = 0;
            bus.direction = 1;
        }
        const latitude = bus.start.latitude +
            (bus.end.latitude - bus.start.latitude) * bus.progress;
        const longitude = bus.start.longitude +
            (bus.end.longitude - bus.start.longitude) * bus.progress;
        const speed = Math.round(25 + Math.random() * 20);
        await prisma_1.prisma.gpsPing.create({
            data: {
                vehicleId: vehicle.id,
                latitude,
                longitude,
                speed,
                recordedAt: new Date(),
            },
        });
        console.log(`${new Date().toLocaleTimeString()} | ${bus.registrationNo} | ` +
            `lat=${latitude.toFixed(5)}, lon=${longitude.toFixed(5)} | ${speed} km/h`);
    }
}
async function main() {
    console.log("NCRTC demo GPS simulator started.");
    console.log("Saving simulated GPS pings every 5 seconds.");
    console.log("Press Ctrl+C to stop.");
    await saveGpsPings();
    setInterval(() => {
        saveGpsPings().catch((error) => {
            console.error("Failed to save GPS pings:", error);
        });
    }, INTERVAL_MS);
}
main().catch((error) => {
    console.error("GPS simulator failed:", error);
    process.exitCode = 1;
});
