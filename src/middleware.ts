// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const session = request.cookies.get("session_user");

//   // PROTECT DASHBOARD
//   if (request.nextUrl.pathname.startsWith("/dashboard") && !session) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// // export { default } from "next-auth/middleware";

// // export const config = {
// //   matcher: ["/dashboard/:path*"],
// // };

import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}
