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
	data: { theme: "dark" },
	set: async (data) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const supabase = useSupabaseClient();
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const user = useUser();

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
