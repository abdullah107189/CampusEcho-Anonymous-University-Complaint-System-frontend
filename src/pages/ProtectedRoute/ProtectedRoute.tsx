import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/store/store";

interface ProtectedRouteProps {
  allowedRoles?: ("admin" | "staff")[];
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Logged in but role is not allowed
  if (
    allowedRoles &&
    (!user || !allowedRoles.includes(user.role))
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}