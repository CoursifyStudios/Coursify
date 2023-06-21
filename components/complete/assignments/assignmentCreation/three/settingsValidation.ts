import { AssignmentTypes } from "@/lib/db/assignments";
import * as Yup from "yup";
import { AssignmentSettingsTypes } from "./settings.types";

const AssignmentValidation = ({
	object,
}: {
	assignmentType: AssignmentTypes;
	object: AssignmentSettingsTypes;
}) => {
	switch (object.assignmentType) {
	}
};

export default AssignmentValidation;

const AssignmentLinkValidation = Yup.object({
	urls: Yup.array().of(Yup.string()),
	maxUrls: Yup.number().required(),
	enforceHttps: Yup.boolean().required(),
});
