"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import login from "@/api/loginApi";
import { validateEmail, validatePassword } from "@/heppler/validation";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { LoginRequest } from "@/api/Type";
import { useSearchParams, useRouter } from "next/navigation";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const searchParams = useSearchParams();
  const callBackUrl = searchParams.get("call_back_url");
  const router = useRouter();

  const validateForm = (): boolean => {
    if (!validateEmail(email)) {
      toast.error("Email chưa hợp lệ!");
      return false;
    }
    if (!validatePassword(password)) {
      toast.error("Mật khẩu chưa hợp lệ!");
      return false;
    }
    return true;
  };

  const handleSuccessLogin = () => {
    const redirectTo = callBackUrl || "/";
    router.push(redirectTo);
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    const request: LoginRequest = { email, password };
    try {
      const res = await login(request);
      console.log(res);
      handleSuccessLogin();
    } catch (err: any) {
      const status = err?.data?.status || 5000;
      if (status === 4004) {
        toast.error("Tài khoản không đúng!");
      } else {
        toast.error(err?.message || "Lỗi chưa xác định");
      }
    }
  };

  return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full">
        <div className="w-full max-w-md sm:pt-10 mx-auto">
          <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Quay lại trang chủ
          </Link>
        </div>

        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Đăng nhập
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Đăng nhập bằng email và mật khẩu!
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                    placeholder="info@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>
                  Mật khẩu <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                  {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={rememberMe} onChange={setRememberMe} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  Ghi nhớ đăng nhập
                </span>
                </div>
                <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Quên mật khẩu
                </Link>
              </div>

              <div>
                <Button className="w-full" size="sm" onClick={handleLogin}>
                  Đăng nhập
                </Button>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Bạn chưa có tài khoản?{" "}
                <Link
                    href="/signup"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
