import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
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
    <div className="h-screen bg-gray-50">
      <Sidebar userEmail="test@example.com" onLogout={handleLogout} />
      <main className="ml-64 overflow-auto h-full">{children}</main>
    </div>
  );
}
