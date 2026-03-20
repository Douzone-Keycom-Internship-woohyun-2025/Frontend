import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/validators/authSchemas";
import { loginApi } from "@/api/auth";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError("");

    try {
      const res = await loginApi(data.email, data.password);
      const { accessToken, refreshToken, user } = res.data;

      localStorage.setItem("refreshToken", refreshToken);
      authStore.login(accessToken, user.email);

      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "로그인에 실패했습니다.");
      } else {
        setServerError("알 수 없는 에러가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <Input
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
                placeholder="이메일을 입력하세요"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <Input
                type="password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
                placeholder="비밀번호를 입력하세요"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <i className="ri-error-warning-line text-red-500 mr-2"></i>
                <span className="text-sm text-red-700">{serverError}</span>
              </div>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <div className="flex items-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                로그인 중...
              </div>
            ) : (
              "로그인"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
