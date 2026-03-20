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

  const onSubmit = async (data: SignupFormData) => {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-blue-600">T</span>ech
            <span className="text-blue-600">L</span>ens
          </h1>
        </div>

        <div className="mx-auto h-12 w-12 flex items-center justify-center bg-blue-100 rounded-full">
          <i className="ri-user-add-line text-2xl text-blue-600"></i>
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          회원가입
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            로그인
          </Link>
        </p>

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
                placeholder="비밀번호를 입력하세요 (최소 8자)"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 재확인
              </label>
              <Input
                type="password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
                가입 중...
              </div>
            ) : (
              "회원가입"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
