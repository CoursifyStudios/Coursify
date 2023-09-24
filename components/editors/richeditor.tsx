import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import richTheme from "../../lib/editor/richtheme";
import { $isRootTextContentEmpty } from "@lexical/text";

import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, SerializedEditorState } from "lexical/LexicalEditorState";
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { Json } from "../../lib/db/database.types";
import CodeHighlightPlugin from "../../lib/editor/plugins/codehighlightplugin";
import { EditorContext } from "../../lib/editor/plugins/toolbar/contextProviders";
import ToolbarPlugin from "../../lib/editor/plugins/toolbar/main";
import { $getRoot } from "lexical";

const editorConfig = {
	// The editor theme
	theme: richTheme,
	// Handling of errors during update
	onError(error: unknown) {
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

export default function Editor({
	editable,
	updateState,
	className,
	initialState,
	initialStateEditor,
	updatedState,
	focus,
	backdrop,
	updateRaw,
	toolbarClassName,
	clearEditor,
}: {
	editable: boolean;
	updateState?:
		| Dispatch<SetStateAction<undefined | EditorState>>
		| ((state: EditorState | undefined) => void);
	initialState?: Json | SerializedEditorState;
	initialStateEditor?: EditorState;
	className?: string;
	updatedState?: EditorState;
	focus?: boolean;
	backdrop?: boolean;
	updateRaw?: Dispatch<SetStateAction<string>>;
	toolbarClassName?: string;
	clearEditor?: boolean;
}) {
	return (
		<LexicalComposer initialConfig={editorConfig}>
			<EditorContextProvider
				editable={editable}
				initialState={initialState}
				updatedState={updatedState}
				initialStateEditor={initialStateEditor}
				updateRaw={updateRaw}
				clearEditor={clearEditor}
			>
				<div
					className={`relative ${
						className
							? className
							: "mb-2 rounded-xl p-4 shadow-lg dark:border border-gray-300"
					}`}
				>
					{editable && (
						<ToolbarPlugin backdrop={backdrop} className={toolbarClassName} />
					)}
					<div className="relative">
						<RichTextPlugin
							contentEditable={
								<ContentEditable className="prose h-full !max-w-full p-1 dark:prose-invert focus:outline-none dark:!text-neutral-200 [&>h1:first-child]:mt-0" />
							}
							placeholder={editable ? <Placeholder /> : <></>}
							ErrorBoundary={LexicalErrorBoundary}
						/>
						<HistoryPlugin />
						{focus && <AutoFocusPlugin />}
						<CodeHighlightPlugin />
						<ListPlugin />
						<LinkPlugin />
						{updateState && (
							<OnChangePlugin
								onChange={(state) =>
									updateState(
										$isRootTextContentEmpty(true) || state.isEmpty()
											? undefined
											: state
									)
								}
								ignoreSelectionChange={true}
							/>
						)}
						<AutoLinkPlugin matchers={MATCHERS} />
						<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
					</div>
				</div>
				{/* <TreeViewPlugin /> */}
			</EditorContextProvider>
		</LexicalComposer>
	);
}

function EditorContextProvider({
	children,
	editable,
	initialState,
	updatedState,
	initialStateEditor,
	updateRaw,
	clearEditor,
}: {
	children: ReactNode;
	editable: boolean;
	initialState?: Json | SerializedEditorState;
	initialStateEditor?: EditorState;
	updatedState?: EditorState;
	updateRaw?: Dispatch<SetStateAction<string>>;
	clearEditor?: boolean;
}) {
	const [editor] = useLexicalComposerContext();

	const [activeEditor, setActiveEditor] = useState(editor);

	useEffect(() => {
		editor.setEditable(editable);
		if (updatedState) {
			editor.setEditorState(updatedState);
		} else if (initialState || initialStateEditor) {
			if (
				(
					editor.getEditorState().toJSON().root.children[0] //@ts-expect-error Lexical types r bad
						.children as unknown[]
				).length == 0
			)
				editor.setEditorState(
					initialStateEditor ||
						editor.parseEditorState(
							initialState as unknown as SerializedEditorState
						)
				);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editable, initialState, updatedState, initialStateEditor]);

	useEffect(() => {
		if (clearEditor) {
			editor.update(() => {
				$getRoot().clear();
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clearEditor]);

	useEffect(() => {
		if (updateRaw) {
			updateRaw(editor._rootElement?.textContent || "");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editor._rootElement?.textContent]);

	return (
		<EditorContext.Provider
			value={{ initialEditor: editor, activeEditor, setActiveEditor }}
		>
			{children}
		</EditorContext.Provider>
	);
}

function Placeholder() {
	return (
		<div className="absolute left-1 top-2 -z-10 text-gray-600">
			Enter some rich text...
		</div>
	);
}
