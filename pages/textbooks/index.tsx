import { getTextbooks } from "@/lib/db/textbooks";
import { NextPageWithLayout } from "../_app";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ReactElement, useState } from "react";
import { Textbook } from "@/components/textbooks/textbook";
import Layout from "@/components/layout/layout";
import { Disclosure } from "@headlessui/react";
import {
	ChevronRightIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

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

	useState(() => {
		(async () => {
			const data = await getTextbooks(supabase);
			if (data.data) {
				setBooks(data.data);
			}
		})();
	});

	const CheckboxList = ({
		books,
		attribute,
		filter,
		setFilter,
	}: {
		books: {
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
		}[];
		attribute:
			| "id"
			| "subject"
			| "course"
			| "isbn"
			| "title"
			| "author"
			| "edition"
			| "publisher"
			| "adoption_level"
			| "new_only";
		filter: string[];
		setFilter: (v: string[]) => void;
	}) => {
		return (
			<div>
				{Array.from(new Set(books.map((book) => book[attribute]))).map(
					(actualAttribute, i) => (
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
					)
				)}
			</div>
		);
	};
	return (
		<div className="flex">
			<section className="bg-gray-200 w-80 mt-2 p-4">
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
												books={books.filter((book) => book.subject == subject)}
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
						books={books}
						attribute={"adoption_level"}
						filter={adoptionFilter}
						setFilter={setAdoptionFilter}
					/>
					<p className="mt-1 font-semibold">New Only</p>
					<CheckboxList
						books={books}
						attribute={"new_only"}
						filter={newOnlyFilter}
						setFilter={setNewOnlyFilter}
					/>
				</div>
			</section>
			<section className="mx-auto mt-2 w-full max-w-screen-xl px-3">
				<div className={"relative flex grow items-center transition-all my-4"}>
					<MagnifyingGlassIcon className="absolute left-3 h-4 w-4" />
					<input
						type="text"
						className="grow !rounded-xl py-0.5 placeholder:dark:text-gray-400 pl-8"
						placeholder="Search by Author, Title, ISBN or other attribute..."
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="grid sm:grid-cols-2 min-[1000px]:grid-cols-3 grow gap-3">
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
								"py-4 px-6 rounded-lg " + (page == aNumber + 1 && "bg-gray-200")
							}
						>
							{aNumber + 1}
						</button>
					))}
				</div>
			</section>
		</div>
	);
};

export default Textbooks;

Textbooks.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};
