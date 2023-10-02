import { Policy, AND, IN, SELECT, EQ, OR, IS } from "../ScriptQL.ts";

// TODO: FIX THIS ASAP!!!
// Infinite recursion error
export const assignmentSubmissionView = new Policy({
	name: "Student assignment submission viewing",
	query: AND(
		IN(
			"auth.uid()",
			SELECT(
				"class_users",
				["user_id"],
				AND(
					EQ(
						"$.class_id",
						SELECT("assignments", ["class_id"], EQ("$.id", "assignment_id"))
					)
				)
			)
		),
		OR(
			EQ("user_id", "auth.uid()"),
			AND(
				EQ(SELECT("assignments", ["type"], EQ("$.id", "assignment_id")), "4"),
				OR(
					IN(
						"assignment_id",
						SELECT(
							"assignments",
							["id"],
							EQ("$.settings->>'permissions'", "'2'")
						)
					),
					AND(
						IN(
							"assignment_id",
							SELECT(
								"assignments",
								["id"],
								EQ("$.settings->>'permissions'", "'1'")
							)
						),
						IN(
							"auth.uid()",
							SELECT(
								"submissions",
								["user_id"],
								AND(EQ("$.user_id", "auth.uid()"), EQ("$.final", true))
							)
						)
					)
				)
			)
		)
	),
});

export const assignmentSubmissionAdd = new Policy({
	name: "Student assignment submission add",
	query: AND(
		OR(
			AND(
				EQ("user_id", "auth.uid()"),
				IN(
					"auth.uid()",
					SELECT(
						"class_users",
						["user_id"],
						AND(
							EQ(
								"$.class_id",
								SELECT("assignments", ["class_id"], EQ("$.id", "assignment_id"))
							)
						)
					)
				)
			),
			IN(
				"auth.uid()",
				SELECT(
					"class_users",
					["user_id"],
					AND(
						EQ(
							"$.class_id",
							SELECT("assignments", ["class_id"], EQ("$.id", "assignment_id"))
						),
						EQ("$.teacher", true)
					)
				)
			)
		),
		IN("assignment_id", SELECT("assignments", ["id"])),
		AND(
			IS("grade", "NULL"),
			IS("hide", "NULL"),
			OR(EQ("created_at", "now()"), IS("created_at", "NULL"))
		)
	),
});

export const assignmentSubmissionUpdate = new Policy({
	name: "Teacher can edit assignment submissions",
	query: AND(
		IN(
			"auth.uid()",
			SELECT(
				"class_users",
				["user_id"],
				AND(
					EQ(
						"$.class_id",
						SELECT("assignments", ["class_id"], EQ("$.id", "assignment_id"))
					),
					EQ("$.teacher", true)
				)
			)
		)
	),
});
