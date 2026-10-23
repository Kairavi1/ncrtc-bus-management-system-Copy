"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }
    const token = authHeader.slice(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({
            message: "Authentication is not configured",
        });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        if (typeof payload === "string" ||
            typeof payload.userId !== "string" ||
            typeof payload.role !== "string") {
            return res.status(401).json({
                message: "Invalid token",
            });
        }
        req.user = {
            userId: payload.userId,
            role: payload.role,
            depotId: typeof payload.depotId === "string" ? payload.depotId : null,
        };
        next();
    }
    catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You do not have permission to access this resource",
            });
        }
        next();
    };
}
