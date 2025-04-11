import { $isAtNodeEnd } from '@lexical/selection';
import { RangeSelection } from 'lexical';

/**
 * 获取当前选区的主要节点
 * @param selection 选区对象（RangeSelection）
 * @returns 选中的主要节点（Node）
 */
export const getSelectedNode = (selection: RangeSelection) => {
	// 获取选区的起点（Anchor）
	const anchor = selection.anchor;
	// 获取选区的终点（Focus）
	const focus = selection.focus;
	// 获取起点所在的节点
	const anchorNode = anchor.getNode();
	// 获取终点所在的节点
	const focusNode = focus.getNode();

	// 如果起点和终点位于同一个节点，直接返回该节点
	if (anchorNode === focusNode) {
		return anchorNode;
	}

	// 判断选区是否是反向选中（从后往前拖动）
	const isBackward = selection.isBackward();

	// 根据选区方向，判断应该返回哪个节点：
	// - 如果是反向选中（Backward），则优先返回起点节点，除非终点在节点末尾
	// - 如果是正向选中（Forward），则优先返回终点节点，除非起点在节点末尾
	if (isBackward) {
		return $isAtNodeEnd(focus) ? anchorNode : focusNode;
	} else {
		return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
	}
};
