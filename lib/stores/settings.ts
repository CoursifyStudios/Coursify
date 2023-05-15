import { SupabaseClient } from "@supabase/auth-helpers-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Database } from "../db/database.types";

interface Settings {
	theme: "light" | "dark" | "system";
	compact: boolean;
}

interface SettingsStore {
	data: Settings;
	set: (data: Partial<Settings>) => void;
	loadSettings: (supabase: SupabaseClient<Database>, userid: string) => void;
}

export const useSettings = create<SettingsStore>()(
	persist(
		(set) => ({
			data: { theme: "system", compact: false },
			set: async (data) => {
				set((state) => ({
					data: data
						? {
								...state.data,
								...data,
						  }
						: {
								theme: "system",
								compact: false,
						  },
				}));
			},

			loadSettings: async (
				supabase: SupabaseClient<Database>,
				userid: string
			) => {
				const { data } = await supabase
					.from("settings")
					.select("*")
					.eq("user_id", userid)
					.limit(1)
					.single();

				if (data != undefined) {
					set((state) => ({
						data: {
							...state.data,
							...JSON.parse(
								JSON.stringify(data.settings as Record<string, unknown>)
							),
						},
					}));
				}
			},
		}),
		{
			name: "settings",
		}
	)
);
