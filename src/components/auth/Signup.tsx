import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/validators/authSchemas";
import { signupApi } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TermsModal from "@/components/auth/TermsModal";

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [openModal, setOpenModal] = useState<"terms" | "privacy" | null>(null);

  const onSubmit = async (data: SignupFormData) => {
    if (!agreeTerms || !agreePrivacy) return;
    setIsLoading(true);
    setServerError("");

    try {
      await signupApi(data.email, data.password);

      toast({ title: "회원가입 완료", description: "로그인해주세요." });
      navigate("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "회원가입에 실패했습니다.");
      } else {
        setServerError("알 수 없는 에러가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
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
            특허 데이터를
            <br />
            전략으로 바꾸세요
          </h1>
          <p className="text-brand-100 text-lg mb-10 leading-relaxed">
            가입 후 바로 기업 특허를 검색하고 분석 대시보드를 확인하세요
          </p>

          <div className="space-y-4">
            {[
              { icon: "ri-time-line", text: "1분 만에 가입 완료" },
              { icon: "ri-shield-check-line", text: "안전한 데이터 관리" },
              { icon: "ri-bar-chart-box-line", text: "무료 특허 분석 리포트" },
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

      {/* 우측 — 회원가입 폼 */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              <span className="text-brand-800">T</span>ech<span className="text-brand-800">L</span>ens
            </h1>
            <p className="text-sm text-gray-500">특허 인텔리전스 플랫폼</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">회원가입</h2>

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
                  placeholder="최소 8자 이상"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  비밀번호 확인
                </label>
                <Input
                  type="password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  placeholder="비밀번호를 다시 입력하세요"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-800 focus:ring-brand-700"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                    <button
                      type="button"
                      onClick={() => setOpenModal("terms")}
                      className="text-brand-700 hover:text-brand-600 underline underline-offset-2"
                    >
                      서비스 이용약관
                    </button>
                    에 동의합니다 <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreePrivacy"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-800 focus:ring-brand-700"
                  />
                  <label htmlFor="agreePrivacy" className="text-sm text-gray-600">
                    <button
                      type="button"
                      onClick={() => setOpenModal("privacy")}
                      className="text-brand-700 hover:text-brand-600 underline underline-offset-2"
                    >
                      개인정보 처리방침
                    </button>
                    에 동의합니다 <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <i className="ri-error-warning-line text-red-500" />
                  <span className="text-sm text-red-700">{serverError}</span>
                </div>
              )}

              <Button type="submit" disabled={isLoading || !agreeTerms || !agreePrivacy} className="w-full h-11">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin" />
                    가입 중...
                  </span>
                ) : (
                  "회원가입"
                )}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/login"
              className="font-medium text-brand-700 hover:text-brand-600"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>

      {openModal && (
        <TermsModal type={openModal} onClose={() => setOpenModal(null)} />
      )}
    </div>
  );
}
