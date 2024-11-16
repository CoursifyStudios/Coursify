import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { Database } from "../../../lib/db/database.types";
import { Settings, useSettings } from "../../../lib/stores/settings";
import { Header } from "../components/header";
import { DropdownSection, ToggleSection } from "../components/sections";

const Theming: NextPage = () => {
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const { data: settings, set } = useSettings();

	const colorTypes: { id: string; name: string }[] = [
		{
			id: "system",
			name: "Same as System",
		},
		{
			id: "light",
			name: "Light Mode",
		},
		{
			id: "dark",
			name: "Dark Mode",
		},
	];

	const homepageAssignmentTypes: {
		id: Settings["homepageAssignments"];
		name: string;
	}[] = [
		{
			id: "all",
			name: "All",
		},
		{
			id: "student",
			name: "Student Only",
		},
		{
			id: "none",
			name: "None",
		},
	];

	const numberOfSchedulesToShow: {
		id: Settings["schedulesToShow"];
		name: string;
	}[] = [
		{
			id: "0",
			name: "0",
		},
		{
			id: "1",
			name: "1",
		},
		{
			id: "2",
			name: "2",
		},
		{
			id: "3",
			name: "3",
		},
		{
			id: "4",
			name: "4",
		},
		{
			id: "5",
			name: "5",
		},
		{
			id: "6",
			name: "6",
		},
		{
			id: "7",
			name: "7",
		},
	];

	const homepageViewTypes: { id: Settings["homepageView"]; name: string }[] = [
		{
			id: "auto",
			name: "Automatic",
		},
		{
			id: "tabbed",
			name: "Tabbed",
		},
		{
			id: "student",
			name: "Student Only",
		},
		{
			id: "teacher",
			name: "Teacher Only",
		},
	];

	return (
		<>
			<Header name="color" page={1}>
				Color
			</Header>
			<DropdownSection
				name="Color Mode"
				description="Change between dark and light mode."
				currentValue={colorTypes.find((t) => t.id == settings.theme)!}
				values={colorTypes}
				onChange={(value) => {
					set({
						theme: value.id as "dark" | "light" | "system",
					});
				}}
			/>
			<Header name="layout" page={1}>
				Layout
			</Header>
			<ToggleSection
				name="Compact Mode"
				beta={true}
				description="Slims down the user interface so as to fit more content on the screen." //not reccomended for anyone
				enabled={settings.compact}
				setEnabled={() =>
					set({
						compact: !settings.compact,
					})
				}
			/>
			<Header name="class" page={1}>
				Classes
			</Header>
			{/* Disabled */}
			{/* <ToggleSection
				name="Sort Classes by Schedule"
				description="Sort classes based on your schedule. When disabled, classes will be sorted by block number." //rearrangable classes hopefully coming soon TM
				enabled={settings.sortBySchedule}
				setEnabled={() =>
					set({
						sortBySchedule: !settings.sortBySchedule,
					})
				}
			/> */}
			<DropdownSection
				name="Homepage Classes View"
				description="Change the way classes are displayed on the homepage. By default, we sample your classes to determine which one fits best for you." //should be clarified
				currentValue={
					homepageViewTypes.find((view) => view.id == settings.homepageView)!
				}
				values={homepageViewTypes}
				onChange={(value) => {
					set({
						homepageView: value.id as Settings["homepageView"],
					});
				}}
			/>
			<DropdownSection
				name="Number of schedules to show"
				description="Choose how many days of schedules to show on your homepage. By default we show two."
				currentValue={
					numberOfSchedulesToShow.find(
						(theNumber) => theNumber.id == settings.schedulesToShow
					)!
				}
				values={numberOfSchedulesToShow}
				onChange={(value) =>
					set({ schedulesToShow: value.id as Settings["schedulesToShow"] })
				}
			/>
			<Header name="assignment" page={1}>
				Assignments
			</Header>
			<DropdownSection
				name="Homepage Assignments View"
				description="Change the way assignments are displayed on the homepage. By default, we sample your classes to determine which one fits best for you."
				currentValue={
					homepageAssignmentTypes.find(
						(view) => view.id == settings.homepageAssignments
					)!
				}
				values={homepageAssignmentTypes}
				onChange={(value) => {
					set({
						homepageAssignments: value.id as Settings["homepageAssignments"],
					});
				}}
			/>
			<Header name="time" page={1}>
				Time
			</Header>
			<ToggleSection
				name="Show AM/PM markers"
				beta={true}
				description="Displays AM and PM markings next to times"
				enabled={settings.showAMPM}
				setEnabled={() =>
					set({
						showAMPM: !settings.showAMPM,
					})
				}
			></ToggleSection>
		</>
	);
};

export default Theming;
