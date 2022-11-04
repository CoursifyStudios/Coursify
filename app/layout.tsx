"use client";

import "./globals.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [supabaseClient] = useState(() => createBrowserSupabaseClient());
	return (
		<html lang="en">
			<head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body>
				<SessionContextProvider
					supabaseClient={supabaseClient}
					initialSession={null}
				>
					{children}
				</SessionContextProvider>
			</body>
		</html>
	);
}
