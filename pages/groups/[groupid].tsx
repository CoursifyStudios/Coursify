import { NextPage } from "next";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { ColoredPill } from "../../components/misc/pill";

const group: NextPage = () => {
	return (
		<div className="mx-auto my-10 w-full max-w-screen-xl">
			<div className="flex">
				<Tab.Group as="div" className="flex grow flex-col">
					<Tab.List as="div" className="mx-auto mb-6 flex space-x-6">
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2 focus:outline-none ${
										selected
											? "bg-gray-50 shadow-md shadow-black/25  "
											: "bg-gray-200"
									} text-lg font-semibold `}
								>
									Home
								</div>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2 focus:outline-none ${
										selected
											? "bg-gray-50 shadow-md shadow-black/25  "
											: "bg-gray-200"
									} text-lg font-semibold `}
								>
									Announcements
								</div>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2 focus:outline-none ${
										selected
											? "bg-gray-50 shadow-md shadow-black/25  "
											: "bg-gray-200"
									} text-lg font-semibold `}
								>
									Members
								</div>
							)}
						</Tab>
					</Tab.List>
					<Tab.Panels>
						<Tab.Panel>
							<div className="rounded-xl bg-gray-200 p-4">
								A group description and more information about the group would
								go here. Could also contain links to instagrams and stuff/other
								relevant shit
							</div>
							<h2 className="title mt-6">Quick Access</h2>
						</Tab.Panel>
						<Tab.Panel>
							Announcments would be here when I figure them out
						</Tab.Panel>
						<Tab.Panel>
							Copy the member page from classes tbh and just reformat some stuff
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
				<div className="sticky top-0 ml-8 w-[20.5rem] shrink-0 ">
					<h2 className="title">Next Event</h2>
					<Event
						title="Badminton in the Pavillion"
						date="Today"
						time="8:00 - 9:30 AM"
					></Event>
					<h2 className="title mt-6 mb-6">Upcoming</h2>
					<Event
						title="Badminton outside"
						date="12/18/22"
						time="8:00 - 9:30 AM"
					></Event>
					<Event
						title="Badminton in the Pavillion"
						date="01/18/23"
						time="8:00 - 9:30 AM"
					></Event>
					<Event
						title="Badminton in the Gym"
						date="02/13/23"
						time="8:00 - 9:30 AM"
					></Event>
				</div>
			</div>
		</div>
	);
};

const Event = ({
	title,
	date,
	time,
}: {
	title: string;
	date: string;
	time: string;
}) => {
	return (
		<div className="mt-6 rounded-xl bg-gray-200 p-4">
			<p className="font-semibold">{title}</p>
			<div className="mt-1.5 flex">
				<ColoredPill color={"light green"}>{date}</ColoredPill>
				<div className="ml-4">
					<ColoredPill color={"green"}>{time}</ColoredPill>
				</div>
			</div>
		</div>
	);
};

export default group;
