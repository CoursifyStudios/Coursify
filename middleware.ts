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
		const onboarded = req.cookies.get("onboardingState")?.value ?? "";

		res.cookies.set("onboardingState", onboarded, {
			maxAge: Date.now() + 60 * 60 * 24 * 365,
		});

		if (onboarded != OnboardingState.Done) {
			if (onboarded == "") {
				const { data, error } = await supabase
					.from("users")
					.select("onboarded, schools (id)")
					.eq("id", session.user.id)
					.single();
				if (data) {
					if (data.onboarded) {
						res.cookies.set("onboardingState", OnboardingState.Done, {
							maxAge: Date.now() + 60 * 60 * 24 * 365,
						});
					} else {
						if (!req.nextUrl.pathname.startsWith("/onboarding")) {
							if (data.schools.length > 0) {
								redirectUrl.pathname = `/onboarding/${OnboardingState.FirstStage}`;
							} else {
								redirectUrl.pathname = `/onboarding/${OnboardingState.NoAccount}`;
							}
							const redirect = NextResponse.redirect(redirectUrl);
							return redirect;
						} else {
							if (data.schools.length > 0) {
								res.cookies.set("onboardingState", OnboardingState.FirstStage, {
									maxAge: Date.now() + 60 * 60 * 24 * 365,
								});
							} else {
								res.cookies.set("onboardingState", OnboardingState.NoAccount, {
									maxAge: Date.now() + 60 * 60 * 24 * 365,
								});
							}
						}
					}
				} else {
					// Weird edge case that should never happen - bloxkcs
					// It happends sometimes - LS
				}
			} else {
				if (!req.nextUrl.pathname.startsWith("/onboarding")) {
					redirectUrl.pathname = `/onboarding/${onboarded}`;
					const redirect = NextResponse.redirect(redirectUrl);

					redirect.cookies.set("onboardingState", onboarded, {
						maxAge: Date.now() + 60 * 60 * 24 * 365,
					});

					return redirect;
				}
			}
		} else {
			if (req.nextUrl.pathname.startsWith("/onboarding")) {
				redirectUrl.pathname = "/";
				const redirect = NextResponse.redirect(redirectUrl);

				redirect.cookies.set("onboardingState", onboarded, {
					maxAge: Date.now() + 60 * 60 * 24 * 365,
				});

				return redirect;
			}
		}

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

		if (req.nextUrl.pathname.startsWith("/login")) {
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

export enum OnboardingState {
	NotStarted = "0",
	Done = "1",
	Parent = "2", // if parent is in system
	NoAccount = "3", // if user is not in system
	FirstStage = "4",
	SecondStage = "5",
	ThirdStage = "6",
	SettingsStage = "7",
}
