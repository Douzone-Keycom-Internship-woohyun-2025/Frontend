import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("로그인 시도:", formData);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", formData.email);
      navigate("/");
    } catch {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-blue-600">T</span>
              ech
              <span className="text-blue-600">L</span>
              ens
            </h1>
          </div>

          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-blue-100 rounded-full">
            <i className="ri-user-line text-2xl text-blue-600"></i>
          </div>

          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            로그인
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            계정이 없으신가요?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
            >
              회원가입
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center text-red-500 mr-2"></i>
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer whitespace-nowrap"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <i className="ri-loader-4-line w-4 h-4 flex items-center justify-center animate-spin mr-2"></i>
                  로그인 중...
                </div>
              ) : (
                "로그인"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
