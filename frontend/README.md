# NCRTC Bus Management System

A web-based bus fleet and operations management system built as a college assessment project. It provides a centralized interface for monitoring vehicles, managing routes and duties, tracking incidents, and displaying operational notices.

## Features

- **Dashboard:** View an overview of system activity and recent notices.
- **Fleet Management:** View registered vehicles, depot assignments, vehicle status, and latest recorded GPS information.
- **Fleet Map:** Display available vehicle GPS positions on an interactive map using Leaflet and OpenStreetMap.
- **Routes and Stops:** View configured routes and their associated stops.
- **Duty Scheduling:** View existing vehicle and driver duty assignments.
- **Incident Management:** View incidents and update their status.
- **Notices:** Display operational notices.
- **Authentication:** Log in using seeded demonstration accounts with different roles.

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Leaflet and React Leaflet

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- JWT-based authentication

## Project Structure

```text
ncrtc-bus-management-system/
├── frontend/
│   └── src/
├── backend/
│   ├── prisma/
│   └── src/
└── README.md
```

## Prerequisites

- Node.js and npm
- A modern web browser
- Terminal or VS Code

## Setup

### 1. Backend

Open a terminal and run:

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run build
```

Run the backend using the development command configured in `backend/package.json`:

```bash
npm run dev
```

The backend API is expected at:

`http://localhost:5001`

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run build
npm run dev
```

Open the local URL printed by Vite, usually:

`http://localhost:5173`

## Demo Accounts

All seeded demo accounts use the password:

`Demo@123`

| Role                  | Email                |
| --------------------- | -------------------- |
| Administrator         | admin@ncrtc.demo     |
| Depot Manager         | manager@ncrtc.demo   |
| Control Room Operator | operator@ncrtc.demo  |
| Driver                | driver@ncrtc.demo    |
| Conductor             | conductor@ncrtc.demo |

These are demonstration credentials for local assessment use only. Do not use them in production.

## Suggested Demonstration

1. Log in as the administrator.
2. Explore the dashboard and recent notices.
3. Open Fleet Management and inspect vehicle information and the map.
4. Explore Routes and Stops.
5. Open Duty Scheduling and review duty assignments.
6. Open Incidents and demonstrate a status update.
7. Log out and test another demo account.

## Notes and Limitations

- The database contains seeded demonstration data.
- The fleet map displays recorded GPS positions; live movement depends on new GPS records being supplied.
- This project is configured for local development and assessment. Production deployment would require additional security hardening and configuration.

## Build Verification

The frontend and backend TypeScript builds have been run successfully during development.

## License

Developed for educational and assessment purposes.

```

```
