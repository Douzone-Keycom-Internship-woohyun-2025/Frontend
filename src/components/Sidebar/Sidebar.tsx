import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoutConfirmModal from "../common/LogoutConfirmModal";
import { toast } from "../../hooks/use-toast";

interface SidebarProps {
  userEmail: string;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  userEmail,
  onLogout,
  isOpen,
  onClose,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    onLogout();
    setShowLogoutModal(false);

    toast({
      title: "로그아웃되었습니다.",
      description: "다음에 다시 만나요!",
    });

    navigate("/login");
  };

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: "/", icon: "ri-home-line", label: "홈", exact: true },
    { path: "/patent-search", icon: "ri-search-line", label: "특허검색" },
    { path: "/summary", icon: "ri-file-text-line", label: "요약분석" },
    { path: "/favorites", icon: "ri-heart-line", label: "관심특허" },
    {
      path: "/preset-management",
      icon: "ri-bookmark-line",
      label: "프리셋 관리",
    },
    { path: "/help", icon: "ri-question-line", label: "도움말" },
  ];

  const handleMenuClick = () => {
    if (window.innerWidth < 768) onClose();
  };

  const Content = (
    <>
      {/* 로고 */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          <Link
            to="/"
            onClick={handleMenuClick}
            className="text-xl font-bold text-gray-900 flex items-center cursor-pointer"
          >
            <span className="text-blue-600">T</span>ech
            <span className="text-blue-600">L</span>ens
          </Link>
        </h1>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={handleMenuClick}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-colors
                  ${
                    isActive(item.path, item.exact)
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <i className={`${item.icon} w-5 h-5 mr-3`} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 유저 + 로그아웃 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-blue-600" />
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userEmail}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
            title="로그아웃"
          >
            <i className="ri-logout-box-line w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/40 transition-opacity duration-200
          md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={onClose}
      />

      {/* 모바일 드로어 */}
      <div
        className={`
          fixed left-0 top-0 z-50 w-64 h-screen bg-white shadow-lg flex flex-col
          transform transition-transform duration-200 md:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {Content}
      </div>

      {/* 데스크탑 */}
      <div className="hidden md:flex fixed left-0 top-0 z-40 w-64 h-screen bg-white shadow-lg flex-col">
        {Content}
      </div>

      {/* 로그아웃 모달 */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}
