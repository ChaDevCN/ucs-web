import { FC, useEffect, useState } from 'react';

import { $createLinkNode, $isLinkNode } from '@lexical/link';
import {
	$isListNode,
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
	$createHeadingNode,
	$createQuoteNode,
	$isHeadingNode,
	HeadingTagType
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent } from '@lexical/utils';
import { Button, Checkbox, Form, Input, Popover } from 'antd';
import {
	$createParagraphNode,
	$createTextNode,
	$getSelection,
	$insertNodes,
	$isRangeSelection,
	$isRootOrShadowRoot,
	ElementFormatType,
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
	LexicalNode,
	TextFormatType
} from 'lexical';
import {
	ALargeSmallIcon,
	AlignCenterIcon,
	AlignJustifyIcon,
	AlignLeftIcon,
	AlignRightIcon,
	BoldIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	Heading4Icon,
	Heading5Icon,
	Heading6Icon,
	HighlighterIcon,
	ItalicIcon,
	LinkIcon,
	ListIcon,
	ListOrderedIcon,
	QuoteIcon,
	StrikethroughIcon,
	SubscriptIcon,
	SuperscriptIcon,
	UnderlineIcon
} from 'lucide-react';

import '../index.less';
import { Select, SelectItem, SelectSeparator } from '../components/select';
import ToggleButton from '../components/toggleButton';
import { LinkFormValues } from '../interface/interface';

import { getSelectedNode } from '@/utils/editor';

const ToolbarPlugin: FC = () => {
	const [editor] = useLexicalComposerContext();

	/**
	 * 加粗
	 */
	const [isBold, setIsBold] = useState(false);
	/**
	 * 斜体
	 */
	const [isItalic, setIsItalic] = useState(false);
	/**
	 * 下划线
	 */
	const [isUnderline, setIsUnderline] = useState(false);
	/**
	 * 删除线
	 */
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	/**
	 * 高亮
	 */
	const [isHighlighter, setIsHighlighter] = useState(false);
	/**
	 * 上标
	 */
	const [isSuperscript, setIsSuperscript] = useState(false);
	/**
	 * 下标
	 */
	const [isSubscript, setIsSubscript] = useState(false);

	/**
	 * 当前选中文本的类型，如 h1、h2、p、blockquote 等
	 */
	const [blockType, setBlockType] = useState('paragraph');

	const [isLink, setIsLink] = useState(false);
	/**
	 * 链接弹窗是否可见
	 */
	const [linkModalVisible, setLinkModalVisible] = useState(false);
	/**
	 * 链接表单
	 */
	const [form] = Form.useForm();

	/**
	 * 注册一个编辑器状态更新的回调函数，在回调函数内读取选中文本的状态
	 */
	useEffect(() => {
		const unregister = editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const selection = $getSelection();
				if (!$isRangeSelection(selection)) {
					return;
				}

				// text format
				setIsBold(selection.hasFormat('bold'));
				setIsItalic(selection.hasFormat('italic'));
				setIsUnderline(selection.hasFormat('underline'));
				setIsStrikethrough(selection.hasFormat('strikethrough'));
				setIsHighlighter(selection.hasFormat('highlight'));
				setIsSuperscript(selection.hasFormat('superscript'));
				setIsSubscript(selection.hasFormat('subscript'));

				// block type
				const anchorNode = selection.anchor.getNode();
				let element =
					anchorNode.getKey() === 'root'
						? anchorNode
						: $findMatchingParent(anchorNode, (node: LexicalNode) => {
								const parent = node.getParent();
								return parent !== null && $isRootOrShadowRoot(parent);
						  });
				if (element === null) {
					element = anchorNode.getTopLevelElementOrThrow();
				}

				if ($isListNode(element)) {
					setBlockType(element.getListType());
				} else if ($isHeadingNode(element)) {
					setBlockType(element.getTag());
				} else {
					setBlockType(element.getType());
				}

				// 获取选中的节点
				const node = getSelectedNode(selection);
				// 获取选中的节点的父节点
				const parent = node.getParent();
				// 如果选中的节点或其父节点是链接节点，则设置 isLink 为 true

				if ($isLinkNode(parent) || $isLinkNode(node)) {
					setIsLink(true);
				} else {
					setIsLink(false);
				}
			});
		});

		return unregister;
	}, [editor]);

	/**
	 * 更新选中文本的格式
	 */
	const formatText = (type: TextFormatType) => {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
	};

	/**
	 * 设置为段落
	 */
	const formatParagraph = () => {
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, () => $createParagraphNode());
			}
		});
	};

	/**
	 * 设置为标题
	 */
	const formatHeading = (headingSize: HeadingTagType) => {
		editor.update(() => {
			const selection = $getSelection();
			$setBlocksType(selection, () => $createHeadingNode(headingSize));
		});
	};

	/**
	 * 设置为引用
	 */
	const formatQuote = () => {
		editor.update(() => {
			const selection = $getSelection();
			$setBlocksType(selection, () => $createQuoteNode());
		});
	};

	/**
	 * 设置为无序列表
	 */
	const formatUnorderedList = () => {
		editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
	};

	/**
	 * 设置为有序列表
	 */
	const formatOrderedList = () => {
		editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
	};

	const handleBlockTypeChange = (type: string) => {
		setBlockType(type);
		if (type === 'paragraph') {
			formatParagraph();
		}
		if (
			type === 'h1' ||
			type === 'h2' ||
			type === 'h3' ||
			type === 'h4' ||
			type === 'h5' ||
			type === 'h6'
		) {
			formatHeading(type);
		}
		if (type === 'quote') {
			formatQuote();
		}
		if (type === 'bullet') {
			formatUnorderedList();
		}
		if (type === 'number') {
			formatOrderedList();
		}
	};
	/**
	 * 更新选中文本的格式
	 */
	const handleTextAlignChange = (align: ElementFormatType) => {
		editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
	};
	/**
	 * 插入超链接
	 */
	const handleInsertLink = (values: LinkFormValues) => {
		const _values = {
			target: values.newWindow ? '_blank' : '_self',
			rel: values.noFollow ? 'nofollow' : null,
			title: values.text || null
		};
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection) || selection === null) {
				const textNode = $createTextNode(values.text);
				const linkNode = $createLinkNode(values.link, _values);
				linkNode.append(textNode);
				$insertNodes([linkNode]);
				form.resetFields();
				setLinkModalVisible(false);
			}
		});
	};

	return (
		<div className="flex items-center px-2 py-1.5 border-b border-gray-200 bg-white sticky top-0 w-full z-10">
			<Select value={blockType} onValueChange={handleBlockTypeChange}>
				<SelectItem value="paragraph" label="段落" icon={ALargeSmallIcon} />
				<SelectSeparator />
				<SelectItem value="h1" label="一级标题" icon={Heading1Icon} />
				<SelectItem value="h2" label="二级标题" icon={Heading2Icon} />
				<SelectItem value="h3" label="三级标题" icon={Heading3Icon} />
				<SelectItem value="h4" label="四级标题" icon={Heading4Icon} />
				<SelectItem value="h5" label="五级标题" icon={Heading5Icon} />
				<SelectItem value="h6" label="六级标题" icon={Heading6Icon} />
				<SelectSeparator />
				<SelectItem value="quote" label="引用块" icon={QuoteIcon} />
				<SelectSeparator />

				<SelectItem value="bullet" label="无序列表" icon={ListIcon} />
				<SelectItem value="number" label="有序列表" icon={ListOrderedIcon} />
			</Select>
			<div className="w-px h-5 mx-2 bg-gray-200 rounded"></div>
			<div className="flex gap-x-1">
				<ToggleButton
					icon={BoldIcon}
					title="加粗"
					aria-label="加粗"
					pressed={isBold}
					onPressedChange={() => formatText('bold')}
				/>
				<ToggleButton
					icon={ItalicIcon}
					title="斜体"
					aria-label="斜体"
					pressed={isItalic}
					onPressedChange={() => formatText('italic')}
				/>
				<ToggleButton
					icon={UnderlineIcon}
					title="下划线"
					aria-label="下划线"
					pressed={isUnderline}
					onPressedChange={() => formatText('underline')}
				/>
				<ToggleButton
					icon={StrikethroughIcon}
					title="删除线"
					aria-label="删除线"
					pressed={isStrikethrough}
					onPressedChange={() => formatText('strikethrough')}
				/>
				<ToggleButton
					icon={HighlighterIcon}
					title="高亮"
					aria-label="高亮"
					pressed={isHighlighter}
					onPressedChange={() => formatText('highlight')}
				/>
				<ToggleButton
					icon={SuperscriptIcon}
					title="上标"
					aria-label="上标"
					pressed={isSuperscript}
					onPressedChange={() => formatText('superscript')}
				/>
				<ToggleButton
					icon={SubscriptIcon}
					title="下标"
					aria-label="下标"
					pressed={isSubscript}
					onPressedChange={() => formatText('subscript')}
				/>
			</div>
			<div className="w-px h-5 mx-2 bg-gray-200 rounded"></div>

			<div className="flex items-center gap-x-1">
				<ToggleButton
					title="左对齐"
					icon={AlignLeftIcon}
					aria-label="左对齐"
					onPressedChange={() => handleTextAlignChange('left')}
				/>
				<ToggleButton
					title="居中对齐"
					icon={AlignCenterIcon}
					aria-label="居中对齐"
					onPressedChange={() => handleTextAlignChange('center')}
				/>
				<ToggleButton
					title="右对齐"
					icon={AlignRightIcon}
					aria-label="右对齐"
					onPressedChange={() => handleTextAlignChange('right')}
				/>
				<ToggleButton
					title="两端对齐"
					icon={AlignJustifyIcon}
					aria-label="两端对齐"
					onPressedChange={() => handleTextAlignChange('justify')}
				/>
			</div>
			<div className="w-px h-5 mx-2 bg-gray-200 rounded"></div>
			<div className="flex items-center gap-x-1">
				<Popover
					content={
						<div>
							<Form
								form={form}
								onFinish={handleInsertLink}
								className="w-64"
								layout="vertical"
							>
								<Form.Item
									label="链接"
									name="link"
									className="!mb-2"
									rules={[{ required: true, message: '请输入链接' }]}
								>
									<Input />
								</Form.Item>
								<Form.Item
									label="文本"
									name="text"
									className="!mb-2"
									rules={[{ required: true, message: '请输入文本' }]}
								>
									<Input />
								</Form.Item>
								<Form.Item label="class name" className="!mb-2">
									<Input />
								</Form.Item>
								<Form.Item
									label="在新的窗口打开"
									name="newWindow"
									className="!mb-2"
									valuePropName="checked"
									layout="horizontal"
								>
									<Checkbox />
								</Form.Item>
								<Form.Item
									label="no follow"
									name="noFollow"
									className="!mb-2"
									valuePropName="checked"
									layout="horizontal"
								>
									<Checkbox />
								</Form.Item>
								<Form.Item className="!mb-2">
									<Button type="primary" htmlType="submit">
										插入超链接
									</Button>
								</Form.Item>
							</Form>
						</div>
					}
					trigger="click"
					placement="bottom"
					open={linkModalVisible}
					onOpenChange={(linkModalVisible) =>
						setLinkModalVisible(linkModalVisible)
					}
				>
					<button>
						<LinkIcon size={16} className="text-gray-800 cursor-pointer" />
					</button>
				</Popover>
			</div>
		</div>
	);
};

export default ToolbarPlugin;
