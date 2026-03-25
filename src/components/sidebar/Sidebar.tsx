import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import LogoutConfirmModal from "@/components/common/LogoutConfirmModal";
import { toast } from "@/hooks/use-toast";

interface SidebarProps {
  userEmail: string;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const mainMenu = [
  { path: "/", icon: "ri-home-line", activeIcon: "ri-home-fill", label: "홈", exact: true },
  { path: "/patent-search", icon: "ri-search-line", activeIcon: "ri-search-line", label: "특허검색" },
  { path: "/summary", icon: "ri-pie-chart-line", activeIcon: "ri-pie-chart-fill", label: "요약분석" },
  { path: "/comparison", icon: "ri-scales-line", activeIcon: "ri-scales-fill", label: "경쟁사 비교" },
  { path: "/favorites", icon: "ri-heart-line", activeIcon: "ri-heart-fill", label: "관심특허" },
  { path: "/preset-management", icon: "ri-bookmark-line", activeIcon: "ri-bookmark-fill", label: "프리셋 관리" },
];

const bottomMenu = [
  { path: "/help", icon: "ri-question-line", activeIcon: "ri-question-fill", label: "도움말" },
];

export default function Sidebar({
  userEmail,
  onLogout,
  isOpen,
  onClose,
}: SidebarProps) {
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    toast({ title: "로그아웃되었습니다.", description: "다음에 다시 만나요!" });
    onLogout();
  };

  const isActive = (path: string, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleMenuClick = () => {
    if (window.innerWidth < 768) onClose();
  };

  const emailInitial = userEmail?.charAt(0).toUpperCase() || "U";

  const NavItem = ({ item }: { item: typeof mainMenu[0] }) => {
    const active = isActive(item.path, item.exact);
    return (
      <li>
        <Link
          to={item.path}
          onClick={handleMenuClick}
          className={`
            group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
            transition-all duration-150
            ${active
              ? "bg-brand-50 text-brand-800 font-semibold"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }
          `}
        >
          <i className={`${active ? item.activeIcon : item.icon} text-base ${active ? "text-brand-700" : "text-gray-400 group-hover:text-gray-600"}`} />
          {item.label}
        </Link>
      </li>
    );
  };

  const Content = (
    <div className="flex flex-col h-full">
      {/* 로고 */}
      <div className="px-5 pt-6 pb-5">
        <Link
          to="/home"
          onClick={handleMenuClick}
          className="flex items-center gap-2"
        >
          <img src="/favicon.svg" alt="TechLens" className="w-8 h-8" />
          <div>
            <span className="text-[15px] font-bold text-gray-900 tracking-tight">
              TechLens
            </span>
            <span className="block text-[10px] text-gray-400 -mt-0.5 tracking-wide">
              Patent Intelligence
            </span>
          </div>
        </Link>
      </div>

      {/* 구분선 */}
      <div className="mx-4 border-t border-gray-100" />

      {/* 메인 메뉴 */}
      <nav className="flex-1 px-3 pt-4 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          Menu
        </p>
        <ul className="space-y-1">
          {mainMenu.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </ul>
      </nav>

      {/* 하단 메뉴 */}
      <div className="px-3 pb-2">
        <ul className="space-y-1">
          {bottomMenu.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </ul>
      </div>

      {/* 구분선 */}
      <div className="mx-4 border-t border-gray-100" />

      {/* 유저 영역 */}
      <div className="px-3 py-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-brand-50 border border-brand-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-brand-800">{emailInitial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-gray-900 truncate">
              {userEmail}
            </p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="로그아웃"
          >
            <i className="ri-logout-box-r-line text-base" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-200
          md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={onClose}
      />

      {/* 모바일 드로어 */}
      <div
        className={`
          fixed left-0 top-0 z-50 w-60 h-screen bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-200 ease-out md:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {Content}
      </div>

      {/* 데스크탑 */}
      <div className="hidden md:flex fixed left-0 top-0 z-40 w-60 h-screen bg-white border-r border-gray-200 flex-col">
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
