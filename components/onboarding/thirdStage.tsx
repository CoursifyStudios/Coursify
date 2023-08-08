import { AllClasses } from "@/lib/db/classes";
import { OnboardingState } from "@/middleware";
import OnboardClasses from "./onboardingClass";

const OnboardingThirdStage = ({
	id,
	classes,
	bsLoading,
}: {
	id: OnboardingState;
	classes: AllClasses | undefined;
	bsLoading: boolean;
}) => {
	if (id != OnboardingState.ThirdStage || !classes) return;

	if (bsLoading) {
		return (
			<div>
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloribus quod
				quia officiis. Nisi impedit exercitationem dolorem, reprehenderit,
				officia odit neque adipisci architecto repudiandae suscipit quam cum?
				Incidunt provident autem suscipit!
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
