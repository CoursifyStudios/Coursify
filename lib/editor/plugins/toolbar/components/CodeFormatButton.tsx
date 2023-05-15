import { FORMAT_TEXT_COMMAND } from "lexical";
import { useContext } from "react";
import { EditorContext, ToolbarContext } from "../contextProviders";

const CodeFormatButton = () => {
	const { activeEditor } = useContext(EditorContext);
	const { isCode } = useContext(ToolbarContext);

	return (
		<button
			onClick={() => {
				activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
			}}
			className={"toolbar-item spaced " + (isCode ? "active" : "")}
			aria-label="Code format button"
			type="button"
		>
			fmt code
		</button>
	);
};

export default CodeFormatButton;
