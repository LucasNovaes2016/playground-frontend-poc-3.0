import type { LoaderFunctionArgs } from "react-router-dom";
import { queryClient } from "@/app/query-client";
import { userQuery } from "@/features/users/api/user-queries";

export async function loader({ params }: LoaderFunctionArgs) {
  await queryClient.ensureQueryData(userQuery(params.id!));
  return null;
}

export { UserEditPage as Component } from "./page";
export { RouteErrorBoundary as ErrorBoundary } from "@/app/components/route-error-boundary";
