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
			name: "System Default",
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

	const homepageViewTypes: { id: Settings["homepageView"]; name: string }[] = [
		{
			id: "auto",
			name: "Automagically",
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
				description="Compacts down element in order to have more room on the screen. Recommended for power users."
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
			<ToggleSection
				name="Sort Classes by Schedule"
				description="Sort classes based on your schedule and day. If off, it sorts by block number."
				enabled={settings.sortBySchedule}
				setEnabled={() =>
					set({
						sortBySchedule: !settings.sortBySchedule,
					})
				}
			/>
			<DropdownSection
				name="Classes on Homepage View"
				description="Change the way you view classes on the homepage. By default, we sample your classes to determine which one fits best for you."
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
			<Header name="assignment" page={1}>
				Assignments
			</Header>
			<DropdownSection
				name="Assignments on Homepage View"
				description="Change the way you view classes on the homepage. By default, we sample your classes to determine which one fits best for you."
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
		</>
	);
};

export default Theming;
