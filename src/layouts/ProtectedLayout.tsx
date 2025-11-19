import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import MobileHeader from "../components/Mobile/MobileHeader";
import { useAuthStore } from "../store/authStore";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userEmail = localStorage.getItem("userEmail") ?? "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 사이드바 */}
      <Sidebar
        userEmail={userEmail}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 모바일 전용 헤더 */}
      <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

      {/* 메인 영역 */}
      <main
        className="
          h-screen overflow-auto
          pt-14 md:pt-0
          md:ml-64
        "
      >
        {children}
      </main>
    </div>
  );
}
