import {
	ArrowUturnLeftIcon,
	ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import { REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { useContext } from "react";
import { EditorContext, ToolbarContext } from "../contextProviders";

export const UndoButton = () => {
	const { canUndo } = useContext(ToolbarContext);
	const { activeEditor } = useContext(EditorContext);
	return (
		<button
			disabled={!canUndo}
			onClick={() => {
				activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
			}}
			className="rounded p-1 hover:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500"
			aria-label="undo button"
		>
			<ArrowUturnLeftIcon className="h-5 w-5" />
		</button>
	);
};

export const RedoButton = () => {
	const { canRedo } = useContext(ToolbarContext);
	const { activeEditor } = useContext(EditorContext);
	return (
		<button
			disabled={!canRedo}
			onClick={() => {
				activeEditor.dispatchCommand(REDO_COMMAND, undefined);
			}}
			className="rounded p-1 hover:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500"
			aria-label="redo button"
		>
			<ArrowUturnRightIcon className="h-5 w-5" />
		</button>
	);
};
