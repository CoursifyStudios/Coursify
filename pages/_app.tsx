import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import Layout from "../components/layout/layout";
import "../styles/globals.css";

function MyApp({
	Component,
	pageProps,
}: AppProps<{
	initialSession: Session;
}>) {
	const [supabaseClient] = useState(() => createPagesBrowserClient());

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
