import { LinkNode, AutoLinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';

export const NODES = [
	HeadingNode,
	QuoteNode,
	ListItemNode,
	ListNode,
	LinkNode,
	AutoLinkNode
];
