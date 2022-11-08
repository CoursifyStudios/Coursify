export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export interface Database {
	public: {
		Tables: {
			classes: {
				Row: {
					id: number;
					name: string | null;
					teachers: string[] | null;
					students: string[] | null;
					description: string | null;
				};
				Insert: {
					id?: number;
					name?: string | null;
					teachers?: string[] | null;
					students?: string[] | null;
					description?: string | null;
				};
				Update: {
					id?: number;
					name?: string | null;
					teachers?: string[] | null;
					students?: string[] | null;
					description?: string | null;
				};
			};
			users: {
				Row: {
					id: string;
					updated_at: string | null;
					username: string | null;
					full_name: string | null;
					avatar_url: string | null;
				};
				Insert: {
					id: string;
					updated_at?: string | null;
					username?: string | null;
					full_name?: string | null;
					avatar_url?: string | null;
				};
				Update: {
					id?: string;
					updated_at?: string | null;
					username?: string | null;
					full_name?: string | null;
					avatar_url?: string | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
	};
}