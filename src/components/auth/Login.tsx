import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../api/auth";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const authStore = useAuthStore();

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
      const res = await loginApi(formData.email, formData.password);
      const { accessToken, refreshToken, user } = res.data;

      localStorage.setItem("refreshToken", refreshToken);
      authStore.login(accessToken, user.email);

      // 홈으로 이동
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "로그인에 실패했습니다.");
      } else {
        setError("알 수 없는 에러가 발생했습니다.");
      }
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <i className="ri-error-warning-line text-red-500 mr-2"></i>
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 rounded-lg shadow-sm 
            text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
            disabled:opacity-50 transition-colors duration-200"
          >
            {isLoading ? (
              <div className="flex items-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                로그인 중...
              </div>
            ) : (
              "로그인"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
