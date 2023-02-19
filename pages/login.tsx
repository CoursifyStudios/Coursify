import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Database } from "../lib/db/database.types";
import Image from "next/image";
import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Login() {
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const router = useRouter();
	const { redirectedFrom } = router.query;
	const [url, setUrl] = useState<string>();

	if (user) {
		if (typeof redirectedFrom == "string")
			router.push(decodeURI(redirectedFrom));
		else router.push("/");
	}

	useEffect(() => {
		setUrl(window.location.origin);
	}, []);

	let [isOpen, setIsOpen] = useState(false);

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}
	return (
		<div className="flex h-screen bg-teal-500 [background-image:url('/svgs/falling-triangles.svg')]">
			<div className=" md:grow "></div>
			<div className="mx-10 my-auto flex flex-grow flex-col items-center justify-center rounded-lg bg-white py-20 md:mx-0 md:my-0 md:max-w-xl md:basis-1/3 md:rounded-none md:py-0">
				<h1 className="mb-14 text-3xl font-bold">Welcome Back</h1>
				<div className="flex flex-col">
					<button
						className="mb-8 flex rounded-md bg-gray-200 px-4 py-3 text-[1.05rem] font-medium	hover:bg-gray-300"
						onClick={() =>
							supabaseClient.auth.signInWithOAuth({
								provider: "google",
								options: {
									redirectTo:
										typeof redirectedFrom == "string" &&
										decodeURI(redirectedFrom) != "/"
											? url + redirectedFrom
											: url,
								},
							})
						}
					>
						<Image
							src="/brand-logos/google.svg"
							alt="Google Logo"
							width={25}
							height={25}
							className="mr-4"
						/>
						Continue with Google
					</button>
					<button
						className="flex rounded-md bg-gray-200 px-4 py-3 text-[1.05rem] font-medium grayscale"
						onClick={openModal}
					>
						<Image
							src="/brand-logos/microsoft.svg"
							alt="Microsoft Logo"
							width={25}
							height={25}
							className="mr-4"
						/>
						Continue with Microsoft
					</button>
					<Transition appear show={isOpen} as={Fragment}>
						<Dialog as="div" className="relative z-10" onClose={closeModal}>
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0"
								enterTo="opacity-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<div className="fixed inset-0 bg-black bg-opacity-25" />
							</Transition.Child>

							<div className="fixed inset-0 overflow-y-auto">
								<div className="flex min-h-full items-center justify-center p-4 text-center">
									<Transition.Child
										as={Fragment}
										enter="ease-out duration-300"
										enterFrom="opacity-0 scale-95"
										enterTo="opacity-100 scale-100"
										leave="ease-in duration-200"
										leaveFrom="opacity-100 scale-100"
										leaveTo="opacity-0 scale-95"
									>
										<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
											<Dialog.Title
												as="h3"
												className="text-center text-lg font-bold leading-6 text-gray-900"
											>
												Microsoft Login Not Supported
											</Dialog.Title>
											<div className="mt-2">
												<p className="text-center text-sm text-gray-500">
													We&apos;re sorry, but we currently don&apos;t support
													Microsoft Login at this time. Please continue with
													Google.
												</p>
											</div>

											<div className="mt-4 text-center">
												<button
													type="button"
													className="inline-flex rounded-md border border-transparent bg-teal-100 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
													onClick={closeModal}
												>
													Understood, thanks!
												</button>
											</div>
										</Dialog.Panel>
									</Transition.Child>
								</div>
							</div>
						</Dialog>
					</Transition>
				</div>
			</div>
		</div>
	);
}
