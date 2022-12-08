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
					description_new: Json[] | null;
				};
				Insert: {
					name: string;
					description?: string;
					block?: number | null;
					schedule_type?: number | null;
					color?: string;
					id?: string;
					name_full?: string;
					description_new?: Json[] | null;
				};
				Update: {
					name?: string;
					description?: string;
					block?: number | null;
					schedule_type?: number | null;
					color?: string;
					id?: string;
					name_full?: string;
					description_new?: Json[] | null;
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
					name: string | null;
					description: string | null;
					id: string;
				};
				Insert: {
					name?: string | null;
					description?: string | null;
					id?: string;
				};
				Update: {
					name?: string | null;
					description?: string | null;
					id?: string;
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
					full_name: string;
					avatar_url: string;
					email: string | null;
				};
				Insert: {
					id: string;
					created?: string | null;
					username?: string | null;
					full_name: string;
					avatar_url: string;
					email?: string | null;
				};
				Update: {
					id?: string;
					created?: string | null;
					username?: string | null;
					full_name?: string;
					avatar_url?: string;
					email?: string | null;
				};
			};
			users_classes: {
				Row: {
					user_id: string;
					teacher: boolean;
					class_id: string;
					grade: number;
				};
				Insert: {
					user_id: string;
					teacher?: boolean;
					class_id: string;
					grade?: number;
				};
				Update: {
					user_id?: string;
					teacher?: boolean;
					class_id?: string;
					grade?: number;
				};
			};
			users_groups: {
				Row: {
					user_id: string;
					group_id: string;
				};
				Insert: {
					user_id: string;
					group_id: string;
				};
				Update: {
					user_id?: string;
					group_id?: string;
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
			get_profile_classes:
				| {
						Args: Record<PropertyKey, never>;
						Returns: unknown;
				  }
				| {
						Args: { id: string };
						Returns: unknown;
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
