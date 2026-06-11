import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/app/layouts/root-layout";
import { PublicLayout } from "@/app/layouts/public-layout";
import { PrivateLayout } from "@/app/layouts/private-layout";
import { publicRoutes } from "@/app/routes/public.routes";
import { privateRoutes } from "@/app/routes/private.routes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      // "/" → manda para a área privada (que por sua vez redireciona ao
      // login caso o usuário não esteja autenticado).
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { Component: PublicLayout, children: publicRoutes },
      { Component: PrivateLayout, children: privateRoutes },
    ],
  },
]);
