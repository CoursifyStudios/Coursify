import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const supabase = createMiddlewareSupabaseClient({ req, res });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (session) {
		return res;
	}

	const redirectUrl = req.nextUrl.clone();
	redirectUrl.pathname = "/login";
	redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
	return NextResponse.redirect(redirectUrl);
}

export const config = {
	matcher: "/((?!api|_next/static|favicon.ico|login|svg|brand-logos).*)",
};

// import { withMiddlewareAuth } from "@supabase/auth-helpers-nextjs";

// export const middleware = withMiddlewareAuth({
// 	redirectTo: "/login",
// });

// export const config = {
// 	matcher: "/((?!api|_next/static|favicon.ico|login|svg|brand-logos).*)",
// };

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
// 	return NextResponse.redirect(new URL("/about-2", request.url));
// }

// // See "Matching Paths" below to learn more
// export const config = {
// 	matcher: "/about/:path*",
// };
