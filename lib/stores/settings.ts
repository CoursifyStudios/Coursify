import { create } from "zustand";
import { SupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../db/database.types";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Settings {
	theme: "light" | "dark" | "system";
	compact: boolean;
	sortBySchedule: boolean;
	homepageAssignments: "all" | "student" | "none";
	homepageView: "auto" | "tabbed" | "student" | "teacher";
}

interface SettingsStore {
	data: Settings;
	set: (data: Partial<Settings>) => void;
	loadSettings: (supabase: SupabaseClient<Database>, userid: string) => void;
}

const defaultSettings: Settings = {
	theme: "system",
	compact: false,
	sortBySchedule: true,
	homepageAssignments: "student",
	homepageView: "auto",
};

export const useSettings = create<SettingsStore>()(
	persist(
		(set) => ({
			data: defaultSettings,
			set: async (data) => {
				set((state) => ({
					data: data
						? {
								...state.data,
								...data,
						  }
						: defaultSettings,
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
							...defaultSettings,
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
