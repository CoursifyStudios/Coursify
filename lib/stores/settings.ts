import { create } from "zustand";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

interface Settings {
	theme: "light" | "dark";
}

interface SettingsStore {
	data: Settings;
	set: (data: Partial<Settings>) => void;
}

export const useSettings = create<SettingsStore>()((set) => ({
	data: { theme: "light" },
	set: async (data) => {
		// const supabase = useSupabaseClient();
		// const user = useUser();

		set((state) => ({
			data: data
				? {
						...state.data,
						...data,
				  }
				: {
						theme: "dark",
				  },
		}));

		// if (user != undefined) {
		// 	supabase.from("settings").update({

		// 	})
		// }
	},
}));
