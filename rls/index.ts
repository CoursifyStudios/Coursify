// Export with `deno task export`
import {
	AND,
	EQ,
	IN,
	IS,
	LTE,
	OR,
	Policy,
	SELECT,
	savePolicies,
} from "./ScriptQL.ts";

const assignmentViewing = new Policy({
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

const assignmentManagement = new Policy({
	name: "Teacher assignment management",
	query: IN(
		"auth.uid()",
		SELECT(
			"class_users",
			["user_id"],
			AND(EQ("$.class_id", "class_id"), EQ("$.teacher", "TRUE"))
		)
	),
});

// TODO: FIX THIS ASAP!!!
// Infinite recursion error
const assignmentSubmissionView = new Policy({
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
						SELECT("assignments", ["id"], EQ("$.settings->>'permissions'", "'2'"))
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
								AND(EQ("$.user_id", "auth.uid()"), EQ("$.final", "TRUE"))
							)
						)
					)
				)
			)
		)
	),
});

const assignmentSubmissionAdd = new Policy({
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
						EQ("$.teacher", "TRUE")
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

const assignmentSubmissionUpdate = new Policy({
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
					EQ("$.teacher", "TRUE")
				)
			)
		)
	),
});

savePolicies(
	"./policies.sql",
	assignmentViewing,
	assignmentManagement,
	assignmentSubmissionView,
	assignmentSubmissionAdd,
	assignmentSubmissionUpdate
);
