import richTheme from "../../lib/editor/richtheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import TreeViewPlugin from "../../lib/editor/plugins/treeview";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";

import ListMaxIndentLevelPlugin from "../../lib/editor/plugins/listmaxindentlevelplugin";
import CodeHighlightPlugin from "../../lib/editor/plugins/codehighlightplugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import ToolBarPluginBetter from "../../lib/editor/plugins/toolbar";

function Placeholder() {
	return (
		<div className="absolute top-1 left-1 -z-10">Enter some rich text...</div>
	);
}

const editorConfig = {
	// The editor theme
	theme: richTheme,
	// Handling of errors during update
	onError(error: any) {
		throw error;
	},
	// Any custom nodes go here
	nodes: [
		HeadingNode,
		ListNode,
		ListItemNode,
		QuoteNode,
		CodeNode,
		CodeHighlightNode,
		TableNode,
		TableCellNode,
		TableRowNode,
		AutoLinkNode,
		LinkNode,
	],
	namespace: "My editor",
};

export default function Editor() {
	return (
		<GrammarlyEditorPlugin clientId="client_HhHcuxVxKgaZMFYuD57U3V">
			<LexicalComposer initialConfig={editorConfig}>
				<div className="mb-2 rounded-xl p-4 shadow-lg ">
					<ToolBarPluginBetter />
					<div className="relative">
						<RichTextPlugin
							contentEditable={
								<ContentEditable className="h-full p-1 focus:outline-none" />
							}
							placeholder={<Placeholder />}
							ErrorBoundary={LexicalErrorBoundary}
						/>
						<HistoryPlugin />
						<AutoFocusPlugin />
						<CodeHighlightPlugin />
						<ListPlugin />
						<LinkPlugin />
						<AutoLinkPlugin matchers={[]} />
						<ListMaxIndentLevelPlugin maxDepth={7} />
						<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
					</div>
				</div>
				<TreeViewPlugin />
			</LexicalComposer>
		</GrammarlyEditorPlugin>
	);
}
