import { useContext } from "react";

import {
	Bars3BottomLeftIcon,
	Bars3BottomRightIcon,
	Bars3Icon,
} from "@heroicons/react/24/outline";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { EditorContext } from "../contextProviders";

const AlignDropdown = () => {
	const { activeEditor } = useContext(EditorContext);
	return (
		<>
			<button
				onClick={() => {
					activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
				}}
				className="w-full rounded p-1 hover:bg-gray-200"
				type="button"
			>
				<Bars3BottomLeftIcon className="w-full h-5 w-5" />
			</button>
			{/* <button Removed due to me being lazy and not wanting to find an icon
				onClick={() => {
					activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
				}}
				className="w-full item"
				type="button"
			>
				<div className="w-full w-5 h-5 justify-between flex flex-col px-0.5 py-1">
        <div className="w-full rounded-full grow mx-1 max-h-[0.075rem] min-h-[0.075rem] bg-gray-800"></div>
          <div className="w-full rounded-full w-full h-[0.075rem] bg-gray-800"></div>
          <div className="w-full rounded-full grow mx-1 max-h-[0.075rem] bg-gray-800"></div>
        </div>
        
			</button> */}
			<button
				onClick={() => {
					activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
				}}
				className="w-full rounded p-1 hover:bg-gray-200"
				type="button"
			>
				<Bars3Icon className="w-full h-5 w-5" />
			</button>
			<button
				onClick={() => {
					activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
				}}
				className="w-full rounded p-1 hover:bg-gray-200"
				type="button"
			>
				<Bars3BottomRightIcon className="w-full h-5 w-5" />
			</button>

			{/* <button
        onClick={() => {
          activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
        className="w-full item"
        type="button"
      >
        <i className={'icon ' + (isRTL ? 'indent' : 'outdent')} />
        <span className="w-full text">toolbar:alignDropdown.Outdent</span>
      </button> */}
			{/* <button
        onClick={() => {
          activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }}
        className="w-full item"
        type="button"
      >
        <i className={'icon ' + (isRTL ? 'outdent' : 'indent')} />
        <span className="w-full text">toolbar:alignDropdown.Indent</span>
      </button> */}
		</>
	);
};

export default AlignDropdown;
