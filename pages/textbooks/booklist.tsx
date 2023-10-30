import { getTextbooks } from "@/lib/db/textbooks";
import { NextPageWithLayout } from "../_app";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ReactElement, useEffect, useState } from "react";
import { Textbook } from "@/components/textbooks/textbook";
import Layout from "@/components/layout/layout";
import { Disclosure } from "@headlessui/react";
import {
	ChevronRightIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { TextbookNavbar } from "@/components/textbooks/navbar";

const Textbooks: NextPageWithLayout = () => {
	const supabase = useSupabaseClient();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [classFilters, setClassFilters] = useState<string[]>([]);
	const [adoptionFilter, setAdoptionFilter] = useState<string[]>([]);
	const [newOnlyFilter, setNewOnlyFilter] = useState<string[]>([]);
	const [books, setBooks] = useState<
		{
			id: string;
			subject: string;
			course: string;
			isbn: string;
			title: string;
			author: string | null;
			edition: string | null;
			publisher: string | null;
			adoption_level: string | null;
			new_only: string | null;
		}[]
	>([]);

	useEffect(() => {
		(async () => {
			const data = await getTextbooks(supabase, page);
			if (data.data) {
				setBooks(data.data);
			}
		})();
	}, [page, supabase]);

	return (
		<>
			<TextbookNavbar title="All books for SHC classes" />
			<div className="flex">
				<section className="bg-gray-200 w-80 sm:shrink-0 p-4 rounded-r-2xl">
					<p className="text-lg font-semibold">Filters:</p>
					{/* {filters.map((filter, i) => (
                <div key={i}>{filter}</div>
            ))} */}
					<div className="grid">
						<p className="mt-1 font-semibold">Class</p>
						{Array.from(new Set(books.map((book) => book.subject))).map(
							(subject, i) => (
								<Disclosure key={i}>
									{({ open }) => (
										<>
											<Disclosure.Button className="flex justify-between">
												{subject}
												<ChevronRightIcon
													className={
														open ? "rotate-90 transform h-5 w-5" : "h-6 w-5"
													}
												/>
											</Disclosure.Button>
											<Disclosure.Panel>
												<CheckboxList
													items={books.filter(
														(book) => book.subject == subject
													)}
													filter={classFilters}
													setFilter={setClassFilters}
													attribute={"course"}
												/>
											</Disclosure.Panel>
										</>
									)}
								</Disclosure>
							)
						)}
						<p className="mt-1 font-semibold">Adoption Level</p>
						<CheckboxList
							items={books}
							attribute={"adoption_level"}
							filter={adoptionFilter}
							setFilter={setAdoptionFilter}
						/>
						<p className="mt-1 font-semibold">New Only</p>
						<CheckboxList
							items={books}
							attribute={"new_only"}
							filter={newOnlyFilter}
							setFilter={setNewOnlyFilter}
						/>
					</div>
				</section>
				<section className="w-full max-w-screen-xl px-3">
					<div
						className={"relative flex grow items-center transition-all mb-4"}
					>
						<MagnifyingGlassIcon className="absolute left-3 h-4 w-4" />
						<input
							type="text"
							className="grow !rounded-xl py-0.5 placeholder:dark:text-gray-400 pl-8"
							placeholder="Search by Author, Title, ISBN or other attribute..."
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 grow gap-3">
						{books
							.filter(
								(book) =>
									(classFilters.includes(book.course) ||
										classFilters.length == 0) &&
									(adoptionFilter.includes(
										book.adoption_level ?? "Not Specified"
									) ||
										adoptionFilter.length == 0) &&
									(newOnlyFilter.includes(book.new_only ?? "Not Specified") ||
										newOnlyFilter.length == 0) &&
									(search.length == 0 ||
										Array.from([
											book.author ? book.author : "n/a",
											book.course,
											book.isbn,
											book.subject,
											book.title,
										]).some((someText) =>
											someText.toLowerCase().includes(search.toLowerCase())
										))
							)
							.map((book) => (
								<Textbook key={book.id} book={book} />
							))}
					</div>
					{/* dont need this */}
					<div className="flex justify-center mt-2">
						{Array.from(
							{ length: Math.ceil(books.length / 60.0) },
							(v, i) => i
						).map((aNumber) => (
							<button
								key={aNumber}
								className={
									"py-4 px-6 rounded-lg " +
									(page == aNumber + 1 && "bg-gray-200")
								}
								onClick={() => {
									if (aNumber + 1 != page) {
										setPage(aNumber + 1);
									}
								}}
							>
								{aNumber + 1}
							</button>
						))}
					</div>
				</section>
			</div>
		</>
	);
};

export default Textbooks;

Textbooks.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export const CheckboxList = ({
	items,
	attribute,
	filter,
	setFilter,
}: {
	// books: {
	//     id: string;
	//     subject: string;
	//     course: string;
	//     isbn: string;
	//     title: string;
	//     author: string | null;
	//     edition: string | null;
	//     publisher: string | null;
	//     adoption_level: string | null;
	//     new_only: string | null;
	// }[];
	// attribute:
	//     | "id"
	//     | "subject"
	//     | "course"
	//     | "isbn"
	//     | "title"
	//     | "author"
	//     | "edition"
	//     | "publisher"
	//     | "adoption_level"
	//     | "new_only";
	items: FilterableObject[];
	attribute: keyof FilterableObject;
	filter: string[];
	setFilter: (v: string[]) => void;
}) => {
	return (
		<div>
			{Array.from(new Set(items.map((item) => item[attribute]))).map(
				(actualAttribute, i) => (
					<div key={i} className="w-full p-1 flex gap-2">
						<input
							value={actualAttribute ?? "Not Specified"}
							type="checkbox"
							checked={filter.includes(actualAttribute ?? "Not Specified")}
							onChange={(e) => {
								if (e.target.checked) {
									setFilter(filter.concat(actualAttribute ?? "Not Specified"));
								} else {
									const tempArr = [...filter];
									tempArr.splice(filter.indexOf(e.target.value), 1);
									setFilter(tempArr);
								}
							}}
						/>
						<p>{actualAttribute ?? "Not Specified"}</p>
					</div>
				)
			)}
		</div>
	);
};

export interface FilterableObject {
	[index: string]: string | null;
}

export const SpecificCheckboxList = ({
	items,
	filter,
	setFilter,
	title,
}: {
	items: (string | null | undefined)[];
	filter: string[];
	setFilter: (v: string[]) => void;
	title?: string;
}) => {
	return (
		<Disclosure>
			{({ open }) => (
				<>
					<Disclosure.Button className="flex justify-between">
						{title}
						<ChevronRightIcon
							className={open ? "rotate-90 transform h-5 w-5" : "h-6 w-5"}
						/>
					</Disclosure.Button>
					<Disclosure.Panel>
						{Array.from(new Set(items)).map((actualAttribute, i) => (
							<div key={i} className="w-full p-1 flex gap-2">
								<input
									value={actualAttribute ?? "Not Specified"}
									type="checkbox"
									checked={filter.includes(actualAttribute ?? "Not Specified")}
									onChange={(e) => {
										if (e.target.checked) {
											setFilter(
												filter.concat(actualAttribute ?? "Not Specified")
											);
										} else {
											const tempArr = [...filter];
											tempArr.splice(filter.indexOf(e.target.value), 1);
											setFilter(tempArr);
										}
									}}
								/>
								<p>{actualAttribute ?? "Not Specified"}</p>
							</div>
						))}
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
};
