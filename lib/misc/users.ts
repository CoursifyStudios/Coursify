import { AllClasses, ClassResponse } from "../db/classes";
import { getDataInArray } from "./dataOutArray";
import { ArrayElementType } from "./elementarraytype.types";
import { NonNullableArray } from "./misc.types";

export const isTeacher = (
	classData: NonNullableArray<AllClasses>,
	userID: string
) => {
	return Boolean(
		classData.class &&
			getDataInArray(classData.class.class_users).find(
				(user) => user?.user_id == userID && user?.teacher
			)
	);
};

export const sortClassMembers = (
	array: Exclude<ClassResponse["data"], null>
) => {
	const mainTeacher = array.users.find((user) =>
		getDataInArray(array.class_users).some(
			(cUser) =>
				user?.id == cUser?.user_id && cUser.teacher && cUser.main_teacher
		)
	);
	const teachers = array.users.filter((user) =>
		getDataInArray(array.class_users).some(
			(cUser) =>
				user?.id == cUser?.user_id && cUser.teacher && !cUser.main_teacher
		)
	);
	const students = array.users.filter((user) =>
		getDataInArray(array.class_users).some(
			(cUser) => user?.id == cUser?.user_id && !cUser.teacher
		)
	);

	teachers.sort((a, b) => a.full_name.localeCompare(b.full_name));
	students.sort((a, b) => a.full_name.localeCompare(b.full_name));

	return mainTeacher
		? [mainTeacher, ...teachers, ...students]
		: [...teachers, ...students];
};
