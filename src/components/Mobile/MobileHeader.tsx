import { Link } from "react-router-dom";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between h-14 px-4 bg-white border-b md:hidden">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-gray-100"
      >
        <i className="ri-menu-line text-2xl text-gray-700" />
      </button>

      <Link
        to="/"
        className="flex items-center text-lg font-semibold text-gray-900"
      >
        <span className="text-blue-600">T</span>ech
        <span className="text-blue-600">L</span>ens
      </Link>
      <div className="w-8" />
    </header>
  );
}
