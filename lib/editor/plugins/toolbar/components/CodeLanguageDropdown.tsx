import { $isCodeNode } from "@lexical/code";
import { $getNodeByKey } from "lexical";
import { useCallback, useContext } from "react";
import { EditorContext, ToolbarContext } from "../contextProviders";

const CODE_LANGUAGE_OPTIONS: [string, string][] = [
	["", "- Select language -"],
	["c", "C"],
	["clike", "C-like"],
	["css", "CSS"],
	["html", "HTML"],
	["js", "JavaScript"],
	["markdown", "Markdown"],
	["objc", "Objective-C"],
	["plain", "Plain Text"],
	["py", "Python"],
	["rust", "Rust"],
	["sql", "SQL"],
	["swift", "Swift"],
	["xml", "XML"],
];

const CodeLanguageDropdown = () => {
	const { activeEditor } = useContext(EditorContext);
	const { selectedElementKey, codeLanguage } = useContext(ToolbarContext);
	const onCodeLanguageSelect = useCallback(
		(e: { target: { value: string } }) => {
			activeEditor.update(() => {
				if (selectedElementKey !== null && selectedElementKey != undefined) {
					const node = $getNodeByKey(selectedElementKey);
					if ($isCodeNode(node)) {
						//console.log(e.target.value);
						node.setLanguage(e.target.value);
					}
				}
			});
		},
		[activeEditor, selectedElementKey]
	);

	return (
		<>
			{/* <Select
        className="toolbar-item code-language"
        onChange={onCodeLanguageSelect}
        options={CODE_LANGUAGE_OPTIONS}
        value={codeLanguage}
      />
      <i className="chevron-down inside" /> */}
			select language
		</>
	);
};

export default CodeLanguageDropdown;
