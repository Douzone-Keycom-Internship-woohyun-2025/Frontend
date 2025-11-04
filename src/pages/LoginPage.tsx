import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 로고 */}
        <div>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-blue-600">T</span>ech
              <span className="text-blue-600">L</span>ens
            </h1>
          </div>

          {/* 아이콘 */}
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-blue-100 rounded-full">
            <i className="ri-user-line text-2xl text-blue-600"></i>
          </div>

          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            로그인
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            테스트 계정으로 로그인합니다
          </p>
        </div>

        {/* 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">이메일:</span> test@douzone.com
            </p>
            <p className="text-xs text-gray-500">프로토타입 버전 (테스트용)</p>
          </div>

          {/* 버튼 */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer whitespace-nowrap"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
