import { NextPage } from "next";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { ColoredPill } from "../../components/misc/pill";
import Image from "next/image";
import exampleGroupImg from "../../public/example-img.jpg";
import {
	EllipsisVerticalIcon,
	FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const Group: NextPage = () => {
	const router = useRouter();
	const { groupid } = router.query;
	return (
		<div className="mx-auto my-10 w-full max-w-screen-xl">
			<div className="relative mb-6 h-48 w-full">
				<Image
					src={exampleGroupImg}
					alt="Example Image"
					className="rounded-xl object-cover object-center"
					fill
				/>
				<h1 className="title absolute  bottom-5 left-5 !text-4xl text-gray-200">
					Badminton Club
				</h1>
			</div>
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
									Resources
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
							<div className="mb-6 rounded-xl bg-gray-200 p-4">
								<p className="text-lg">
									Welcome to our high school badminton club! Our club is
									designed for students who are interested in playing badminton
									and want to improve their skills. We meet every weekday
									morning during the founders period in the school gymnasium. We
									provide all necessary equipment, including rackets and
									shuttlecocks, so all you need to bring is your enthusiasm and
									a willingness to learn. (had a different system for links and
									items then lukas made the chips feature)
								</p>
							</div>
							<h2 className="title mb-3">Announcements</h2>
							<div className="space-y-3">
								<div className="rounded-xl bg-gray-200 p-4">
									<div className="flex items-center justify-between">
										<h2 className="text-2xl font-bold">
											Selling Lots of Books !!!!!
										</h2>
										<EllipsisVerticalIcon className="h-6 w-6" />
									</div>
									<div className="flex items-center pt-1 pb-2">
										<div className="inline-flex shrink-0 items-center rounded-full bg-gray-300 px-2.5 py-0.5">
											<div className="h-4 w-4 rounded-full bg-white"></div>
											<p className="ml-1.5 font-semibold text-neutral-700">
												Jane Doe
											</p>
										</div>
										<p className="pl-2.5 text-gray-600">25 mins ago</p>
									</div>
									<p>
										I am selling some books for English classes. Literature in
										Science: The Immortal Life of Henrietta Lacks by Rebecca
										Skloot hardcover Being Human: Core Readings in the
										Humanities edited by Leon Kass paperback English 3,4: A
										Raisin in the Sun by Lorraine Hansberry paperback All books
										are in new condition and have no annotations. If interested,
										contact me at holy shit that{"'"}s someone{"'"}s actual information
									</p>
									<div className="mt-4 flex items-center justify-between">
										<div className="mr-24 flex-grow items-center rounded-full bg-gray-300 p-1">
											<p className="ml-1.5 p-1">Insert response here</p>
										</div>
										<div className="rounded-full bg-gray-300 p-2">
											<FaceSmileIcon className="h-6 w-6" />
										</div>
									</div>
								</div>
								<div className="rounded-xl bg-gray-200 p-4">
									<div className="flex items-center justify-between">
										<h2 className="text-2xl font-bold">
											Selling Lots of Books !!!!!
										</h2>
										<EllipsisVerticalIcon className="h-6 w-6" />
									</div>
									<div className="flex items-center pt-1 pb-2">
										<div className="inline-flex shrink-0 items-center rounded-full bg-gray-300 px-2.5 py-0.5">
											<div className="h-4 w-4 rounded-full bg-white"></div>
											<p className="ml-1.5 font-semibold text-neutral-700">
												Jane Doe
											</p>
										</div>
										<p className="pl-2.5 text-gray-600">25 mins ago</p>
									</div>
									<p>
										I am selling some books for English classes. Literature in
										Science: The Immortal Life of Henrietta Lacks by Rebecca
										Skloot hardcover Being Human: Core Readings in the
										Humanities edited by Leon Kass paperback English 3,4: A
										Raisin in the Sun by Lorraine Hansberry paperback All books
										are in new condition and have no annotations. If interested,
										contact me at whoa there
									</p>
									<div className="mt-4 flex items-center justify-between">
										<div className="mr-24 flex-grow items-center rounded-full bg-gray-300 p-1">
											<p className="ml-1.5 p-1">Insert response here</p>
										</div>
										<div className="rounded-full bg-gray-300 p-2">
											<FaceSmileIcon className="h-6 w-6" />
										</div>
									</div>
								</div>
							</div>
						</Tab.Panel>
						<Tab.Panel></Tab.Panel>
						<Tab.Panel>Copy member component from classes</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
				<div className="sticky top-0 ml-8 w-[20.5rem] shrink-0 ">
					<h2 className="title">Next Event</h2>
					<Event title="Badminton" time="8:00 - 9:30 AM"></Event>
					<h2 className="title mt-6 mb-6">Upcoming</h2>
					<Event title="Badminton outside" time="12/15/22"></Event>
					<Event title="Badminton in the Pavillion" time="1/8/23"></Event>
					<Event title="Badminton in the Gym" time="12/9/24"></Event>
				</div>
			</div>
		</div>
	);
};

const Event = ({ title, time }: { title: string; time: string }) => {
	return (
		<div className="mt-6 flex items-center justify-between rounded-xl bg-gray-200 p-4">
			<p className="font-semibold">{title}</p>
			<div className="">
				<ColoredPill color={"green"}>{time}</ColoredPill>
			</div>
		</div>
	);
};

export default Group;
