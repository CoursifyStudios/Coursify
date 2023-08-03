import { OR, IN, Policy, SELECT, EQ, AND } from "../ScriptQL.ts";

export const classViewing = new Policy({
	name: "Students can view classes in their school",
	query: OR(
		IN(
			"auth.uid()",
			SELECT("class_users", ["user_id"], EQ("$.class_id", "id"))
		),
		IN(
			"auth.uid()",
			SELECT("enrolled", ["user_id"], EQ("$.school_id", "school"))
		)
	),
});

export const classUpdating = new Policy({
	name: "Teachers and admins can update class info",
	query: IN(
		"id",
		SELECT(
			"class_users",
			["class_id"],
			OR(
				AND(EQ("$.user_id", "auth.uid()"), EQ("$.teacher", true)),
				IN(
					"auth.uid()",
					SELECT(
						"enrolled",
						["user_id"],
						AND(EQ("$.admin_bool", true), EQ("$.school_id", "school"))
					)
				)
			)
		)
	),
});

export const classManagement = new Policy({
	name: "Admins can create and delete classes",
	query: IN(
		"auth.uid()",
		SELECT(
			"enrolled",
			["user_id"],
			AND(EQ("$.admin_bool", true), EQ("$.school_id", "school"))
		)
	),
});
