import { SupabaseClient } from "@supabase/supabase-js";
import { Popup } from "../misc/popup";
import { Database } from "@/lib/db/database.types";
import { Field, Form, Formik } from "formik";
import { BetterFileCarousel } from "../files/genericFileView";
import GenericFileUpload, { CoursifyFile } from "../files/genericFileUpload";
import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Condition, createListing, editListing } from "@/lib/db/textbooks";
import { Button } from "../misc/button";
import { LoadingSmall } from "../misc/loading";

export const CreateListing = ({
	open,
	setOpen,
	supabase,
	book,
	addListing,
	editingInfo,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
	supabase: SupabaseClient<Database>;
	book: {
		id: string;
		title: string;
	};
	addListing: (listings: {
		id: string;
		pictures: CoursifyFile[];
		condition: number;
		info: string;
		price: number;
		pricing_flexible: boolean;
	}) => void;
	editingInfo?:
		| {
				id: string;
				pictures: CoursifyFile[];
				condition: number;
				info: string;
				price: number;
				pricing_flexible: boolean;
				clear: () => void;
		  }
		| undefined;
}) => {
	const [pictures, setPictures] = useState<CoursifyFile[]>(
		editingInfo?.pictures ?? []
	);
	const [loading, setloading] = useState(false);
	const [error, setError] = useState("");
	const user = useUser();
	return (
		<Popup closeMenu={() => setOpen(false)} open={open}>
			<h2>{book.title ?? "Please choose a textbook to sell"}</h2>
			<Formik
				// validationSchema={Yup.object({
				// 	condition: Yup.string().required(),
				// 	description: Yup.string().max(255),
				// 	// flexible: Yup.boolean(),
				// 	price: Yup.number()
				// 		.min(0, "Price cannot be negative")
				// 		.max(65535)
				// 		.required(),
				// })}
				initialValues={{
					condition: editingInfo ? editingInfo.condition.toString() : "0",
					description: editingInfo ? editingInfo.info : "",
					flexible: editingInfo ? editingInfo.pricing_flexible : false,
					price: editingInfo ? editingInfo.price.toString() : "",
				}}
				onSubmit={async (values) => {
					if (typeof book.id == "string" && user && values.condition) {
						setError("");
						setloading(true);
						let dBreturn;
						if (editingInfo) {
							dBreturn = await editListing(
								supabase,
								editingInfo.id,
								editingInfo.pictures.map((picture) => picture.dbName),
								{
									condition: parseInt(values.condition),
									info: values.description,
									pictures: pictures,
									price: parseFloat(values.price),
									pricing_flexible: values.flexible,
								}
							);
						} else {
							dBreturn = await createListing(supabase, {
								textbook: book.id,
								seller: user?.id,
								condition: parseInt(values.condition!),
								info: values.description,
								pictures: pictures,
								price: parseFloat(values.price),
								pricing_flexible: values.flexible,
							});
						}
						setloading(false);
						if (dBreturn.error) {
							setError(dBreturn.error.message);
						} else {
							addListing({
								...dBreturn.data,
								pictures: dBreturn.data.pictures
									? (dBreturn.data.pictures as unknown as CoursifyFile[])
									: [],
								condition: dBreturn.data.condition ?? 0,
								price: dBreturn.data.price ?? 0,
								info: dBreturn.data.info ?? "",
								pricing_flexible: dBreturn.data.pricing_flexible ?? false,
							});
							setOpen(false);
							if (editingInfo) {
								editingInfo.clear();
							}
						}
					}
				}}
			>
				<Form className="p-2 gap-3 grid">
					<BetterFileCarousel allFiles={pictures} />
					<GenericFileUpload
						files={pictures}
						setFiles={setPictures}
						destination=""
					/>
					<div role="group" aria-labelledby="my-radio-group">
						Condition:
						<label>
							<Field
								className="mx-2"
								type="radio"
								name="condition"
								value={Condition.As_New.toString()}
							/>
							As New
						</label>
						<label>
							<Field
								className="mx-2"
								type="radio"
								name="condition"
								value={Condition.Fine.toString()}
							/>
							Fine
						</label>
						<label>
							<Field
								className="mx-2"
								type="radio"
								name="condition"
								value={Condition.Very_Good.toString()}
							/>
							Very Good
						</label>
						<label>
							<Field
								className="mx-2"
								type="radio"
								name="condition"
								value={Condition.Good.toString()}
							/>
							Good
						</label>
						<label>
							<Field
								className="mx-2"
								type="radio"
								name="condition"
								value={Condition.Fair.toString()}
							/>
							Fair
						</label>
						<label>
							<Field
								className="mx-2"
								type="radio"
								name="condition"
								value={Condition.Poor.toString()}
							/>
							Poor
						</label>
					</div>

					<label htmlFor="description">Description</label>
					<Field
						as="textarea"
						name="description"
						type="text"
						className="h-24"
					></Field>

					<label htmlFor="price" className="flex justify-between h-6">
						Pricing Flexible:
						<Field name="flexible" type="checkbox"></Field>
						Price (USD):
						<Field
							name="price"
							type="number"
							min="0"
							max="65535"
							step="0.01"
						></Field>
					</label>
					<p className="text-red-500">{error}</p>
					<Button type="submit" className="mx-auto" color="bg-blue-500">
						{editingInfo ? "Save" : "Create Listing"}{" "}
						{loading && <LoadingSmall className="ml-2" />}
					</Button>
				</Form>
			</Formik>
		</Popup>
	);
};
