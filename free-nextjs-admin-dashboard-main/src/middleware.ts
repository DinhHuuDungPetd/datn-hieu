import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/signin", "/signup", "/_next", "/api"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bỏ qua các public route
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublic) return NextResponse.next();

  // Lấy token từ cookie
  const token = request.cookies.get("token")?.value;
  console.log(token);

  // Nếu truy cập /admin/* mà không có token thì redirect
  if (pathname.startsWith("/manager") && !token) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("call_back_url", pathname); // để login xong quay lại
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/manager/:path*"], // Chỉ áp dụng cho route bắt đầu bằng /admin/
};
