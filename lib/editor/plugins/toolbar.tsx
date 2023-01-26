import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	UNDO_COMMAND,
	REDO_COMMAND,
	$getSelection,
	$setSelection,
} from "lexical";
import { useEffect, useState } from "react";

export default function ToolBarPluginBetter() {
	const [editor] = useLexicalComposerContext();
	const [selection, setCurrentSelection] = useState<any>();
	useEffect(() => {
		const selection = $getSelection();
		setCurrentSelection(selection);
	});

	return (
		<div className="mb-1 flex border-b-2 border-gray-200 px-4 py-2 ">
			{selection}
		</div>
	);
}
