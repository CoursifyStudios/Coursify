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
					content: string | null;
					created_date: string | null;
					description: string;
					due_info: Json | null;
					id: string;
					name: string;
					publish_info: Json | null;
					type: string | null;
				};
				Insert: {
					content?: string | null;
					created_date?: string | null;
					description: string;
					due_info?: Json | null;
					id?: string;
					name: string;
					publish_info?: Json | null;
					type?: string | null;
				};
				Update: {
					content?: string | null;
					created_date?: string | null;
					description?: string;
					due_info?: Json | null;
					id?: string;
					name?: string;
					publish_info?: Json | null;
					type?: string | null;
				};
			};
			classes: {
				Row: {
					block: number | null;
					color: string;
					description: string;
					description_new: Json[] | null;
					id: string;
					name: string;
					name_full: string;
					schedule_type: number | null;
				};
				Insert: {
					block?: number | null;
					color?: string;
					description?: string;
					description_new?: Json[] | null;
					id?: string;
					name: string;
					name_full?: string;
					schedule_type?: number | null;
				};
				Update: {
					block?: number | null;
					color?: string;
					description?: string;
					description_new?: Json[] | null;
					id?: string;
					name?: string;
					name_full?: string;
					schedule_type?: number | null;
				};
			};
			classes_assignments: {
				Row: {
					assignment_id: string;
					class_id: string;
				};
				Insert: {
					assignment_id: string;
					class_id: string;
				};
				Update: {
					assignment_id?: string;
					class_id?: string;
				};
			};
			groups: {
				Row: {
					description: string | null;
					id: string;
					name: string | null;
				};
				Insert: {
					description?: string | null;
					id?: string;
					name?: string | null;
				};
				Update: {
					description?: string | null;
					id?: string;
					name?: string | null;
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
					school_id: string;
					user_id: string;
				};
				Insert: {
					school_id: string;
					user_id: string;
				};
				Update: {
					school_id?: string;
					user_id?: string;
				};
			};
			schools: {
				Row: {
					created_at: string | null;
					id: string;
					name: string;
					schedule: Json[] | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					name: string;
					schedule?: Json[] | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					name?: string;
					schedule?: Json[] | null;
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
					avatar_url: string;
					created: string | null;
					email: string | null;
					full_name: string;
					id: string;
					username: string | null;
				};
				Insert: {
					avatar_url: string;
					created?: string | null;
					email?: string | null;
					full_name: string;
					id: string;
					username?: string | null;
				};
				Update: {
					avatar_url?: string;
					created?: string | null;
					email?: string | null;
					full_name?: string;
					id?: string;
					username?: string | null;
				};
			};
			users_classes: {
				Row: {
					class_id: string;
					grade: number;
					teacher: boolean;
					user_id: string;
				};
				Insert: {
					class_id: string;
					grade?: number;
					teacher?: boolean;
					user_id: string;
				};
				Update: {
					class_id?: string;
					grade?: number;
					teacher?: boolean;
					user_id?: string;
				};
			};
			users_groups: {
				Row: {
					group_id: string;
					user_id: string;
				};
				Insert: {
					group_id: string;
					user_id: string;
				};
				Update: {
					group_id?: string;
					user_id?: string;
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
