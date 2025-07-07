import axios, { AxiosError, AxiosInstance as Instance, AxiosResponse } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_URL_ROOT ?? "http://localhost:8080";

const AxiosInstance: Instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // gửi cookie cùng request
  timeout: 10 * 60 * 1000, // 10 phút
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// === Helper: Xử lý lỗi chung ===
const handleError = (error: AxiosError): Promise<never> => {
  if (error.response) {
    const { status, data } = error.response;

    if (process.env.NODE_ENV === "development") {
      console.error("HTTP Error:", status, data);
    }

    switch (status) {
      case 401:
        clearAuthCookies();
        redirectTo("/login");
        break;

      case 403:
        redirectTo("/403");
        break;

      default:
        // Trả lại lỗi có định dạng rõ ràng
        return Promise.reject({
          status,
          message: (data as any)?.message || "Đã xảy ra lỗi",
          timestamp: new Date().toISOString(),
          data,
        });
    }
  } else if (error.request) {
    return Promise.reject({
      status: 0,
      message: "Không thể kết nối đến máy chủ. Kiểm tra mạng.",
    });
  }

  return Promise.reject({
    status: -1,
    message: error.message || "Lỗi không xác định.",
  });
};

// === Helper: Clear Cookie ===
const clearAuthCookies = () => {
  document.cookie = "access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// === Helper: Redirect ===
const redirectTo = (url: string) => {
  if (typeof window !== "undefined") {
    window.location.href = url;
  }
};

// === Interceptor response ===
AxiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    handleError
);

export default AxiosInstance;
