import type { LoaderFunctionArgs } from "react-router-dom";
import { queryClient } from "@/app/query-client";
import { ticketQuery } from "@/features/tickets/api/ticket-queries";

export async function loader({ params }: LoaderFunctionArgs) {
  await queryClient.ensureQueryData(ticketQuery(params.id!));
  return null;
}

export { TicketDetailsPage as Component } from "./page";
export { RouteErrorBoundary as ErrorBoundary } from "@/app/components/route-error-boundary";
