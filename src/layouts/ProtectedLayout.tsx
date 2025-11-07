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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 사이드바 */}
      <Sidebar
        userEmail="test@example.com" // TODO: 실제 유저 이메일
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
          pt-14 md:pt-0      /* 모바일: 헤더만큼 아래로 */
          md:ml-64           /* 데스크탑: 사이드바 폭만큼 오른쪽으로 */
        "
      >
        {children}
      </main>
    </div>
  );
}
