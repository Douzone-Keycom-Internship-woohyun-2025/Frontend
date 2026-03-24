import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import MobileHeader from "@/components/mobile/MobileHeader";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const navigate = useNavigate();
  const { logout, userEmail } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message } = (e as CustomEvent<{ message: string }>).detail;
      toast({
        title: "조회 한도 초과",
        description: message,
        variant: "destructive",
      });
    };
    window.addEventListener("api:rateLimit", handler);
    return () => window.removeEventListener("api:rateLimit", handler);
  }, [toast]);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // 서버 호출 실패해도 클라이언트 로그아웃은 진행
    }
    queryClient.clear();
    logout();
    navigate("/login");
  };

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
          md:ml-60
        "
      >
        {children}
      </main>
    </div>
  );
}
