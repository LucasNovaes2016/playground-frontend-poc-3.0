import type { RouteObject } from "react-router-dom";

export const userRoutes: RouteObject[] = [
  { path: "users", lazy: () => import("./users-list/route") },
  { path: "users/create", lazy: () => import("./user-create/route") },
  { path: "users/:id", lazy: () => import("./user-details/route") },
  { path: "users/:id/edit", lazy: () => import("./user-edit/route") },
];
