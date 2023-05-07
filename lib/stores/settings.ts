import { create } from "zustand";
import { SupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../db/database.types";

interface Settings {
	theme: "light" | "dark";
	compact: boolean;
}

interface SettingsStore {
	data: Settings;
	set: (data: Partial<Settings>) => void;
	loadSettings: (supabase: SupabaseClient<Database>, userid: string) => void;
}

export const useSettings = create<SettingsStore>()((set) => ({
	data: { theme: "light", compact: false },
	set: async (data) => {
		set((state) => ( {
				data: data
					? {
							...state.data,
							...data,
					  }
					: {
							theme: "dark",
							compact: false,
					  },
			}));
	},

	loadSettings: async (supabase: SupabaseClient<Database>, userid: string) => {
		const { data } = await supabase.from("settings").select("*").eq("user_id", userid).limit(1).single();
		
		if (data != undefined) {
			set((state) => ({
				data: {
					...state.data,
					...data,
				},
			}));
		}
	}
}));

