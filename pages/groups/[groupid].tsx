import { NextPage } from "next";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";

const group: NextPage = () => {
	return (
		<div className="mx-auto my-10 w-full max-w-screen-xl">
			<div className="flex">
				<Tab.Group as="div" className="flex grow flex-col">
					<Tab.List as="div" className="mx-auto mb-6 flex space-x-6">
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2 ${
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
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2 ${
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
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2 ${
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
					<div className="mt-6 rounded-xl bg-gray-200 p-4">
						event details here
					</div>
					<h2 className="title mt-6 mb-6">Upcoming</h2>
				</div>
			</div>
		</div>
	);
};

export default group;
