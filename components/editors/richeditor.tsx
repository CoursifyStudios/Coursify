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
import ToolbarPlugin from "../../lib/editor/plugins/toolbar/main";
import { EditorContext } from "../../lib/editor/plugins/toolbar/contextProviders";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ReactNode, useEffect, useState } from "react";

function Placeholder() {
	return (
		<div className="absolute top-1 left-1 -z-10 text-gray-600">
			Enter some rich text...
		</div>
	);
}

const editorConfig = {
	// The editor theme
	theme: richTheme,
	// Handling of errors during update
	onError(error: any) {
		throw error;
	},
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

const URL_MATCHER =
	/((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const EMAIL_MATCHER =
	/(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const MATCHERS = [
	(text: string) => {
		const match = URL_MATCHER.exec(text);
		return (
			match && {
				index: match.index,
				length: match[0].length,
				text: match[0],
				url: match[0],
			}
		);
	},
	(text: string) => {
		const match = EMAIL_MATCHER.exec(text);
		return (
			match && {
				index: match.index,
				length: match[0].length,
				text: match[0],
				url: `mailto:${match[0]}`,
			}
		);
	},
];

export default function Editor({ editable }: { editable: boolean }) {
	return (
		<GrammarlyEditorPlugin clientId="client_HhHcuxVxKgaZMFYuD57U3V">
			<LexicalComposer initialConfig={editorConfig}>
				<EditorContextProvider editable={editable}>
					<div className="relative mb-2 rounded-xl p-4 shadow-lg">
						<ToolbarPlugin />
						<div className="relative">
							<RichTextPlugin
								contentEditable={
									<ContentEditable className="prose mt-1 h-full p-1 focus:outline-none" />
								}
								placeholder={<Placeholder />}
								ErrorBoundary={LexicalErrorBoundary}
							/>
							<HistoryPlugin />
							<AutoFocusPlugin />
							<CodeHighlightPlugin />
							<ListPlugin />
							<LinkPlugin />
							<AutoLinkPlugin matchers={MATCHERS} />
							<ListMaxIndentLevelPlugin maxDepth={7} />
							<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
						</div>
					</div>
					<TreeViewPlugin />
				</EditorContextProvider>
			</LexicalComposer>
		</GrammarlyEditorPlugin>
	);
}

function EditorContextProvider({
	children,
	editable,
}: {
	children: ReactNode;
	editable: boolean;
}) {
	const [editor] = useLexicalComposerContext();

	const [activeEditor, setActiveEditor] = useState(editor);

	useEffect(() => {
		editor.setEditable(editable);
	});

	return (
		<EditorContext.Provider
			value={{ initialEditor: editor, activeEditor, setActiveEditor }}
		>
			{children}
		</EditorContext.Provider>
	);
}
