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
					name: string;
					type: string | null;
					description: string;
					content: string | null;
					created_date: string | null;
					publish_info: Json | null;
					due_info: Json | null;
					id: string;
				};
				Insert: {
					name: string;
					type?: string | null;
					description: string;
					content?: string | null;
					created_date?: string | null;
					publish_info?: Json | null;
					due_info?: Json | null;
					id?: string;
				};
				Update: {
					name?: string;
					type?: string | null;
					description?: string;
					content?: string | null;
					created_date?: string | null;
					publish_info?: Json | null;
					due_info?: Json | null;
					id?: string;
				};
			};
			classes: {
				Row: {
					name: string;
					description: string;
					block: number | null;
					schedule_type: number | null;
					color: string;
					id: string;
					name_full: string;
				};
				Insert: {
					name: string;
					description?: string;
					block?: number | null;
					schedule_type?: number | null;
					color?: string;
					id?: string;
					name_full?: string;
				};
				Update: {
					name?: string;
					description?: string;
					block?: number | null;
					schedule_type?: number | null;
					color?: string;
					id?: string;
					name_full?: string;
				};
			};
			classes_assignments: {
				Row: {
					class_id: string;
					assignment_id: string;
				};
				Insert: {
					class_id: string;
					assignment_id: string;
				};
				Update: {
					class_id?: string;
					assignment_id?: string;
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
			schedule: {
				Row: {
					date: string;
					schedule_items: Json | null;
				};
				Insert: {
					date: string;
					schedule_items?: Json | null;
				};
				Update: {
					date?: string;
					schedule_items?: Json | null;
				};
			};
			school_users: {
				Row: {
					user_id: string;
					school_id: string;
				};
				Insert: {
					user_id: string;
					school_id: string;
				};
				Update: {
					user_id?: string;
					school_id?: string;
				};
			};
			schools: {
				Row: {
					created_at: string | null;
					name: string;
					schedule: Json[] | null;
					id: string;
				};
				Insert: {
					created_at?: string | null;
					name: string;
					schedule?: Json[] | null;
					id?: string;
				};
				Update: {
					created_at?: string | null;
					name?: string;
					schedule?: Json[] | null;
					id?: string;
				};
			};
			test: {
				Row: {
					id: number;
					name: string | null;
				};
				Insert: {
					id?: number;
					name?: string | null;
				};
				Update: {
					id?: number;
					name?: string | null;
				};
			};
			users: {
				Row: {
					id: string;
					created: string | null;
					username: string | null;
					full_name: string | null;
					avatar_url: string | null;
					email: string | null;
				};
				Insert: {
					id: string;
					created?: string | null;
					username?: string | null;
					full_name?: string | null;
					avatar_url?: string | null;
					email?: string | null;
				};
				Update: {
					id?: string;
					created?: string | null;
					username?: string | null;
					full_name?: string | null;
					avatar_url?: string | null;
					email?: string | null;
				};
			};
			users_classes: {
				Row: {
					user_id: string;
					teacher: boolean;
					class_id: string;
				};
				Insert: {
					user_id: string;
					teacher?: boolean;
					class_id: string;
				};
				Update: {
					user_id?: string;
					teacher?: boolean;
					class_id?: string;
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
			create_assignment: {
				Args: { name: string; description: string; class_id: string };
				Returns: boolean;
			};
			hello_world: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
