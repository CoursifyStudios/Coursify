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
					author: string;
					class_id: string | null;
					content: Json | null;
					id: string;
					time: string | null;
					title: string | null;
				};
				Insert: {
					author: string;
					class_id?: string | null;
					content?: Json | null;
					id?: string;
					time?: string | null;
					title?: string | null;
				};
				Update: {
					author?: string;
					class_id?: string | null;
					content?: Json | null;
					id?: string;
					time?: string | null;
					title?: string | null;
				};
			};
			assignments: {
				Row: {
					class_id: string;
					content: Json | null;
					created_date: string | null;
					description: string;
					due_date: string | null;
					due_type: number | null;
					group_id: string | null;
					hidden: boolean;
					id: string;
					name: string;
					publish_date: string | null;
					publish_type: number | null;
					submission_instructions: string | null;
					submission_type: string | null;
				};
				Insert: {
					class_id: string;
					content?: Json | null;
					created_date?: string | null;
					description: string;
					due_date?: string | null;
					due_type?: number | null;
					group_id?: string | null;
					hidden?: boolean;
					id?: string;
					name: string;
					publish_date?: string | null;
					publish_type?: number | null;
					submission_instructions?: string | null;
					submission_type?: string | null;
				};
				Update: {
					class_id?: string;
					content?: Json | null;
					created_date?: string | null;
					description?: string;
					due_date?: string | null;
					due_type?: number | null;
					group_id?: string | null;
					hidden?: boolean;
					id?: string;
					name?: string;
					publish_date?: string | null;
					publish_type?: number | null;
					submission_instructions?: string | null;
					submission_type?: string | null;
				};
			};
			class_users: {
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
			classes: {
				Row: {
					block: number;
					classpills: Json[];
					color: string;
					description: string;
					full_description: Json | null;
					id: string;
					image: string | null;
					name: string;
					name_full: string;
					room: string | null;
					schedule_type: number;
					school: string;
					tags: string[] | null;
					type: number;
				};
				Insert: {
					block: number;
					classpills?: Json[];
					color?: string;
					description?: string;
					full_description?: Json | null;
					id?: string;
					image?: string | null;
					name: string;
					name_full?: string;
					room?: string | null;
					schedule_type?: number;
					school: string;
					tags?: string[] | null;
					type: number;
				};
				Update: {
					block?: number;
					classpills?: Json[];
					color?: string;
					description?: string;
					full_description?: Json | null;
					id?: string;
					image?: string | null;
					name?: string;
					name_full?: string;
					room?: string | null;
					schedule_type?: number;
					school?: string;
					tags?: string[] | null;
					type?: number;
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
			enrolled: {
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
			group_users: {
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
			groups: {
				Row: {
					description: string | null;
					featured: boolean | null;
					id: string;
					image: string | null;
					name: string | null;
					public: boolean | null;
					tags: string[] | null;
				};
				Insert: {
					description?: string | null;
					featured?: boolean | null;
					id?: string;
					image?: string | null;
					name?: string | null;
					public?: boolean | null;
					tags?: string[] | null;
				};
				Update: {
					description?: string | null;
					featured?: boolean | null;
					id?: string;
					image?: string | null;
					name?: string | null;
					public?: boolean | null;
					tags?: string[] | null;
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
			user_achievements: {
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
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			create_announcement: {
				Args: {
					title: string;
					content: string;
					group_id: string;
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
					image: string | null;
					name: string;
					name_full: string;
					room: string | null;
					schedule_type: number;
					school: string;
					tags: string[] | null;
					type: number;
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
