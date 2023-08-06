import { Policy, IN, SELECT, EQ, AND } from "../ScriptQL.ts";

export const viewAgendas = new Policy({
	name: "Anyone can view agendas in their class",
	query: IN("auth.uid()", SELECT("class_users", ["user_id"], EQ("class_id", "agendas.class_id")))
})

export const manageAgendas = new Policy({
	name: "Teachers can manage agendas in their class",
	query: IN("auth.uid()", SELECT("class_users", ["user_id"], AND(EQ("$.class_id", "agendas.class_id"), EQ("$.teacher", true))))
})