import { FORMAT_TEXT_COMMAND } from "lexical";
import React from "react";
import { useContext } from "react";
import { EditorContext, ToolbarContext } from "../contextProviders";

export const BoldButton = () => {
	const { activeEditor } = useContext(EditorContext);
	const { isBold } = useContext(ToolbarContext);

	return (
		<button
			onClick={() => {
				activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
			}}
			className={
				"h-6 w-6 rounded transition hover:bg-gray-200 " +
				(isBold ? "font-bold" : "font-semibold  text-gray-500")
			}
			aria-label="bold"
			type="button"
		>
			B
		</button>
	);
};

export const ItalicButton = () => {
	const { activeEditor } = useContext(EditorContext);
	const { isItalic } = useContext(ToolbarContext);

	return (
		<button
			onClick={() => {
				activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
			}}
			className={
				"h-6 w-6 rounded font-serif italic transition hover:bg-gray-200 " +
				(isItalic ? "" : "text-gray-500")
			}
			aria-label="italic"
			type="button"
		>
			I
		</button>
	);
};

export const UnderlineButton = () => {
	const { activeEditor } = useContext(EditorContext);
	const { isUnderline } = useContext(ToolbarContext);

	return (
		<button
			onClick={() => {
				activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
			}}
			className={
				"h-6 w-6 rounded font-medium underline transition hover:bg-gray-200 " +
				(isUnderline ? "" : "text-gray-500")
			}
			aria-label="Italic"
			type="button"
		>
			U
		</button>
	);
};
