import { Policy, IN, SELECT, AND, EQ } from "../ScriptQL.ts";

export const adminModifyEnrolled = new Policy({
	name: "Admin can modify enrolled users",
	query: IN(
		"school_id",
		SELECT(
			"enrolled",
			["user_id"],
			AND(EQ("$.admin_bool", true), EQ("$.user_id", "auth.uid()"))
		)
	),
});

export const adminModifyEnrolledUserData = new Policy({
	name: "Admin can modify student data of enrolled users",
	query: IN(
		"school_id",
		SELECT(
			"enrolled",
			["school_id"],
			AND(
				EQ("$.admin_bool", true),
				IN("id", SELECT("enrolled", ["user_id"], EQ("$.user_id", "auth.uid()")))
			)
		)
	),
});
