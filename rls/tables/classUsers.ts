import { IN, Policy, SELECT, AND, EQ } from "../ScriptQL.ts";

export const adminModifyClassUsers = new Policy({
	name: "Admin can modify class users",
	query: IN(
		"class_id",
		SELECT(
			"classes",
			["id"],
			AND(
				EQ("$.id", "class_id"),
				IN(
					"$.school",
					SELECT(
						"enrolled",
						["school_id"],
						AND(EQ("$.user_id", "auth.uid()"), EQ("$.admin_bool", true))
					)
				)
			)
		)
	),
});
