import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { AppProps } from "next/app";
import { useState } from "react";
import Layout from "../components/layout/layout";
import "../styles/globals.css";

function MyApp({
	Component,
	pageProps,
}: AppProps<{
	initialSession: Session;
}>) {
	const [supabaseClient] = useState(() => createBrowserSupabaseClient());

	return (
		<SessionContextProvider
			supabaseClient={supabaseClient}
			initialSession={pageProps.initialSession}
		>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</SessionContextProvider>
	);
}
export default MyApp;
