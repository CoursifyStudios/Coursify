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
			achievements: {
				Row: {
					desc_full: string | null;
					desc_short: string | null;
					icon: string | null;
					id: string;
					name: string;
					school: string;
				};
				Insert: {
					desc_full?: string | null;
					desc_short?: string | null;
					icon?: string | null;
					id?: string;
					name: string;
					school: string;
				};
				Update: {
					desc_full?: string | null;
					desc_short?: string | null;
					icon?: string | null;
					id?: string;
					name?: string;
					school?: string;
				};
			};
			announcements: {
				Row: {
					author: string | null;
					content: string | null;
					id: string;
					time: string | null;
					title: string | null;
				};
				Insert: {
					author?: string | null;
					content?: string | null;
					id?: string;
					time?: string | null;
					title?: string | null;
				};
				Update: {
					author?: string | null;
					content?: string | null;
					id?: string;
					time?: string | null;
					title?: string | null;
				};
			};
			assignments: {
				Row: {
					content: Json | null;
					created_date: string | null;
					description: string;
					due_date: string;
					due_type: number | null;
					id: string;
					name: string;
					publish_date: string | null;
					publish_type: number | null;
					submission_type: string | null;
				};
				Insert: {
					content?: Json | null;
					created_date?: string | null;
					description: string;
					due_date?: string;
					due_type?: number | null;
					id?: string;
					name: string;
					publish_date?: string | null;
					publish_type?: number | null;
					submission_type?: string | null;
				};
				Update: {
					content?: Json | null;
					created_date?: string | null;
					description?: string;
					due_date?: string;
					due_type?: number | null;
					id?: string;
					name?: string;
					publish_date?: string | null;
					publish_type?: number | null;
					submission_type?: string | null;
				};
			};
			classes: {
				Row: {
					block: number;
					classpills: Json[];
					color: string;
					description: string;
					full_description: Json | null;
					id: string;
					name: string;
					name_full: string;
					room: string | null;
					schedule_type: number;
				};
				Insert: {
					block: number;
					classpills?: Json[];
					color?: string;
					description?: string;
					full_description?: Json | null;
					id?: string;
					name: string;
					name_full?: string;
					room?: string | null;
					schedule_type?: number;
				};
				Update: {
					block?: number;
					classpills?: Json[];
					color?: string;
					description?: string;
					full_description?: Json | null;
					id?: string;
					name?: string;
					name_full?: string;
					room?: string | null;
					schedule_type?: number;
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
			days_schedule: {
				Row: {
					date: string;
					schedule_items: Json | null;
					template: number | null;
				};
				Insert: {
					date: string;
					schedule_items?: Json | null;
					template?: number | null;
				};
				Update: {
					date?: string;
					schedule_items?: Json | null;
					template?: number | null;
				};
			};
			groups: {
				Row: {
					description: string | null;
					featured: boolean | null;
					id: string;
					name: string | null;
					public: boolean | null;
					tags: string[] | null;
				};
				Insert: {
					description?: string | null;
					featured?: boolean | null;
					id?: string;
					name?: string | null;
					public?: boolean | null;
					tags?: string[] | null;
				};
				Update: {
					description?: string | null;
					featured?: boolean | null;
					id?: string;
					name?: string | null;
					public?: boolean | null;
					tags?: string[] | null;
				};
			};
			groups_announcements: {
				Row: {
					announcement_id: string;
					group_id: string;
				};
				Insert: {
					announcement_id: string;
					group_id: string;
				};
				Update: {
					announcement_id?: string;
					group_id?: string;
				};
			};
			schedule_templates: {
				Row: {
					id: number;
					name: string | null;
					schedule_items: Json | null;
				};
				Insert: {
					id?: number;
					name?: string | null;
					schedule_items?: Json | null;
				};
				Update: {
					id?: number;
					name?: string | null;
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
			starred: {
				Row: {
					assignment_id: string;
					user_id: string;
				};
				Insert: {
					assignment_id: string;
					user_id: string;
				};
				Update: {
					assignment_id?: string;
					user_id?: string;
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
					year: string | null;
				};
				Insert: {
					avatar_url: string;
					created?: string | null;
					email?: string | null;
					full_name: string;
					id: string;
					username?: string | null;
					year?: string | null;
				};
				Update: {
					avatar_url?: string;
					created?: string | null;
					email?: string | null;
					full_name?: string;
					id?: string;
					username?: string | null;
					year?: string | null;
				};
			};
			users_achievements: {
				Row: {
					achivement_id: string;
					date_earned: string;
					user_id: string;
				};
				Insert: {
					achivement_id: string;
					date_earned?: string;
					user_id: string;
				};
				Update: {
					achivement_id?: string;
					date_earned?: string;
					user_id?: string;
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
					group_leader: boolean | null;
					user_id: string;
				};
				Insert: {
					group_id: string;
					group_leader?: boolean | null;
					user_id: string;
				};
				Update: {
					group_id?: string;
					group_leader?: boolean | null;
					user_id?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			create_assignment: {
				Args: {
					name: string;
					description: string;
					class_id: string;
				};
				Returns: boolean;
			};
			get_profile_classes: {
				Args: {
					id: string;
				};
				Returns: {
					block: number;
					classpills: Json[];
					color: string;
					description: string;
					full_description: Json | null;
					id: string;
					name: string;
					name_full: string;
					room: string | null;
					schedule_type: number;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
