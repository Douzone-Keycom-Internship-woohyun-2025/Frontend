import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/sidebar";
import { useAuthStore } from "../store/authStore";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail="test@example.com" onLogout={handleLogout} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
