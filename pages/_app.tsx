import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode, useState } from "react";
import Layout from "../components/layout/layout";
import "../styles/globals.css";
import { NextPage } from "next";

export type NextPageWithLayout<
	P = Record<string | number | symbol, never>,
	IP = P,
> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
	initialSession: Session;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const [supabaseClient] = useState(() => createPagesBrowserClient());
	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<>
			<Head>
				<title>Coursify</title>
			</Head>
			<SessionContextProvider
				supabaseClient={supabaseClient}
				initialSession={pageProps.initialSession}
			>
				<ThemeProvider attribute="class" disableTransitionOnChange>
					{getLayout(<Component />)}
				</ThemeProvider>
			</SessionContextProvider>
			<Analytics />
		</>
	);
}
export default MyApp;
