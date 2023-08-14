import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TreeView } from "@lexical/react/LexicalTreeView";

export default function TreeViewPlugin() {
	const [editor] = useLexicalComposerContext();
	return (
		<TreeView
			viewClassName="w-full tree-view-output"
			timeTravelPanelClassName="w-full debug-timetravel-panel"
			timeTravelButtonClassName="w-full debug-timetravel-button"
			timeTravelPanelSliderClassName="w-full debug-timetravel-panel-slider"
			timeTravelPanelButtonClassName="w-full debug-timetravel-panel-button"
			treeTypeButtonClassName="w-full "
			editor={editor}
		/>
	);
}
