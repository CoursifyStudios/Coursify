import { NextPage } from "next";
import Editor from "../components/editors/richeditor";

const EditorPage: NextPage = () => {
	return (
		<div className="flex flex-col items-center py-10">
			<div className="w-full max-w-2xl">
				<Editor editable />
			</div>
		</div>
	);
};

export default EditorPage;
