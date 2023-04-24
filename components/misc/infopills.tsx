import { Listbox, Popover, Transition } from "@headlessui/react";
import {
	CalendarDaysIcon,
	ChatBubbleOvalLeftEllipsisIcon,
	ChevronUpDownIcon,
	DocumentIcon,
	FolderIcon,
	LinkIcon,
	MusicalNoteIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { Field, Form, Formik } from "formik";
import { NextPage } from "next";
import Link from "next/link";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { Button } from "./button";
import { ColoredPill } from "./pill";

export const InfoPills: NextPage<{
	allPills: InfoPill[];
	updatePills: (data: InfoPill[]) => void;
	isTeacher: boolean;
}> = ({ allPills, updatePills, isTeacher }) => {
	const [pills, setPills] = useState(allPills);
	const [selectedIcon, setSelectedIcon] = useState(Icons[0]);
	const [selectedColor, setSelectedColor] = useState(colors[0]);
	const [newName, setNewName] = useState<string>();
	const [link, setLink] = useState<string>();

	useEffect(() => {
		setPills(allPills);
	}, [allPills]);

	const newPill = (pill: InfoPill) => {
		setPills((newPills) => {
			newPills.push(pill);
			updatePills(newPills);
			return newPills;
		});
	};

	const deletePill = async (pill: InfoPill) => {
		const toRemove = pills.findIndex((currentPill) => currentPill == pill);
		const newPills = pills.filter((_, i) => i !== toRemove);
		setPills(newPills);
		updatePills(newPills);
	};

	return (
		<>
			{pills.length > 0 &&
				pills.map((pill, i) => (
					<div className="group relative" key={i}>
						{pill.link ? (
							<a href={pill.link} target="_blank" className="" rel="noreferrer">
								<ColoredPill
									color={pill.color}
									className="h-7 items-center space-x-2"
									hoverState
								>
									<IconConverter.toIcon str={pill.icon} />
									<span className="ml-2">{pill.name}</span>
								</ColoredPill>
							</a>
						) : (
							<ColoredPill color={pill.color} className="h-7 items-center">
								<IconConverter.toIcon str={pill.icon} />
								<span className="ml-2">{pill.name}</span>
							</ColoredPill>
						)}
						{isTeacher && (
							<div
								onClick={() => deletePill(pill)}
								className={`absolute bottom-1 right-2 top-1 my-auto hidden h-4 w-4 cursor-pointer place-items-center rounded bg-black/50 text-white group-hover:flex`}
							>
								<XMarkIcon className="h-4 w-4" />
							</div>
						)}
					</div>
				))}
			{isTeacher && (
				<Popover className="relative flex items-center">
					<Popover.Button>
						<ColoredPill
							color="gray"
							className={`${
								pills.length > 0 && "aspect-square !px-0"
							} h-7 cursor-pointer items-center justify-center `}
							hoverState
						>
							<PlusIcon className="h-5 w-5" />{" "}
							{pills.length == 0 && <span className="ml-2">Add InfoPill</span>}
						</ColoredPill>
					</Popover.Button>
					<Transition
						enter="transition duration-100 ease-out"
						enterFrom=" scale-95 opacity-0 -translate-x-6"
						enterTo=" scale-100 opacity-100"
						leave="transition duration-100 ease-out"
						leaveFrom=" scale-100 opacity-100"
						leaveTo=" scale-95 opacity-0"
						as={Fragment}
					>
						<Popover.Panel
							className={`absolute z-10 ${
								pills.length == 0 ? "ml-32" : "ml-10"
							} flex items-center rounded-xl bg-gray-200/75 px-4 py-2 backdrop-blur-xl`}
						>
							{({ close }) => (
								<>
									<Listbox
										value={selectedIcon}
										onChange={setSelectedIcon}
										as="div"
										className="relative flex items-center"
									>
										<Listbox.Button className="flex items-center">
											{selectedIcon}
											<ChevronUpDownIcon className="h-4 w-4" />
										</Listbox.Button>
										<Listbox.Options className="absolute bottom-8 z-20 -translate-x-2 space-y-2 rounded-lg bg-gray-300/75 p-1 backdrop-blur-xl">
											{Icons.map((icon, i) => (
												<Listbox.Option
													key={i}
													value={icon}
													className=" cursor-pointer rounded-lg p-1.5 hover:bg-gray-300"
												>
													{icon}
												</Listbox.Option>
											))}
										</Listbox.Options>
									</Listbox>
									<div>
										<input
											type="text"
											className="mx-1.5  mb-1 w-44 rounded-lg border-none bg-gray-100 px-2 py-0.5 text-sm font-medium shadow"
											placeholder="InfoPill name"
											onChange={(e) => setNewName(e.target.value)}
										/>
										<input
											type="text"
											className="mx-1.5 w-44 rounded-lg border-none bg-gray-100 px-2 py-0.5 text-sm font-medium shadow"
											placeholder="Optional Link"
											onChange={(e) => setLink(e.target.value)}
										/>
									</div>
									<Listbox
										value={selectedColor}
										onChange={setSelectedColor}
										as="div"
										className="relative flex items-center"
									>
										<Listbox.Button className="flex items-center">
											<div
												className={`h-5 w-5 bg-${selectedColor.name}-200 rounded-full`}
											/>
											<ChevronUpDownIcon className="h-4 w-4" />
										</Listbox.Button>
										<Listbox.Options className="absolute bottom-8 z-20 -translate-x-2 space-y-2 rounded-lg bg-gray-300/75 p-1 backdrop-blur-xl">
											{colors.map((color, i) => (
												<Listbox.Option
													key={i}
													value={color}
													as="div"
													className=" cursor-pointer rounded-lg p-1.5 hover:bg-gray-300"
												>
													<div
														className={`h-5 w-5 bg-${color.name}-200 rounded-full`}
													/>
												</Listbox.Option>
											))}
										</Listbox.Options>
									</Listbox>
									<span
										onClick={() => {
											if (!newName || newName.length >= 20) return;
											close();
											newPill({
												color: selectedColor.name,
												icon: IconConverter.toString(selectedIcon),
												name: newName,
												link: link,
											} as InfoPill);
											setNewName("");
											setLink("");
										}}
									>
										<Button
											className={`ml-2.5   text-sm ${
												newName && newName?.length < 20
													? "!bg-blue-500 text-gray-200"
													: "text-gray-500"
											} `}
										>
											Add
										</Button>
									</span>
								</>
							)}
						</Popover.Panel>
					</Transition>
				</Popover>
			)}
		</>
	);
};

export interface InfoPill {
	name: string;
	link?: string;
	icon: "doc" | "link" | "chat" | "calender" | "folder" | "music";
	color: "blue" | "green" | "purple" | "red" | "yellow" | "orange" | "gray";
}

const className = "h-5 w-5";

const Icons = [
	<DocumentIcon className={className} key={1} />,
	<LinkIcon className={className} key={2} />,
	<ChatBubbleOvalLeftEllipsisIcon className={className} key={3} />,
	<CalendarDaysIcon className={className} key={4} />,
	<FolderIcon className={className} key={5} />,
	<MusicalNoteIcon className={className} key={6} />,
];

const IconStrings = ["doc", "link", "chat", "calendar", "folder", "music"];

const colors = [
	{ id: 1, name: "blue" },
	{ id: 2, name: "green" },
	{ id: 3, name: "purple" },
	{ id: 4, name: "red" },
	{ id: 5, name: "yellow" },
	{ id: 6, name: "orange" },
	{ id: 7, name: "gray" },
];

export const IconConverter = {
	toString: (icon: JSX.Element) => IconStrings[Icons.indexOf(icon)],
	toIcon: ({ str }: { str: InfoPill["icon"] }) =>
		Icons[IconStrings.indexOf(str)],
};
