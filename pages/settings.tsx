import { NextPage } from "next";
import { useSettings } from "../lib/stores/settings";
import { Toggle } from "../components/misc/toggle";
import { useRouter } from "next/router";
import { useState } from "react";
import { Tab } from "@headlessui/react";
import { settingsPages } from "../components/settings";

/**
 * Edit settings on /components/settings
 */

const Settings: NextPage = () => {
	const router = useRouter();

	return (
		<div className="container mx-auto mb-10 flex w-full max-w-screen-xl flex-col items-start space-y-5 break-words px-4 sm:mt-10 md:px-8 xl:px-0">
			<div className="flex w-full flex-col">
				<h1 className="title mb-4">Settings</h1>
				<Tab.Group as="div" className="flex grow flex-row">
					<Tab.List as="div" className="flex w-56 flex-col gap-4">
						{settingsPages.map((page) => (
							<Tab key={page.name} as="button" className="focus:outline-none">
								{({ selected }) => (
									<div
										className={`flex items-center justify-between rounded-lg border bg-backdrop-200  px-3 py-1.5 font-medium ${
											selected
												? "brightness-focus"
												: "brightness-hover border-transparent"
										}`}
									>
										{page.name}
										{page.icon}
									</div>
								)}
							</Tab>
						))}
					</Tab.List>

					<Tab.Panels className="grow">
						{settingsPages.map((page) => (
							<Tab.Panel
								as="div"
								className="ml-10 flex grow flex-col"
								key={page.name}
							>
								{page.content}
							</Tab.Panel>
						))}
					</Tab.Panels>
				</Tab.Group>
			</div>
		</div>
	);
};

export default Settings;
