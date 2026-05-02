import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // 🔓 Rutas públicas
  if (
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/_next") ||
    path.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 🔒 Sin token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role;

    if (role === "ADMIN" && !path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (role === "COLABORADOR" && !path.startsWith("/colab")) {
      return NextResponse.redirect(new URL("/colab", request.url));
    }

    if (role === "USER" && !path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch (e) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// 👇 AQUÍ VA (FUERA de la función)
export const config = {
  matcher: ["/admin/:path*", "/colab/:path*", "/dashboard/:path*"],
};
