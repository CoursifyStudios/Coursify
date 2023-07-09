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

const assignmentSubmissionAdd = new Policy({
	name: "Student assignment submission add",
	query: AND(
		OR(
			EQ("user_id", "auth.uid()")
			// Implement teacher can override - Lukas
			// Fuck me - Bloxs
		),
		IN("assignment_id", SELECT("assignments", ["id"])),
		AND(
			IS("grade", "NULL"),
			IS("hide", "NULL"),
			OR(EQ("created_at", "now()"), IS("created_at", "NULL"))
		)
	),
});

savePolicies(
	"./policies.sql",
	assignmentViewing,
	assignmentManagement,
	assignmentSubmissionAdd
);
