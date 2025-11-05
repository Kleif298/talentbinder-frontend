// utils/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { getUserData } from "../utils/auth.ts";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = getUserData();
  console.log('🔒 ProtectedRoute - User data:', user); // ✅ Debug
  
  if (!user) {
    console.log('❌ No user data - redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('✅ User authenticated - rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
