import { ProfilesResponse } from "@/lib/db/profiles";
import { OnboardingState } from "@/middleware";

const OnboardingFirstStage = ({
	id,
	userData,
}: {
	id: OnboardingState;
	userData: Exclude<ProfilesResponse["data"], null | undefined>;
}) => {
	if (id != OnboardingState.FirstStage) return;

	return (
		<>
			<h2 className="text-2xl mb-6 font-semibold max-w-[16rem] ">
				Let{"'"}s confirm some basic details
			</h2>
			<div className="gap-4 flex flex-col select-none cursor-not-allowed">
				<label htmlFor="" className="flex flex-col cursor-not-allowed">
					<span className="label-text">Name</span>
					<input
						type="text"
						className="grow noinputcss onboardingInput cursor-not-allowed"
						value={userData.full_name}
						disabled={true}
					/>
				</label>
				{userData.student_id && (
					<label htmlFor="" className="flex flex-col cursor-not-allowed">
						<span className="label-text">Student ID</span>
						<input
							type="text"
							className="grow noinputcss onboardingInput cursor-not-allowed"
							value={userData.student_id}
							disabled={true}
						/>
					</label>
				)}
				{userData.year && (
					<label htmlFor="" className="flex flex-col cursor-not-allowed">
						<span className="label-text">Graduation Year</span>
						<input
							type="text"
							className="grow noinputcss onboardingInput cursor-not-allowed"
							value={userData.year}
							disabled={true}
						/>
					</label>
				)}
			</div>
		</>
	);
};

export default OnboardingFirstStage;
