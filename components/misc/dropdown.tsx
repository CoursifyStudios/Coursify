import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { Fragment, ReactNode } from "react";

const Dropdown: NextPage<{
	selectedValue: Partial<{ name: string }>;
	onChange: (value: any) => void;
	values: Partial<{ name: string }>[];
	className?: string;
}> = ({ values, selectedValue, onChange, className }) => {
	return (
		<Listbox
			value={selectedValue}
			onChange={onChange}
			as="div"
			className={`z-20 ${className} flex flex-col items-center`}
		>
			<Listbox.Button className="brightness-hover flex items-center rounded-lg bg-gray-200  px-2 py-1 font-semibold">
				{selectedValue.name}
				<ChevronUpDownIcon className="ml-2 h-5 w-5" />
			</Listbox.Button>
			<Transition
				as={Fragment}
				enter="transition ease-in-out duration-300"
				enterFrom="scale-95 opacity-0"
				enterTo="scale-100 opacity-100"
				leave="transition ease-in duration-100"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<Listbox.Options className="absolute mt-12 space-y-2 rounded-xl bg-white/75 p-2 backdrop-blur-xl dark:bg-gray-200/75 ">
					{values.map((type, i) => (
						<Listbox.Option
							key={i}
							value={type}
							className="brightness-hover cursor-pointer rounded-lg px-2 py-1 font-medium text-gray-700 transition hover:bg-gray-200 hover:text-gray-900 dark:hover:text-white"
						>
							{type.name}
						</Listbox.Option>
					))}
				</Listbox.Options>
			</Transition>
		</Listbox>
	);
};

export default Dropdown;
