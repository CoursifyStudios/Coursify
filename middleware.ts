import { withMiddlewareAuth } from "@supabase/auth-helpers-nextjs";

export const middleware = withMiddlewareAuth({
	redirectTo: "/login",
});

export const config = {
	matcher: "/((?!api|_next/static|favicon.ico|login).*)",
};
