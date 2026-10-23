# NCRTC Bus Management System — Architecture

## 1. Overview

The NCRTC Bus Management System is a web application for managing bus fleet information and daily transport operations. It uses a React frontend, an Express REST API, and a SQLite database accessed through Prisma ORM.

## 2. Architecture

```text
+------------------------------+
|          User Browser        |
|       React + TypeScript     |
|                              |
| Dashboard, Fleet, Routes,    |
| Duties, Incidents, Notices   |
+---------------+--------------+
                |
                | HTTP requests / JSON
                | JWT bearer token
                v
+------------------------------+
|       Express REST API       |
|       Node.js + TypeScript   |
|                              |
| Authentication, API routes,  |
| role-based authorization     |
+---------------+--------------+
                |
                | Prisma ORM
                v
+------------------------------+
|        SQLite Database       |
|                              |
| Users, depots, vehicles,     |
| routes, stops, duties, GPS,  |
| incidents and notices       |
+------------------------------+

External map tiles:
OpenStreetMap tiles are displayed through Leaflet in the browser.
```

## 3. Frontend

The frontend is built with React and TypeScript using Vite. It provides the user interface for:

- Dashboard and notices
- Fleet management and vehicle GPS map
- Route and stop information
- Duty scheduling
- Incident management

The frontend requests data from the backend API and displays the returned information.

## 4. Backend

The backend uses Node.js, Express and TypeScript. It exposes REST endpoints for authentication, dashboard information, vehicles, routes, stops, duties and incidents.

Authentication uses JSON Web Tokens (JWT). Protected endpoints use authentication middleware, and selected endpoints use role-based authorization.

## 5. Database

SQLite stores the application's demonstration data. Prisma ORM provides database access and schema management.

The data model includes users, depots, vehicles, stops, routes, route stops, duties, GPS records, incidents, incident events, notices and notice reads.

## 6. Authentication Flow

1. The user submits their email and password through the login interface.
2. The backend validates the credentials.
3. The backend returns a JWT and user information after successful authentication.
4. The frontend uses the token for protected API requests.
5. The backend verifies the token and applies role restrictions where configured.

## 7. GPS Map

The fleet map uses Leaflet and OpenStreetMap tiles. Vehicle markers are positioned using the latest GPS records returned by the backend. The frontend periodically requests updated fleet data while the Fleet Management page is active.

Actual movement requires new GPS records to be supplied by a device or simulator.

## 8. Security Considerations

- Demo credentials are intended for local assessment only.
- JWT secrets must be stored securely outside source code in production.
- Protected API endpoints must enforce authorization on the server.
- Depot-specific data access must be validated by the backend.
- Production deployment requires HTTPS, secure configuration, input validation, and additional security testing.

## 9. Current Scope

This version focuses on the core demonstration workflow: viewing fleet data, exploring routes and duties, updating incident status, viewing notices, and inspecting recorded GPS positions.
