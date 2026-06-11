import type { RouteObject } from "react-router-dom";
import { authRoutes } from "@/features/auth/routes";

export const publicRoutes: RouteObject[] = [...authRoutes];
