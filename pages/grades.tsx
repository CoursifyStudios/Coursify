import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";

const EditorPage: NextPage = () => {
	return (
		<div className="mx-auto flex w-full max-w-screen-xl  flex-col px-4 py-2">
			<h1 className="title">Grades</h1>
			<div className="flex justify-between">
				{" "}
				<div className="h-32 w-1/4 rounded-xl bg-gray-200">
					<div className="mt-2 flex flex-col items-center justify-center space-x-2 p-4">
						<h1 className="text-4xl font-bold">3.92</h1>
						<p className="font-semibold">Cumulative unweighted GPA</p>
					</div>
				</div>
				<div className="h-32 w-1/4 rounded-xl bg-gray-200">
					<div className="flex flex-col items-center justify-center space-x-2 p-4">
						<h1 className="text-4xl font-bold">3.92</h1>
						<p className="font-semibold">Cumulative unweighted GPA</p>
					</div>
				</div>
				<div className="h-32 w-1/4 rounded-xl bg-gray-200">
					<div className="mt-2 flex flex-col items-center justify-center space-x-2 p-4">
						<h1 className="text-4xl font-bold">3.92</h1>
						<p className="font-semibold">Cumulative unweighted GPA</p>
					</div>
				</div>
			</div>

			<div className="w-full pt-12">
				<div className="w-full rounded-2xl">
					<Disclosure>
						{({ open }) => (
							<>
								<Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-200 px-4 py-2 text-left text-sm font-medium hover:bg-gray-200">
									<span>Summative</span>
									<ChevronUpIcon
										className={`${open ? "rotate-180 transform" : ""} h-5 w-5`}
									/>
								</Disclosure.Button>
								<Disclosure.Panel className="mt-1 flex rounded-xl px-4 pb-2  pt-4 text-sm"></Disclosure.Panel>
							</>
						)}
					</Disclosure>
					<Disclosure as="div" className="mt-2">
						{({ open }) => (
							<>
								<Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-200 px-4 py-2 text-left text-sm font-medium">
									<span>Formative</span>
									<ChevronUpIcon
										className={`${open ? "rotate-180 transform" : ""} h-5 w-5`}
									/>
								</Disclosure.Button>
								<Disclosure.Panel className="px-4 pb-2 pt-4 text-sm">
									More rows here
								</Disclosure.Panel>
							</>
						)}
					</Disclosure>
				</div>
			</div>
		</div>
	);
};

export default EditorPage;
