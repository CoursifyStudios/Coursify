import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "./button";

export function ConfirmDialog({
	show,
	setShow,
	text,
	onConfirm,
}: {
	show: boolean;
	setShow: (value: boolean) => void;
	text: string;
	onConfirm: (value: unknown) => unknown;
}) {
	return (
		<Transition appear show={show} as={Fragment}>
			<Dialog open={show} onClose={() => setShow(false)}>
				<Transition.Child
					enter="ease-out transition"
					enterFrom="opacity-75"
					enterTo="opacity-100 scale-100"
					leave="ease-in transition"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-75"
					as={Fragment}
				>
					<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 p-4">
						<Transition.Child
							enter="ease-out transition"
							enterFrom="opacity-75 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in transition"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-75 scale-95"
							as={Fragment}
						>
							<Dialog.Panel className="relative w-full max-w-lg rounded-xl bg-white/90 p-4 shadow-md backdrop-blur-xl">
								<p>{text}</p>
								<div className="ml-auto space-x-3">
									<Button className="brightness-hover transition hover:bg-red-300">
										Cancel
									</Button>
									<Button onClick={() => onConfirm}>Confirm</Button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Transition.Child>
			</Dialog>
		</Transition>
	);
}

