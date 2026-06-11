import type { RouteObject } from "react-router-dom";

export const dashboardRoutes: RouteObject[] = [
  { path: "dashboard", lazy: () => import("./dashboard/route") },
];
