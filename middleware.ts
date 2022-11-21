// import { withMiddlewareAuth } from "@supabase/auth-helpers-nextjs";

// export const middleware = withMiddlewareAuth({
// 	redirectTo: "/login",
// });

// export const config = {
// 	matcher: "/((?!api|_next/static|favicon.ico|login|svg|brand-logos).*)",
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	return NextResponse.redirect(new URL("/about-2", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: "/about/:path*",
};
