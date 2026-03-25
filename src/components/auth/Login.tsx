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

const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL as string | undefined;
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD as string | undefined;

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
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const doLogin = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    const { accessToken, refreshToken, user } = res.data;
    localStorage.setItem("refreshToken", refreshToken);
    authStore.login(accessToken, user.email);
    navigate("/");
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError("");
    try {
      await doLogin(data.email, data.password);
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

  const handleDemoLogin = async () => {
    if (!DEMO_EMAIL || !DEMO_PASSWORD) return;
    setIsDemoLoading(true);
    setServerError("");
    try {
      await doLogin(DEMO_EMAIL, DEMO_PASSWORD);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        setServerError(msg || "데모 계정 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setServerError("데모 계정 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* 좌측 — 브랜드 히어로 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-300 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight">
            기업 특허 동향을
            <br />
            한눈에 파악하세요
          </h1>
          <p className="text-brand-100 text-lg mb-10 leading-relaxed">
            KIPRIS 공공데이터 기반 실시간 특허 검색·분석 플랫폼
          </p>

          <div className="space-y-4">
            {[
              { icon: "ri-search-line", text: "기업별 특허 검색 및 상세 조회" },
              { icon: "ri-pie-chart-line", text: "IPC 분류·출원 추이 시각화 분석" },
              { icon: "ri-bookmark-line", text: "관심 특허 저장 및 검색 프리셋 관리" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <i className={`${item.icon} text-white`} />
                </div>
                <span className="text-brand-50 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 우측 — 로그인 폼 */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              <span className="text-brand-800">T</span>ech<span className="text-brand-800">L</span>ens
            </h1>
            <p className="text-sm text-gray-500">특허 인텔리전스 플랫폼</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">로그인</h2>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  이메일
                </label>
                <Input
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="name@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  비밀번호
                </label>
                <Input
                  type="password"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                  placeholder="비밀번호를 입력하세요"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <i className="ri-error-warning-line text-red-500" />
                  <span className="text-sm text-red-700">{serverError}</span>
                </div>
              )}

              <Button type="submit" disabled={isLoading || isDemoLoading} className="w-full h-11">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin" />
                    로그인 중...
                  </span>
                ) : (
                  "로그인"
                )}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            계정이 없으신가요?{" "}
            <Link
              to="/signup"
              className="font-medium text-brand-700 hover:text-brand-600"
            >
              회원가입
            </Link>
          </p>

          {DEMO_EMAIL && DEMO_PASSWORD && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-100" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-50 px-3 text-xs text-brand-600 font-medium">
                    포트폴리오 방문자
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isDemoLoading || isLoading}
                className="mt-4 w-full h-10 rounded-xl border border-brand-300 bg-brand-50 text-sm text-brand-800 font-medium hover:bg-brand-700 hover:text-white hover:border-brand-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDemoLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  <>
                    <i className="ri-play-circle-line text-base" />
                    데모 계정으로 체험하기
                  </>
                )}
              </button>
              <p className="mt-2 text-center text-xs text-gray-400">
                회원가입 없이 모든 기능 체험 가능
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
