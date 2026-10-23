import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prisma.js";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { requireAuth, requireRole } from "./auth.js";
import type { AuthRequest } from "./auth.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "NCRTC Bus Management System API",
    status: "running",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/me", requireAuth, (req, res) => {
  const user = (req as import("./auth.js").AuthRequest).user;

  return res.json({
    message: "Authenticated successfully",
    user,
  });
});

app.get("/api/admin-test", requireAuth, requireRole("admin"), (_req, res) => {
  return res.json({
    message: "Admin access granted",
  });
});

app.get("/api/dashboard", requireAuth, async (_req, res) => {
  try {
    const [
      totalVehicles,
      totalRoutes,
      activeDuties,
      openIncidents,
      recentIncidents,
      recentNotices,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.route.count(),
      prisma.duty.count({
        where: { status: "active" },
      }),
      prisma.incident.count({
        where: {
          status: { not: "resolved" },
        },
      }),
      prisma.incident.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.notice.findMany({
        take: 5,
      }),
    ]);

    return res.json({
      summary: {
        totalVehicles,
        totalRoutes,
        activeDuties,
        openIncidents,
      },
      recentIncidents,
      recentNotices,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      message: "Could not load dashboard data",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || !(await compare(password, user.passwordHash))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        message: "Server authentication is not configured",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        depotId: user.depotId,
      },
      jwtSecret,
      { expiresIn: "8h" },
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        depotId: user.depotId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
});

app.listen(PORT, () => {
  console.log(`NCRTC API running at http://localhost:${PORT}`);
  prisma
    .$connect()
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.error("Database connection failed:", error));
});

app.get("/api/vehicles/:vehicleId/history", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthRequest).user;
    const rawVehicleId = req.params.vehicleId;
    const vehicleId = typeof rawVehicleId === "string" ? rawVehicleId : "";

    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!vehicleId) {
      return res
        .status(400)
        .json({ message: "A valid vehicle ID is required" });
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        ...(user.role !== "admin" && user.depotId
          ? { depotId: user.depotId }
          : {}),
        ...(user.role !== "admin" && !user.depotId
          ? { id: "__no_access__" }
          : {}),
      },
      select: {
        id: true,
        registrationNo: true,
      },
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const pings = await prisma.gpsPing.findMany({
      where: { vehicleId: vehicle.id },
      orderBy: { recordedAt: "desc" },
      take: 500,
      select: {
        id: true,
        latitude: true,
        longitude: true,
        speed: true,
        recordedAt: true,
      },
    });

    return res.json({ vehicle, history: pings });
  } catch (error) {
    console.error("GPS history error:", error);
    return res.status(500).json({ message: "Could not load GPS history" });
  }
});

app.get("/api/vehicles", requireAuth, async (_req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        depot: true,
        gpsPings: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
        duties: {
          orderBy: { dutyDate: "desc" },
          take: 1,
          include: {
            driver: {
              select: { id: true, name: true },
            },
            route: {
              select: { id: true, name: true, code: true },
            },
          },
        },
      },
    });

    return res.json({ vehicles });
  } catch (error) {
    console.error("Vehicles error:", error);
    return res.status(500).json({
      message: "Could not load vehicles",
    });
  }
});

app.get("/api/routes", requireAuth, async (_req, res) => {
  try {
    const routes = await prisma.route.findMany({
      include: {
        routeStops: {
          orderBy: { sequence: "asc" },
          include: {
            stop: true,
          },
        },
        _count: {
          select: { duties: true },
        },
      },
    });

    return res.json({ routes });
  } catch (error) {
    console.error("Routes error:", error);
    return res.status(500).json({
      message: "Could not load routes",
    });
  }
});

app.get("/api/stops", requireAuth, async (_req, res) => {
  try {
    const stops = await prisma.stop.findMany({
      include: {
        routeStops: {
          include: {
            route: {
              select: { id: true, name: true, code: true },
            },
          },
        },
      },
    });

    return res.json({ stops });
  } catch (error) {
    console.error("Stops error:", error);
    return res.status(500).json({
      message: "Could not load stops",
    });
  }
});

app.get("/api/duties", requireAuth, async (req: AuthRequest, res) => {
  try {
    const duties = await prisma.duty.findMany({
      where:
        req.user?.role === "admin"
          ? undefined
          : req.user?.depotId
            ? { depotId: req.user.depotId }
            : { id: "__no_matching_duty__" },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            registrationNo: true,
            status: true,
          },
        },
        route: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        depot: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
      orderBy: {
        dutyDate: "desc",
      },
    });

    return res.json({ duties });
  } catch (error) {
    console.error("Duties error:", error);
    return res.status(500).json({
      message: "Could not load duties",
    });
  }
});

app.get("/api/incidents", requireAuth, async (req: AuthRequest, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      where:
        req.user?.role === "admin"
          ? undefined
          : req.user?.depotId
            ? { depotId: req.user.depotId }
            : { id: "__no_matching_incident__" },
      include: {
        vehicle: {
          select: { registrationNo: true },
        },
        reporter: {
          select: { name: true },
        },
        assignedTo: {
          select: { name: true },
        },
        depot: {
          select: { name: true },
        },
        events: {
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ incidents });
  } catch (error) {
    console.error("Incidents error:", error);
    return res.status(500).json({
      message: "Could not load incidents",
    });
  }
});

app.patch(
  "/api/incidents/:id/status",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      const rawId = req.params.id;
      const id = typeof rawId === "string" ? rawId : "";

      const { status, note } = req.body as {
        status?: string;
        note?: string;
      };

      if (!id) {
        return res.status(400).json({
          message: "A valid incident ID is required",
        });
      }

      const allowedStatuses = ["Open", "In Progress", "Resolved"];

      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Status must be Open, In Progress, or Resolved",
        });
      }

      const incident = await prisma.incident.findFirst({
        where:
          req.user?.role === "admin"
            ? { id }
            : req.user?.depotId
              ? { id, depotId: req.user.depotId }
              : { id: "__no_matching_incident__" },
      });

      if (!incident) {
        return res.status(404).json({
          message: "Incident not found",
        });
      }

      const updated = await prisma.$transaction(async (tx) => {
        const result = await tx.incident.update({
          where: { id },
          data: { status },
        });

        if (req.user?.userId) {
          await tx.incidentEvent.create({
            data: {
              incidentId: id,
              userId: req.user.userId,
              note: note?.trim() || `Status changed to ${status}`,
              status,
            },
          });
        }

        return result;
      });

      return res.json({
        message: "Incident status updated",
        incident: updated,
      });
    } catch (error) {
      console.error("Update incident error:", error);
      return res.status(500).json({
        message: "Could not update incident status",
      });
    }
  },
);
