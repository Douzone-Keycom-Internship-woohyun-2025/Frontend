import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuthStore();
  const hasToken = !!localStorage.getItem("accessToken");

  if (!isLoggedIn || !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
