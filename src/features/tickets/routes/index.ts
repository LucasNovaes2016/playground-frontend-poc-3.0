import type { RouteObject } from "react-router-dom";

export const ticketRoutes: RouteObject[] = [
  { path: "tickets", lazy: () => import("./tickets-list/route") },
  { path: "tickets/create", lazy: () => import("./ticket-create/route") },
  { path: "tickets/:id", lazy: () => import("./ticket-details/route") },
  { path: "tickets/:id/edit", lazy: () => import("./ticket-edit/route") },
];
