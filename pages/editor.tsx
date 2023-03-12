import { EditorState } from "lexical/LexicalEditorState";
import { NextPage } from "next";
import { useState } from "react";
import Editor from "../components/editors/richeditor";

const EditorPage: NextPage = () => {
	const [editorState, setEditorState] = useState<EditorState>();

	return (
		<div className="flex flex-col items-center py-10">
			<div className="w-full max-w-2xl">
				<Editor updateState={setEditorState} editable />
			</div>
			<pre>{JSON.stringify(editorState, null, 2)}</pre>
		</div>
	);
};

export default EditorPage;
