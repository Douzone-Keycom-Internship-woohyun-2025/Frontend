import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  userEmail: string;
  onLogout: () => void;
}

export default function Sidebar({ userEmail, onLogout }: SidebarProps) {
  const location = useLocation();
  const menuItems = [
    {
      path: "/",
      icon: "ri-home-line",
      label: "홈",
      exact: true,
    },
    {
      path: "/patent-search",
      icon: "ri-search-line",
      label: "특허검색",
    },
    {
      path: "/summary",
      icon: "ri-file-text-line",
      label: "요약분석",
    },
    {
      path: "/favorites",
      icon: "ri-heart-line",
      label: "관심특허",
    },
    {
      path: "/preset-management",
      icon: "ri-bookmark-line",
      label: "프리셋 관리",
    },
    {
      path: "/help",
      icon: "ri-question-line",
      label: "도움말",
    },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          <Link
            to="/"
            className="text-xl font-bold text-gray-900 flex items-center cursor-pointer"
          >
            <span className="text-blue-600">T</span>ech
            <span className="text-blue-600">L</span>ens
          </Link>
        </h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                  isActive(item.path, item.exact)
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <i
                  className={`${item.icon} w-5 h-5 flex items-center justify-center mr-3`}
                ></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-blue-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userEmail}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
            title="로그아웃"
          >
            <i className="ri-logout-box-line w-4 h-4 flex items-center justify-center"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
