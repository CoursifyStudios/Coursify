import { Tab } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import Image from "next/image";
import { Fragment } from "react";
import Betatag from "../../components/misc/betatag";
import exampleGroupImg from "../../public/example-img.jpg";

const sport: NextPage = () => {
	return (
		<div className="mx-auto my-10 w-full max-w-screen-xl">
			<div className="flex flex-col">
				<div className="relative mb-6 h-48 w-full">
					<Image
						src={exampleGroupImg}
						alt="Example Image"
						className="rounded-xl object-cover object-center"
						fill
					/>
					<h1 className="title absolute  bottom-5 left-5 !text-4xl text-gray-200">
						Swim Team
					</h1>
				</div>
				<Tab.Group as="div" className="flex grow flex-col">
					<Tab.List as="div" className="mx-auto mb-6 flex space-x-6">
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md px-2 py-0.5 focus:outline-none ${
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
									className={`flex cursor-pointer items-center rounded-md px-2 py-0.5 focus:outline-none ${
										selected
											? "bg-gray-50 shadow-md shadow-black/25  "
											: "bg-gray-200"
									} text-lg font-semibold `}
								>
									Events
								</div>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md px-2 py-0.5 focus:outline-none ${
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
							<div className="flex">
								<h1 className="title mb-1">Weekly View</h1>
								<div className="ml-3 p-1">
									<Betatag />
								</div>
							</div>
							<div className="blur-sm">
								<div className="flex h-64 flex-grow space-x-6 rounded-xl py-2">
									<div className="grow rounded-xl bg-gray-200 px-3 text-center text-gray-700">
										<p className="mt-4">MON</p>
										<h2 className="title mb-6">16</h2>
										<div className="rounded-lg bg-green-200 py-0.5">
											<p className="text-green-600">Swim Practice</p>
										</div>
									</div>
									<div className="grow rounded-xl bg-gray-200 px-3 text-center text-gray-700">
										<p className="mt-4">TUE</p>
										<h2 className="title mb-6">17</h2>
										<div className="rounded-lg bg-green-200 py-0.5">
											<p className="text-green-600">Swim Practice</p>
										</div>
										<div className="my-1.5 rounded-lg bg-red-200 py-0.5">
											<p className="text-red-600">Soph Lifting</p>
										</div>
									</div>
									<div className="grow rounded-xl bg-gray-200 px-3 text-center text-gray-700">
										<p className="mt-4">WED</p>
										<h2 className="title mb-6">18</h2>
										<div className="rounded-lg bg-green-200 py-0.5">
											<p className="text-green-600">Swim Practice</p>
										</div>
									</div>
									<div className="grow rounded-xl bg-gray-200 px-3 text-center text-gray-700">
										<p className="mt-4">THUR</p>
										<h2 className="title mb-6">19</h2>
										<div className="rounded-lg bg-green-200 py-0.5">
											<p className="text-green-600">Swim Practice</p>
										</div>
										<div className="my-1.5 rounded-lg  bg-blue-200 py-0.5">
											<p className="text-blue-600">Mitty Meet Day</p>
										</div>
									</div>
									<div className="grow rounded-xl bg-gray-200 px-3 text-center text-gray-700">
										<p className="mt-4">FRI</p>
										<h2 className="title mb-6">20</h2>
										<div className="rounded-lg bg-green-200 py-0.5">
											<p className="text-green-600">Swim Practice</p>
										</div>
									</div>
								</div>
							</div>
							<div className="flex space-x-6">
								<div className="basis-1/2">
									<h1 className="title pt-5">Announcements</h1>
									<div className="my-6 rounded-xl bg-gray-200 p-4">
										<div className="flex items-center justify-between">
											<h2 className="text-2xl font-bold">
												Do not call me Andrew!!!
											</h2>
											<EllipsisVerticalIcon className="h-6 w-6" />
										</div>
										<div className="flex items-center pb-2 pt-1">
											<div className="inline-flex shrink-0 items-center rounded-full bg-gray-300 px-2.5 py-0.5">
												<div className="h-4 w-4 rounded-full bg-white"></div>
												<p className="ml-1.5 font-semibold text-neutral-700">
													Andrew Ng
												</p>
											</div>
											<p className="pl-2.5 text-gray-600">25 mins ago</p>
										</div>
										<p>
											As a coach, its important for my athletes to show respect
											and professionalism both on and off the field. Please
											refrain from calling me by my first name, Andrew, as it
											can create a sense of familiarity that isnt necessary in
											our relationship. Additionally, my friend Tony is not
											involved in our coaching dynamic, so please do not refer
											to him in any context during our training sessions or
											games. Lets focus on improving our skills and achieving
											our goals as a team.
										</p>
									</div>
								</div>
								<div>
									<h1 className="title pt-5">Members</h1>
								</div>
							</div>
						</Tab.Panel>
						<Tab.Panel></Tab.Panel>
						<Tab.Panel>
							Copy the member page from classes tbh and just reformat some stuff
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
			</div>
		</div>
	);
};

export default sport;
