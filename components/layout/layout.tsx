import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import { Database, Json } from "../../lib/db/database.types";
import { useSettings } from "../../lib/stores/settings";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout(props: { children: ReactNode }) {
	const { data, set, loadSettings } = useSettings();
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const [loading, setLoading] = useState(false);
	const [hydrated, setHydrated] = useState(false);
	const { theme, setTheme, systemTheme } = useTheme();

	useEffect(() => setHydrated(true), []);

	useEffect(() => {
		if (loading) return;
		if (user == undefined || user.id == undefined) return;
		setLoading(true);
		loadSettings(supabase, user.id);
		useSettings.subscribe(async (state) => {
			setTheme(
				state.data.theme == "system" ? systemTheme || "light" : state.data.theme
			);
			await supabase.from("settings").upsert({
				user_id: user.id,
				settings: state.data as unknown as Json,
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loading, supabase, user, loadSettings]);

	useEffect(() => {
		// Edge case for if someone logs in as the demo teacher
		// So I don't need to also code that
		if (user == undefined) return;
		if (user.id == "afd1de7d-df61-4350-9a6a-f5fd3052ead8") {
			supabase.auth.signOut();
		}
	}, [user, supabase.auth]);

	return (
		<div
			className={`flex min-h-screen flex-col bg-backdrop text-gray-800 transition-all duration-300
			 ${data.compact && hydrated ? "compact" : ""}`}
		>
			<Navbar />
			<div className="flex flex-1 flex-col">{props.children}</div>
			<Footer />
		</div>
	);
}

export function BasicLayout(props: { children: ReactNode }) {
	const { data, set, loadSettings } = useSettings();
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const [loading, setLoading] = useState(false);
	const [hydrated, setHydrated] = useState(false);
	const { theme, setTheme, systemTheme } = useTheme();

	useEffect(() => setHydrated(true), []);

	useEffect(() => {
		if (loading) return;
		if (user == undefined || user.id == undefined) return;
		setLoading(true);
		loadSettings(supabase, user.id);
		useSettings.subscribe(async (state) => {
			setTheme(
				state.data.theme == "system" ? systemTheme || "light" : state.data.theme
			);
			await supabase.from("settings").upsert({
				user_id: user.id,
				settings: state.data as unknown as Json,
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loading, supabase, user, loadSettings]);

	useEffect(() => {
		// Edge case for if someone logs in as the demo teacher
		// So I don't need to also code that
		if (user == undefined) return;
		if (user.id == "afd1de7d-df61-4350-9a6a-f5fd3052ead8") {
			supabase.auth.signOut();
		}
	}, [user, supabase.auth]);

	return (
		<div
			className={`flex h-screen flex-col bg-backdrop text-gray-800 transition-all duration-300
			 ${data.compact && hydrated ? "compact" : ""}`}
		>
			<div className="flex flex-1 flex-col">{props.children}</div>
		</div>
	);
}
