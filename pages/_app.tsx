import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
	SessionContextProvider,
	Session,
	useSupabaseClient,
	useUser,
} from "@supabase/auth-helpers-react";
import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";
import { useState, useEffect } from "react";
import Layout from "../components/layout/layout";
import "../styles/globals.css";
import Head from "next/head";
import { useSettings } from "../lib/stores/settings";
import { ThemeProvider } from "next-themes";

function MyApp({
	Component,
	pageProps,
}: AppProps<{
	initialSession: Session;
}>) {
	const [supabaseClient] = useState(() => createBrowserSupabaseClient());

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
					<Layout>
						<Component />
					</Layout>
				</ThemeProvider>
			</SessionContextProvider>
			<Analytics />
		</>
	);
}
export default MyApp;
