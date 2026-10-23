/// <reference types="node" />
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding NCRTC demo data...");

  // Clear existing demo records in dependency-safe order.
  await prisma.noticeRead.deleteMany();
  await prisma.incidentEvent.deleteMany();
  await prisma.gpsPing.deleteMany();
  await prisma.duty.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.route.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.depot.deleteMany();

  // Depots
  const delhiDepot = await prisma.depot.create({
    data: { name: "Sarai Kale Khan Depot", location: "Delhi" },
  });

  const ghaziabadDepot = await prisma.depot.create({
    data: { name: "Ghaziabad Depot", location: "Ghaziabad" },
  });

  // Demo users
  const passwordHash = await hash("Demo@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "System Administrator",
      email: "admin@ncrtc.demo",
      passwordHash,
      role: "admin",
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Delhi Depot Manager",
      email: "manager@ncrtc.demo",
      passwordHash,
      role: "depot_manager",
      depotId: delhiDepot.id,
    },
  });

  const driver = await prisma.user.create({
    data: {
      name: "Raj Kumar",
      email: "driver@ncrtc.demo",
      passwordHash,
      role: "driver",
      depotId: delhiDepot.id,
    },
  });

  const operator = await prisma.user.create({
    data: {
      name: "Control Room Operator",
      email: "operator@ncrtc.demo",
      passwordHash,
      role: "control_operator",
    },
  });

  await prisma.user.create({
    data: {
      name: "Demo Conductor",
      email: "conductor@ncrtc.demo",
      passwordHash,
      role: "conductor",
      depotId: delhiDepot.id,
    },
  });

  // Vehicles
  const bus1 = await prisma.vehicle.create({
    data: {
      registrationNo: "DL01AB1234",
      status: "active",
      depotId: delhiDepot.id,
    },
  });

  const bus2 = await prisma.vehicle.create({
    data: {
      registrationNo: "UP14CD5678",
      status: "active",
      depotId: ghaziabadDepot.id,
    },
  });

  // Stops
  const stop1 = await prisma.stop.create({
    data: {
      name: "Sarai Kale Khan",
      latitude: 28.5889,
      longitude: 77.2572,
    },
  });

  const stop2 = await prisma.stop.create({
    data: {
      name: "Anand Vihar",
      latitude: 28.6469,
      longitude: 77.316,
    },
  });

  const stop3 = await prisma.stop.create({
    data: {
      name: "Ghaziabad",
      latitude: 28.6692,
      longitude: 77.4538,
    },
  });

  // Routes
  const route1 = await prisma.route.create({
    data: {
      name: "Delhi–Anand Vihar",
      code: "NCR-101",
      routeStops: {
        create: [
          { stopId: stop1.id, sequence: 1, plannedArrival: "08:00" },
          { stopId: stop2.id, sequence: 2, plannedArrival: "08:30" },
        ],
      },
    },
  });

  const route2 = await prisma.route.create({
    data: {
      name: "Anand Vihar–Ghaziabad",
      code: "NCR-202",
      routeStops: {
        create: [
          { stopId: stop2.id, sequence: 1, plannedArrival: "09:00" },
          { stopId: stop3.id, sequence: 2, plannedArrival: "09:40" },
        ],
      },
    },
  });

  // Today's duty
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.duty.create({
    data: {
      dutyDate: today,
      driverId: driver.id,
      vehicleId: bus1.id,
      routeId: route1.id,
      depotId: delhiDepot.id,
      status: "scheduled",
    },
  });

  // Simulated GPS locations for the demo map
  await prisma.gpsPing.createMany({
    data: [
      {
        vehicleId: bus1.id,
        latitude: 28.5889,
        longitude: 77.2572,
        speed: 32,
      },
      {
        vehicleId: bus1.id,
        latitude: 28.61,
        longitude: 77.275,
        speed: 38,
      },
      {
        vehicleId: bus2.id,
        latitude: 28.6692,
        longitude: 77.4538,
        speed: 25,
      },
    ],
  });

  // Example incident
  await prisma.incident.create({
    data: {
      type: "breakdown",
      severity: "P1",
      description: "Demo bus reporting an engine issue",
      status: "Open",
      vehicleId: bus1.id,
      reporterId: driver.id,
      assignedToId: operator.id,
      depotId: delhiDepot.id,
      events: {
        create: {
          userId: operator.id,
          note: "Incident created for demonstration",
          status: "Open",
        },
      },
    },
  });

  // Published notice
  await prisma.notice.create({
    data: {
      title: "Welcome to the NCRTC Driver Portal",
      body: "Please review your assigned duty before starting your shift.",
      targetAudience: "all_drivers",
      publishedAt: new Date(),
      createdById: admin.id,
    },
  });

  console.log("Demo data created successfully.");
  console.log("Login accounts (password for all: Demo@123)");
  console.log("Admin: admin@ncrtc.demo");
  console.log("Manager: manager@ncrtc.demo");
  console.log("Driver: driver@ncrtc.demo");
  console.log("Operator: operator@ncrtc.demo");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
