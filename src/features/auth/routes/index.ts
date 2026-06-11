import type { RouteObject } from "react-router-dom";

export const authRoutes: RouteObject[] = [
  { path: "login", lazy: () => import("./login/route") },
  { path: "forgot-password", lazy: () => import("./forgot-password/route") },
];
