import type { RouteObject } from "react-router-dom";
import { dashboardRoutes } from "@/features/dashboard/routes";
import { ticketRoutes } from "@/features/tickets/routes";
import { userRoutes } from "@/features/users/routes";

export const privateRoutes: RouteObject[] = [
  ...dashboardRoutes,
  ...ticketRoutes,
  ...userRoutes,
];
