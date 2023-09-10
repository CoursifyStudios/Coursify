import { Popup } from "@/components/misc/popup";
import { Tab } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import AssignmentSettings from "../../assignmentCreation/three";
import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import { AssignmentSettingsTypes } from "../../assignmentCreation/three/settings.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "@/lib/db/database.types";

const EditDates = ({ close, open }: { open: boolean; close: () => void }) => {
	return (
		<Popup open={open} closeMenu={close}>
			Editing publish/due dates is coming soon
		</Popup>
	);
};

export default EditDates;
