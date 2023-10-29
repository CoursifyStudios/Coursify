import Layout from "@/components/layout/layout";
import { NextPageWithLayout } from "../_app";
import { ReactElement, useState } from "react";
import { Field, Form, Formik } from "formik";
import GenericFileUpload, {
	CoursifyFile,
} from "@/components/files/genericFileUpload";
import { FileCarousel } from "@/components/files/genericFileView";

const CreateListing: NextPageWithLayout = () => {
	const [pictures, setPictures] = useState<CoursifyFile[]>([]);

	return (
		<div className="mx-auto mt-10">
			<FileCarousel files={pictures} />
			<Formik
				initialValues={{ condition: "", description: "", price: null }}
				onSubmit={() => {}}
			>
				<Form className="bg-red-500 p-4 gap-3 grid">
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
								name="picked"
								value="as new"
							/>
							As New
						</label>
						<label>
							<Field className="mx-2" type="radio" name="picked" value="fine" />
							Fine
						</label>
						<label>
							<Field
								className="mx-2"
								type="radio"
								name="picked"
								value="very good"
							/>
							Very Good
						</label>
						<label>
							<Field className="mx-2" type="radio" name="picked" value="good" />
							Good
						</label>
						<label>
							<Field className="mx-2" type="radio" name="picked" value="fair" />
							Fair
						</label>
						<label>
							<Field className="mx-2" type="radio" name="picked" value="poor" />
							Poor
						</label>
					</div>

					<label htmlFor="description">
						Description
						<Field name="description" type="text"></Field>
					</label>

					<label htmlFor="price">
						Price
						<Field
							name="price"
							type="number"
							min="0"
							max="600"
							step="0.01"
						></Field>
					</label>
				</Form>
			</Formik>
		</div>
	);
};

export default CreateListing;

CreateListing.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};
