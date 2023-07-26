import { Policy, IN, SELECT, AND, EQ, OR, IS, LTE } from "../ScriptQL.ts";

export const assignmentViewing = new Policy({
	name: "Student assignment viewing",
	query: IN(
		"auth.uid()",
		SELECT(
			"class_users",
			["user_id"],
			AND(
				EQ("$.class_id", "class_id"),
				OR(
					EQ("$.teacher", "TRUE"),
					AND(
						EQ("hidden", "FALSE"),
						// Thanks Seagullz for giving ideas on what's the issue
						OR(IS("publish_date", "NULL"), LTE("publish_date", "now()"))
					)
				)
			)
		)
	),
});

export const assignmentManagement = new Policy({
	name: "Teacher assignment management",
	query: IN(
		"auth.uid()",
		SELECT(
			"class_users",
			["user_id"],
			AND(EQ("$.class_id", "class_id"), EQ("$.teacher", true))
		)
	),
});
