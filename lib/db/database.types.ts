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
					content: string | null;
					created_date: string | null;
					publish_info: Json | null;
					due_info: Json | null;
				};
				Insert: {
					id?: number;
					name: string;
					type?: string | null;
					description: string;
					content?: string | null;
					created_date?: string | null;
					publish_info?: Json | null;
					due_info?: Json | null;
				};
				Update: {
					id?: number;
					name?: string;
					type?: string | null;
					description?: string;
					content?: string | null;
					created_date?: string | null;
					publish_info?: Json | null;
					due_info?: Json | null;
				};
			};
			classes: {
				Row: {
					id: number;
					name: string;
					description: string;
					block: number | null;
					schedule_type: number | null;
					color: string;
				};
				Insert: {
					id?: number;
					name: string;
					description?: string;
					block?: number | null;
					schedule_type?: number | null;
					color?: string;
				};
				Update: {
					id?: number;
					name?: string;
					description?: string;
					block?: number | null;
					schedule_type?: number | null;
					color?: string;
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
