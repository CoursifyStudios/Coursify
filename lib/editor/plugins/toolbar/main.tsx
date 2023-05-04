import { $isCodeNode } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isListNode, ListNode } from "@lexical/list";
import { $isHeadingNode } from "@lexical/rich-text";

import {
	$getSelectionStyleValueForProperty,
	$isParentElementRTL,
	$patchStyleText,
} from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
	$getSelection,
	$isRangeSelection,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	SELECTION_CHANGE_COMMAND,
} from "lexical";
import * as React from "react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import useChild from "use-child";

import { $isAtNodeEnd } from "@lexical/selection";
import { ElementNode, RangeSelection, TextNode } from "lexical";

import AlignDropdown from "./components/AlignDropdown";
//import InsertDropdown from './components/InsertDropdown.tsx';
//import UndoButton from './components/UndoButton';
//import RedoButton from './components/RedoButton';
//import CodeLanguageDropdown from './components/CodeLanguageDropdown';
//import BlockFormatDropdown from './components/BlockFormatDropdown';
import { EditorContext, ToolbarContext } from "./contextProviders";
import {
	UndoButton,
	RedoButton,
	BoldButton,
	ItalicButton,
	UnderlineButton,
	BlockFormatDropdown,
} from "./components";

const supportedBlockTypes = new Set([
	"paragraph",
	"quote",
	"code",
	"h1",
	"h2",
	"h3",
	"bullet",
	"number",
	"check",
]);

const CODE_LANGUAGE_MAP = {
	javascript: "js",
	md: "markdown",
	plaintext: "plain",
	python: "py",
	text: "plain",
};

interface IToolbarProps {
	children?: JSX.Element;
	defaultFontSize?: string /** The default selected font size in the toolbar */;
	defaultFontColor?: string /** The default selected font color in the toolbar */;
	defaultBgColor?: string /** The default selected background color in the toolbar */;
	defaultFontFamily?: string /** The default selected font family in the toolbar */;
	backdrop?: boolean;
}

const ToolbarPlugin = ({
	children,
	backdrop = true,
	defaultFontSize = "15px",
	defaultFontColor = "#000",
	defaultBgColor = "#fff",
	defaultFontFamily = "Arial",
}: IToolbarProps) => {
	//@ts-expect-error
	//const [insertExists, InsertComponent] = useChild(children, InsertDropdown);
	const [alignExists, AlignComponent] = useChild(children, AlignDropdown);

	const { initialEditor, activeEditor, setActiveEditor } =
		useContext(EditorContext);
	const [blockType, setBlockType] = useState("paragraph");
	const [selectedElementKey, setSelectedElementKey] = useState<string>();
	const [fontSize, setFontSize] = useState<string>(defaultFontSize);
	const [fontColor, setFontColor] = useState<string>(defaultFontColor);
	const [bgColor, setBgColor] = useState<string>(defaultBgColor);
	const [fontFamily, setFontFamily] = useState<string>(defaultFontFamily);
	const [isLink, setIsLink] = useState(false);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	const [isSubscript, setIsSubscript] = useState(false);
	const [isSuperscript, setIsSuperscript] = useState(false);
	const [isCode, setIsCode] = useState(false);
	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);
	const [isRTL, setIsRTL] = useState(false);
	const [codeLanguage, setCodeLanguage] = useState<string>("");

	const updateToolbar = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			const anchorNode = selection.anchor.getNode();
			const element =
				anchorNode.getKey() === "root"
					? anchorNode
					: anchorNode.getTopLevelElementOrThrow();
			const elementKey = element.getKey();
			const elementDOM = activeEditor.getElementByKey(elementKey);

			// Update text format
			setIsBold(selection.hasFormat("bold"));
			setIsItalic(selection.hasFormat("italic"));
			setIsUnderline(selection.hasFormat("underline"));
			setIsStrikethrough(selection.hasFormat("strikethrough"));
			setIsSubscript(selection.hasFormat("subscript"));
			setIsSuperscript(selection.hasFormat("superscript"));
			setIsCode(selection.hasFormat("code"));
			setIsRTL($isParentElementRTL(selection));

			// Update links
			const node = getSelectedNode(selection);
			const parent = node.getParent();
			if ($isLinkNode(parent) || $isLinkNode(node)) {
				setIsLink(true);
			} else {
				setIsLink(false);
			}

			if (elementDOM !== null) {
				setSelectedElementKey(elementKey);
				if ($isListNode(element)) {
					const parentList = $getNearestNodeOfType<ListNode>(
						anchorNode,
						ListNode
					);
					const type = parentList
						? parentList.getListType()
						: element.getListType();
					setBlockType(type);
				} else {
					const type = $isHeadingNode(element)
						? element.getTag()
						: element.getType();
					setBlockType(type);
					if ($isCodeNode(element)) {
						const language = element.getLanguage();
						setCodeLanguage(
							//@ts-expect-error
							language ? CODE_LANGUAGE_MAP[language] || language : ""
						);
						return;
					}
				}
			}
			// Hande buttons
			//console.log(selection)
			//const anchor = selection.anchor.getNode().getFormatType();
			//console.log(anchor)
			setFontSize(
				$getSelectionStyleValueForProperty(
					selection,
					"font-size",
					defaultFontSize
				)
			);

			setFontColor(
				$getSelectionStyleValueForProperty(selection, "color", defaultFontColor)
			);
			setBgColor(
				$getSelectionStyleValueForProperty(
					selection,
					"background-color",
					defaultBgColor
				)
			);

			setFontFamily(
				$getSelectionStyleValueForProperty(
					selection,
					"font-family",
					defaultFontFamily
				)
			);
		}
	}, [
		activeEditor,
		defaultBgColor,
		defaultFontColor,
		defaultFontSize,
		defaultFontFamily,
	]);

	useEffect(() => {
		return initialEditor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			(_payload: any, newEditor: any) => {
				updateToolbar();
				setActiveEditor(newEditor);
				return false;
			},
			COMMAND_PRIORITY_CRITICAL
		);
	}, [initialEditor, updateToolbar, setActiveEditor]);

	useEffect(() => {
		return mergeRegister(
			activeEditor.registerUpdateListener(
				({ editorState }: { editorState: any }) => {
					editorState.read(() => {
						updateToolbar();
					});
				}
			),
			activeEditor.registerCommand<boolean>(
				CAN_UNDO_COMMAND,
				(payload: boolean | ((prevState: boolean) => boolean)) => {
					setCanUndo(payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			),
			activeEditor.registerCommand<boolean>(
				CAN_REDO_COMMAND,
				(payload: boolean | ((prevState: boolean) => boolean)) => {
					setCanRedo(payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			)
		);
	}, [activeEditor, updateToolbar]);

	const applyStyleText = useCallback(
		(styles: Record<string, string>) => {
			activeEditor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$patchStyleText(selection, styles);
				}
			});
		},
		[activeEditor]
	);

	const insertLink = useCallback(() => {
		if (!isLink) {
			initialEditor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
		} else {
			initialEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	}, [initialEditor, isLink]);

	return (
		<ToolbarContext.Provider
			value={{
				isRTL,
				canUndo,
				canRedo,
				fontFamily,
				fontSize,
				fontColor,
				bgColor,
				isBold,
				isItalic,
				isUnderline,
				isCode,
				isLink,
				applyStyleText,
				insertLink,
				isStrikethrough,
				isSubscript,
				isSuperscript,
				selectedElementKey,
				codeLanguage,
				blockType,
			}}
		>
			<div
				className={`sticky top-0 z-40 rounded-b ${
					backdrop && "bg-white/50 backdrop-blur dark:bg-neutral-900"
				} `}
			>
				<div className=" flex items-center ">
					<div className="mr-6 space-x-0.5">
						<BoldButton />
						<ItalicButton />
						<UnderlineButton />
					</div>
					<div className="mr-6  space-x-0.5 ">
						<AlignDropdown />
					</div>
					{supportedBlockTypes.has(blockType) &&
						activeEditor === initialEditor && (
							<>
								<BlockFormatDropdown />
							</>
						)}
					{/* {blockType === "code" ? ( removed because it was annoying to add
					<>
						{/* <CodeLanguageDropdown /> code
						<div className="h-10 w-1 bg-gray-800"></div>
						{alignExists && AlignComponent}
					</>
				) : (
					<>{children}</>
				)} */}
					{children}
					<div className="ml-auto space-x-2">
						<UndoButton />
						<RedoButton />
					</div>
				</div>
				<div className="mt-1 h-0.5 w-full rounded-full bg-gray-100 dark:bg-gray-300"></div>
			</div>
		</ToolbarContext.Provider>
	);
};

export default ToolbarPlugin;

export function getSelectedNode(
	selection: RangeSelection
): TextNode | ElementNode {
	const anchor = selection.anchor;
	const focus = selection.focus;
	const anchorNode = selection.anchor.getNode();
	const focusNode = selection.focus.getNode();
	if (anchorNode === focusNode) {
		return anchorNode;
	}
	const isBackward = selection.isBackward();
	if (isBackward) {
		return $isAtNodeEnd(focus) ? anchorNode : focusNode;
	} else {
		return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
	}
}
