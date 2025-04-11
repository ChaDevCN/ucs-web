import { LexicalEditor } from 'lexical';

export interface FloatingLinkEditorProps {
	editor: LexicalEditor;
	linkModalVisible: boolean;
	onLinkModalVisibleChange?: (visible: boolean) => void;
}

export interface LinkFormValues {
	link: string;
	text: string;
	className?: string;
	newWindow?: boolean;
	noFollow?: boolean;
}
