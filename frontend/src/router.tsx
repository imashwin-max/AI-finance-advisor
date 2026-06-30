import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { type ReactNode } from "react";
import { Dashboard } from "@/pages/Dashboard";
import { Transactions } from "@/pages/Transactions";
import { Analytics } from "@/pages/Analytics";
import { Budgets } from "@/pages/Budgets";
import { HealthScorePage } from "@/pages/HealthScore";
import { Chat } from "@/pages/Chat";
import { Profile } from "@/pages/Profile";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { NotFound } from "@/pages/NotFound";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: "/transactions", element: <ProtectedRoute><Transactions /></ProtectedRoute> },
  { path: "/analytics", element: <ProtectedRoute><Analytics /></ProtectedRoute> },
  { path: "/budgets", element: <ProtectedRoute><Budgets /></ProtectedRoute> },
  { path: "/health-score", element: <ProtectedRoute><HealthScorePage /></ProtectedRoute> },
  { path: "/chat", element: <ProtectedRoute><Chat /></ProtectedRoute> },
  { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
  { path: "*", element: <NotFound /> },
]);
