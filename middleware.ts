import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Database } from "./lib/db/database.types";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient<Database>({ req, res });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const redirectUrl = req.nextUrl.clone();

	if (session) {
		if (
			req.nextUrl.pathname.startsWith("/admin") ||
			req.nextUrl.pathname.startsWith("/schedule-editor")
		) {
			const { data } = await supabase
				.from("enrolled")
				.select(`admin_bool, school_id`)
				.eq("user_id", session.user.id)
				.eq("admin_bool", true);
			if (data && data.length > 0) {
				if (req.nextUrl.pathname != "/admin") {
					return res;
				} else {
					if (data.length > 1) {
						return res;
					} else {
						redirectUrl.pathname = `/admin/${data[0].school_id}`;
						return NextResponse.redirect(redirectUrl);
					}
				}
			}
			redirectUrl.pathname = "/";
			return NextResponse.redirect(redirectUrl);
		}
		return res;
	}

	redirectUrl.pathname = "/login";
	redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
	return NextResponse.redirect(redirectUrl);
}

export const config = {
	matcher:
		"/((?!api|_next/static|favicon.ico|login|txt|svg|privacypolicy.txt|termsandconditions.txt|brand-logos).*)",
};
