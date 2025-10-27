// utils/AdminProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { getAdminStatus } from "../utils/auth.ts";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  console.log("Admin Status:", getAdminStatus()); // Debugging line
  if (!getAdminStatus()) {
    return <Navigate to="/events" replace />;
  }
  return children;
};

export default AdminProtectedRoute;
