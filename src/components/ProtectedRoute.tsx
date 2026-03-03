import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUser } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = getToken();
  const user = getUser();
  if (!token || !user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

