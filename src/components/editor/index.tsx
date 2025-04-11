import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
	InitialConfigType,
	LexicalComposer
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

import editorTheme from './constant/EditorThemes';
import { NODES } from './nodes';
import ToolbarPlugin from './plugins/ToolbarPlugin';
const Editor = () => {
	const initialConfig: InitialConfigType = {
		namespace: 'editor',
		theme: editorTheme,
		nodes: NODES,
		onError: console.error
	};

	return (
		<div className="h-full overflow-auto bg-white border-2 border-gray-200 rounded-lg">
			<LexicalComposer initialConfig={initialConfig}>
				<ToolbarPlugin />
				<div className="relative lg:p-4 p-2 h-[calc(100%-50px)]">
					<RichTextPlugin
						contentEditable={<ContentEditable />}
						placeholder={
							<p className="prose absolute top-4 text-gray-500 select-none pointer-events-none">
								来写点什么吧
							</p>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
				</div>
				<LinkPlugin />
				<AutoFocusPlugin />
				<ListPlugin />
			</LexicalComposer>
		</div>
	);
};

export default Editor;
