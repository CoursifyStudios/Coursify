import { ProfilesResponse } from "@/lib/db/profiles";
import { OnboardingState } from "@/middleware";
import { Dispatch, SetStateAction } from "react";
import { ColoredPill } from "../misc/pill";
import CheckBox from "../complete/assignments/assignmentPanel/components/checkbox";

const OnboardingSecondStage = ({
	id,
	userData,
	newData,
	setNewData,
}: {
	id: OnboardingState;
	userData: Exclude<ProfilesResponse["data"], null | undefined>;
	newData: NewUserData;
	setNewData: Dispatch<SetStateAction<NewUserData>>;
}) => {
	if (id != OnboardingState.SecondStage) return;

	return (
		<>
			<h2 className="text-2xl mb-6 font-semibold max-w-[16rem] ">
				Let{"'"}s get to know you better
			</h2>
			<div className="gap-4 flex flex-col select-none">
				<label htmlFor="" className="flex flex-col">
					<span className="label-text flex items-end !mb-1">
						Preferred First Name{" "}
						<ColoredPill
							color="gray"
							className="!bg-opacity-25 border border-white/10 text-xs ml-1.5"
						>
							Optional
						</ColoredPill>
					</span>
					<input
						type="text"
						className="grow noinputcss onboardingInput"
						onChange={(v) =>
							setNewData((data) => ({
								...data,
								preferred_name: v.target.value,
							}))
						}
					/>
				</label>
				<label htmlFor="" className="flex flex-col">
					<span className="label-text">Bio</span>
					<input
						type="text"
						className="grow noinputcss onboardingInput"
						value={newData.bio ?? undefined}
						onChange={(v) => {
							if (v.target.value.length <= 50)
								setNewData((data) => ({ ...data, bio: v.target.value }));
						}}
					/>
					<div className="text-xs ml-auto">{newData.bio?.length ?? 0} / 50</div>
				</label>

				<label htmlFor="" className="flex flex-col -mt-4">
					<span className="label-text">Phone Number</span>
					<input
						type="text"
						className="grow noinputcss onboardingInput"
						value={
							newData.phone_number
								? convertToPhoneNumber(newData.phone_number)
								: undefined
						}
						onChange={(v) => {
							if (v.target.value.length < 50)
								setNewData((data) => ({
									...data,
									phone_number: v.target.value,
								}));
						}}
					/>
				</label>
				<div className="flex">
					<input type="checkbox" className="!bg-backdrop/25 !border " />
					<p className="text-xs font-medium ml-4">
						By providing Coursify with your phone number, you consent to
						receiving important information and notices from your enrolled
						schools and Coursify via SMS
					</p>
				</div>
			</div>
		</>
	);
};

export default OnboardingSecondStage;

function convertToPhoneNumber(inputNumber: string): string {
	// Convert the number to a string to process each digit
	const numString = inputNumber.replace(/\D/g, "");

	let formattedNumber = "";

	if (numString.length <= 10) {
		// If the number is 10 digits or less, it does not have a country code
		const areaCode = numString.slice(0, 3);
		const remainingDigits = numString.slice(3);

		formattedNumber = `(${areaCode}${numString.length > 3 ? ")" : ""}`;

		if (remainingDigits.length > 0) {
			formattedNumber += ` ${remainingDigits.slice(0, 3)}`;

			if (remainingDigits.length > 3) {
				formattedNumber += `-${remainingDigits.slice(3)}`;
			}
		}
	} else {
		// If the number is more than 10 digits, it has a country code
		const countryCode = numString.slice(0, numString.length - 10);
		const areaCode = numString.slice(
			numString.length - 10,
			numString.length - 7
		);
		const remainingDigits = numString.slice(numString.length - 7);

		formattedNumber = `+${countryCode} (${areaCode})`;

		if (remainingDigits.length > 0) {
			formattedNumber += ` ${remainingDigits.slice(0, 3)}`;

			if (remainingDigits.length > 3) {
				formattedNumber += `-${remainingDigits.slice(3)}`;
			}
		}
	}

	return formattedNumber;
}
