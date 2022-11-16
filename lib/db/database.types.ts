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
			assignments: {
				Row: {
					id: number;
					name: string;
					type: string | null;
					description: string;
					description_long: string | null;
					created_date: string | null;
					publish_info: Json | null;
					publish_date: string | null;
					due_info: Json | null;
					due_date: string | null;
					submissions: Json[] | null;
				};
				Insert: {
					id?: number;
					name: string;
					type?: string | null;
					description: string;
					description_long?: string | null;
					created_date?: string | null;
					publish_info?: Json | null;
					publish_date?: string | null;
					due_info?: Json | null;
					due_date?: string | null;
					submissions?: Json[] | null;
				};
				Update: {
					id?: number;
					name?: string;
					type?: string | null;
					description?: string;
					description_long?: string | null;
					created_date?: string | null;
					publish_info?: Json | null;
					publish_date?: string | null;
					due_info?: Json | null;
					due_date?: string | null;
					submissions?: Json[] | null;
				};
			};
			classes: {
				Row: {
					id: number;
					name: string;
					teachers: string[] | null;
					students: string[] | null;
					description: string;
					assignments: number[] | null;
				};
				Insert: {
					id?: number;
					name: string;
					teachers?: string[] | null;
					students?: string[] | null;
					description?: string;
					assignments?: number[] | null;
				};
				Update: {
					id?: number;
					name?: string;
					teachers?: string[] | null;
					students?: string[] | null;
					description?: string;
					assignments?: number[] | null;
				};
			};
			classes_assignments: {
				Row: {
					class_id: number;
					asssignment_id: number;
				};
				Insert: {
					class_id: number;
					asssignment_id: number;
				};
				Update: {
					class_id?: number;
					asssignment_id?: number;
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
