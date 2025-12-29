import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18nConfig } from "./i18nConfig";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ตรวจสอบว่า path ปัจจุบันมี locale อยู่แล้วหรือไม่
  const pathnameIsMissingLocale = i18nConfig.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // ถ้าไม่มี ให้ Redirect ไปยัง default locale
  if (pathnameIsMissingLocale) {
    const locale = i18nConfig.defaultLocale;
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  // Matcher เพื่อยกเว้นไฟล์ static, api, images
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
