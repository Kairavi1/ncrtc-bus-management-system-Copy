export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  depotId?: string | null;
  depot?: {
    id: string;
    name: string;
  } | null;
};

export type DashboardData = {
  summary: {
    totalVehicles: number;
    totalRoutes: number;
    activeDuties: number;
    openIncidents: number;
  };
  recentIncidents: {
    id: string;
    type: string;
    description: string;
    status: string;
    severity: string;
  }[];
  recentNotices: {
    id: string;
    title: string;
    body: string;
  }[];
};

export type Incident = {
  id: string;
  type: string;
  description: string;
  severity: string;
  status: string;
  vehicle?: {
    registrationNo: string;
  } | null;
  reporter?: {
    name: string;
  } | null;
  assignedTo?: {
    name: string;
  } | null;
  depot?: {
    name: string;
  } | null;
  events: {
    id: string;
    status: string;
    note: string;
    createdAt: string;
    user: {
      name: string;
    };
  }[];
};

export type Vehicle = {
  id: string;
  registrationNo: string;
  status: string;
  depot: {
    name: string;
    location: string;
  };
  gpsPings: {
    latitude: number;
    longitude: number;
    speed: number;
    recordedAt: string;
  }[];
  duties: {
    id: string;
    status: string;
    driver: {
      name: string;
    };
    route: {
      code: string;
      name: string;
    };
  }[];
};

export type TransitRoute = {
  id: string;
  routeNumber: string;
  name: string;
  status: string;
  routeStops: {
    id: string;
    sequence: number;
    stop: {
      id: string;
      name: string;
      location: string;
    };
  }[];
};
