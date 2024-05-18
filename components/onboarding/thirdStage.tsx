import { AllClasses } from "@/lib/db/classes";
import { OnboardingState } from "@/middleware";
import OnboardClasses from "./onboardingClass";
import { RaceBy } from "@uiball/loaders";
import { useEffect, useState } from "react";

const OnboardingThirdStage = ({
	id,
	classes,
	bsLoading,
}: {
	id: OnboardingState;
	classes: AllClasses | undefined;
	bsLoading: boolean;
}) => {
	const [bsLoadingLabel, setBsLoadingLabel] = useState("");

	const bsLoadingLabels = [
		"Customizing your experiance",
		"Fetching classes",
		"Configuring your profile",
		"Tailoring your preferences",
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setBsLoadingLabel((label) => {
				const i = bsLoadingLabels.findIndex((l) => l == label);
				return bsLoadingLabels[i == bsLoadingLabels.length - 1 ? 0 : i + 1];
			});
		}, 1300);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (id != OnboardingState.ThirdStage || !classes) return;

	if (bsLoading) {
		return (
			<div className="flex flex-col justify-center items-center text-gray-200 py-8">
				<RaceBy speed={0.8} size={170} color="white" />
				<h2 className="font-semibold text-lg text-gray-800 dark:text-white mt-8">
					{bsLoadingLabel}...
				</h2>
			</div>
		);
	}

	return (
		<>
			<h2 className="text-2xl mb-6 font-semibold max-w-[16rem] ">
				Your classes
			</h2>
			<div className="gap-4 flex flex-col select-none">
				{classes
					.sort((a, b) => (a.class?.block ?? 0) - (b.class?.block ?? 0))
					.map((mappedClass) => {
						if (!mappedClass.class) return null;
						const teachers = mappedClass.class.class_users.filter(
							(user) => user.teacher
						);
						const mainTeacher = teachers.find(
							(teacher) => teacher.main_teacher
						);
						const teacher = mappedClass.class.users.find(
							(user) =>
								user.id ==
								(mainTeacher
									? mainTeacher.user_id
									: teachers.length > 0
										? teachers[0].user_id
										: "")
						);

						return (
							<OnboardClasses
								key={mappedClass.class.id}
								class_name={mappedClass.class.name}
								blockNum={mappedClass.class.block}
								color={mappedClass.class.color}
								teacherName={teacher?.full_name ?? "No Teacher Found"}
							/>
						);
					})}
			</div>
		</>
	);
};

export default OnboardingThirdStage;
