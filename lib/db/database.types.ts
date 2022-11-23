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
					description: string;
					block: number | null;
				};
				Insert: {
					id?: number;
					name: string;
					description?: string;
					block?: number | null;
				};
				Update: {
					id?: number;
					name?: string;
					description?: string;
					block?: number | null;
				};
			};
			classes_assignments: {
				Row: {
					class_id: number;
					assignment_id: number;
				};
				Insert: {
					class_id: number;
					assignment_id: number;
				};
				Update: {
					class_id?: number;
					assignment_id?: number;
				};
			};
			groups: {
				Row: {
					id: number;
				};
				Insert: {
					id?: number;
				};
				Update: {
					id?: number;
				};
			};
			school_users: {
				Row: {
					school_id: number;
					user_id: string;
				};
				Insert: {
					school_id: number;
					user_id: string;
				};
				Update: {
					school_id?: number;
					user_id?: string;
				};
			};
			schools: {
				Row: {
					id: number;
					created_at: string | null;
					name: string;
					schedule: Json[] | null;
				};
				Insert: {
					id?: number;
					created_at?: string | null;
					name: string;
					schedule?: Json[] | null;
				};
				Update: {
					id?: number;
					created_at?: string | null;
					name?: string;
					schedule?: Json[] | null;
				};
			};
			users: {
				Row: {
					id: string;
					created: string | null;
					username: string | null;
					full_name: string | null;
					avatar_url: string | null;
				};
				Insert: {
					id: string;
					created?: string | null;
					username?: string | null;
					full_name?: string | null;
					avatar_url?: string | null;
				};
				Update: {
					id?: string;
					created?: string | null;
					username?: string | null;
					full_name?: string | null;
					avatar_url?: string | null;
				};
			};
			users_classes: {
				Row: {
					class_id: number;
					user_id: string;
					teacher: boolean;
				};
				Insert: {
					class_id: number;
					user_id: string;
					teacher?: boolean;
				};
				Update: {
					class_id?: number;
					user_id?: string;
					teacher?: boolean;
				};
			};
			users_groups: {
				Row: {
					user_id: string;
					group_id: number;
				};
				Insert: {
					user_id: string;
					group_id: number;
				};
				Update: {
					user_id?: string;
					group_id?: number;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			can_user_read_assignment: {
				Args: { arg_user_id: string; arg_assignment_id: number };
				Returns: boolean;
			};
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
