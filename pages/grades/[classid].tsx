import { Disclosure, Tab } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";

const EditorPage: NextPage = () => {
	function classNames(...classes: string[]) {
		return classes.filter(Boolean).join(" ");
	}
	return (
		<Tab.Group>
			<div className="mx-auto flex w-full max-w-screen-xl  flex-col px-4 py-2">
				<div className="mt-3 flex">
					<div className="w-full">
						<div className="w-full rounded-lg bg-gray-200 p-4 flex items-center justify-between">
							<div>
								<h1 className="font-bold text-4xl">Honors Biology</h1>
								<div className="text-xs">That one teacher component here</div>
							</div>
							<div className="flex">
								<h2 className="font-bold text-5xl">A</h2>
								<p className="place-self-end ml-3">93%</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Tab.Group>
	);
};

export default EditorPage;
