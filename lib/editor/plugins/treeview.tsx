import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TreeView } from "@lexical/react/LexicalTreeView";

export default function TreeViewPlugin() {
	const [editor] = useLexicalComposerContext();
	return (
		<TreeView
			viewclassName="w-full tree-view-output"
			timeTravelPanelclassName="w-full debug-timetravel-panel"
			timeTravelButtonclassName="w-full debug-timetravel-button"
			timeTravelPanelSliderclassName="w-full debug-timetravel-panel-slider"
			timeTravelPanelButtonclassName="w-full debug-timetravel-panel-button"
			treeTypeButtonclassName="w-full "
			editor={editor}
		/>
	);
}
