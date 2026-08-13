import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "@/lib/hooks";

interface PrivateRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<PrivateRouteProps> = ({
  allowedRoles = ["admin", "staff"],
}) => {
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("🔒 User is not authenticated");
    }
  }, [isLoading, isAuthenticated]);
 
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("🔒 Not authenticated, redirecting to login...");

    return <Navigate to="/login" replace />;
  }

  // Role check
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
