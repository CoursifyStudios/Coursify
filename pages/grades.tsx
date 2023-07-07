import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";

const EditorPage: NextPage = () => {
	return (
		<div className="mx-auto flex w-full max-w-screen-xl  flex-col px-4 py-2">
			<h1 className="title">Grades</h1>
			<div className="mt-3 flex">
				<div className="flex flex-col">
					<h1 className="text-lg font-semibold">Classes</h1>
					<div className="w-48 h-16 bg-gray-200">test</div>
				</div>
				<div className="w-full">
					<div className="flex justify-between">
						<div className="h-32 w-1/4 rounded-xl bg-gray-200">
							<div className="mt-2 flex flex-col items-center justify-center space-x-2 p-4">
								<h1 className="text-4xl font-bold">A</h1>
								<p className="font-semibold">wwefwef</p>
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
												className={`${
													open ? "rotate-180 transform" : ""
												} h-5 w-5`}
											/>
										</Disclosure.Button>
										<Disclosure.Panel className="mt-1 flex flex-col space-y-2 rounded-xl pb-2 pt-1 text-sm">
											<div className="flex w-full items-center  justify-between rounded-xl bg-gray-300 p-1 py-2 shadow-sm">
												<p className="ml-2 text-xs font-semibold">
													Ecolab Colunm Report
												</p>
												<p className="p-1 font-semibold">20/25</p>
											</div>
											<div className="flex w-full items-center  justify-between rounded-xl p-1 py-2 shadow-sm">
												<p className="ml-2 text-xs font-semibold">
													Disect a frog
												</p>
												<p className="p-1 font-semibold">25/25</p>
											</div>
											<div className="flex w-full items-center  justify-between rounded-xl bg-gray-300 p-1 py-2 shadow-sm">
												<p className="ml-2 text-xs font-semibold">
													DNA STR Analysis
												</p>
												<p className="p-1 font-semibold">18/20</p>
											</div>
										</Disclosure.Panel>
									</>
								)}
							</Disclosure>
							<Disclosure as="div" className="mt-2">
								{({ open }) => (
									<>
										<Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-200 px-4 py-2 text-left text-sm font-medium">
											<span>Formative</span>
											<ChevronUpIcon
												className={`${
													open ? "rotate-180 transform" : ""
												} h-5 w-5`}
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
			</div>
		</div>
	);
};

export default EditorPage;
