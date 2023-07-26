import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient({ req, res });
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
	matcher: "/((?!api|_next/static|favicon.ico|login|txt|svg|privacypolicy.txt|termsandconditions.txt|brand-logos).*)",
};
