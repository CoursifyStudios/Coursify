// Export with `deno task export`
import { savePolicies } from "./ScriptQL.ts";
import {
	assignmentManagement,
	assignmentViewing,
} from "./tables/assignments.ts";
import {
	classManagement,
	classUpdating,
	classViewing,
} from "./tables/classes.ts";
import {
	adminModifyEnrolled,
	adminModifyEnrolledUserData,
} from "./tables/enrolled.ts";
import {
	assignmentSubmissionAdd,
	assignmentSubmissionUpdate,
	assignmentSubmissionView,
} from "./tables/submissions.ts";
import { adminModifyClassUsers } from "./tables/classUsers.ts";

savePolicies(
	"./policies.sql",
	assignmentViewing,
	assignmentManagement,
	assignmentSubmissionView,
	assignmentSubmissionAdd,
	assignmentSubmissionUpdate,
	adminModifyEnrolled,
	adminModifyEnrolledUserData,
	classViewing,
	classUpdating,
	classManagement,
	adminModifyClassUsers
);
