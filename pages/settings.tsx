import { Tab } from "@headlessui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { settingsPages } from "../components/settings";

/**
 * Edit settings on /components/settings
 */

const Settings: NextPage = () => {
	const [currentTab, setCurrentTab] = useState(0);
	const router = useRouter();
	const { page, category } = router.query;

	useEffect(() => {
		if (typeof page == "string") {
			setCurrentTab(parseInt(page));
			if (typeof category == "string") {
				// This setInterval isn't ideal, but useLayoutEffect doens't seem to work
				const interval = setInterval(() => {
					const name = document.getElementById(category);
					if (name) {
						name.scrollIntoView({ behavior: "smooth" });
						clearInterval(interval);
					}
				}, 100);
			}
		}
	}, [page, category]);

	const setTab = (tab: number) => {
		setCurrentTab(tab);
		router.push("/settings");
	};

	return (
		<div className="container mx-auto mb-10 flex w-full max-w-screen-xl flex-col space-y-5 break-words px-4 sm:mt-10 md:px-8 xl:px-0">
			<div className="">
				<Tab.Group
					as="div"
					className="relative flex w-full grow flex-row"
					vertical
					selectedIndex={currentTab}
					onChange={setTab}
				>
					<div>
						<h1 className="title sticky top-4 h-16">Settings</h1>

						<Tab.List
							as="div"
							className="sticky top-20 flex w-56 flex-col gap-4"
						>
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
					</div>
					<Tab.Panels className="mt-16 w-full grow">
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
