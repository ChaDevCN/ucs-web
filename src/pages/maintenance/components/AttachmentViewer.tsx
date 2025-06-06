import React, { useState } from 'react';

import { EyeOutlined, DownloadOutlined, FileOutlined } from '@ant-design/icons';
import { Image, Modal, Button, Tabs, Spin } from 'antd';

import styles from './AttachmentViewer.module.css';

// 文件类型映射
const fileTypeMap = {
	// Office 文档
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
		type: 'excel',
		icon: '📊',
		name: 'Excel 文件',
		canPreview: true,
		extension: '.xlsx'
	},
	'application/vnd.ms-excel': {
		type: 'excel',
		icon: '📊',
		name: 'Excel 文件',
		canPreview: true,
		extension: '.xls'
	},
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
		type: 'word',
		icon: '📄',
		name: 'Word 文档',
		canPreview: true,
		extension: '.docx'
	},
	'application/msword': {
		type: 'word',
		icon: '📄',
		name: 'Word 文档',
		canPreview: true,
		extension: '.doc'
	},
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
		type: 'powerpoint',
		icon: '📊',
		name: 'PowerPoint 演示文稿',
		canPreview: true,
		extension: '.pptx'
	},
	'application/vnd.ms-powerpoint': {
		type: 'powerpoint',
		icon: '📊',
		name: 'PowerPoint 演示文稿',
		canPreview: true,
		extension: '.ppt'
	},
	// PDF
	'application/pdf': {
		type: 'pdf',
		icon: '📋',
		name: 'PDF 文档',
		canPreview: true,
		extension: '.pdf'
	},
	// 文本文件
	'text/plain': {
		type: 'text',
		icon: '📝',
		name: '文本文件',
		canPreview: true,
		extension: '.txt'
	},
	// 图片
	'image/jpeg': {
		type: 'image',
		icon: '🖼️',
		name: '图片',
		canPreview: true,
		extension: '.jpg'
	},
	'image/jpg': {
		type: 'image',
		icon: '🖼️',
		name: '图片',
		canPreview: true,
		extension: '.jpg'
	},
	'image/png': {
		type: 'image',
		icon: '🖼️',
		name: '图片',
		canPreview: true,
		extension: '.png'
	},
	'image/gif': {
		type: 'image',
		icon: '🖼️',
		name: '图片',
		canPreview: true,
		extension: '.gif'
	},
	'image/webp': {
		type: 'image',
		icon: '🖼️',
		name: '图片',
		canPreview: true,
		extension: '.webp'
	},
	// 视频
	'video/mp4': {
		type: 'video',
		icon: '🎥',
		name: '视频',
		canPreview: true,
		extension: '.mp4'
	},
	'video/avi': {
		type: 'video',
		icon: '🎥',
		name: '视频',
		canPreview: true,
		extension: '.avi'
	},
	'video/mov': {
		type: 'video',
		icon: '🎥',
		name: '视频',
		canPreview: true,
		extension: '.mov'
	},
	'video/wmv': {
		type: 'video',
		icon: '🎥',
		name: '视频',
		canPreview: true,
		extension: '.wmv'
	}
};

// 获取文件名从URL或生成默认文件名
const getFileName = (url: string, fileInfo: any, id: number) => {
	try {
		const urlObj = new URL(url);
		const pathname = urlObj.pathname;
		const fileName = pathname.split('/').pop() || '';
		const cleanFileName = fileName.split('?')[0];

		// 如果能从URL提取到有效文件名，使用它
		if (cleanFileName && cleanFileName.length > 0 && cleanFileName !== '/') {
			return cleanFileName;
		}
	} catch {
		// URL解析失败，使用默认命名
	}

	// 生成默认文件名
	return `${fileInfo.name}_${id}${fileInfo.extension}`;
};

// 获取多种在线预览URL选项
const getPreviewUrls = (url: string, fileType: string) => {
	const encodedUrl = encodeURIComponent(url);

	const viewers = {
		google: `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`,
		microsoft: `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`,
		original: url
	};

	switch (fileType) {
		case 'pdf':
			return {
				primary: url,
				alternatives: [
					{ name: 'Google PDF 查看器', url: viewers.google },
					{ name: '原始链接', url: viewers.original }
				]
			};
		case 'word':
		case 'excel':
		case 'powerpoint':
			return {
				primary: viewers.microsoft,
				alternatives: [
					{ name: 'Microsoft Office Online', url: viewers.microsoft },
					// { name: 'Google Docs 查看器', url: viewers.google },
					{ name: '原始链接', url: viewers.original }
				]
			};
		case 'text':
			return {
				primary: url,
				alternatives: [{ name: '原始链接', url: viewers.original }]
			};
		default:
			return {
				primary: url,
				alternatives: [{ name: '原始链接', url: viewers.original }]
			};
	}
};

interface Attachment {
	id: number;
	type: string;
	url: string;
}

interface AttachmentViewerProps {
	attachments: Attachment[];
}

const AttachmentViewer: React.FC<AttachmentViewerProps> = ({ attachments }) => {
	const [previewModal, setPreviewModal] = useState<{
		visible: boolean;
		url: string;
		title: string;
		type: string;
		alternatives: Array<{ name: string; url: string }>;
	}>({
		visible: false,
		url: '',
		title: '',
		type: '',
		alternatives: []
	});

	const handlePreview = (url: string, fileName: string, fileType: string) => {
		const previewUrls = getPreviewUrls(url, fileType);

		setPreviewModal({
			visible: true,
			url: previewUrls.primary,
			title: fileName,
			type: fileType,
			alternatives: previewUrls.alternatives
		});
	};

	const renderIframeViewer = (url: string) => {
		return (
			<iframe
				src={url}
				className={styles.iframeContainer}
				title={previewModal.title}
			/>
		);
	};

	const renderPreviewContent = () => {
		if (previewModal.type === 'pdf') {
			const tabItems = [
				...previewModal.alternatives.map((alt, index) => ({
					key: `alt-${index}`,
					label: alt.name,
					children: renderIframeViewer(alt.url)
				}))
			];

			return (
				<Tabs
					items={tabItems}
					defaultActiveKey="pdf-viewer"
					className={styles.previewTabs}
					tabBarStyle={{ margin: 0, padding: '0 16px' }}
				/>
			);
		}

		// 其他文件类型使用多选项卡
		const tabItems = previewModal.alternatives.map((alt, index) => ({
			key: `viewer-${index}`,
			label: alt.name,
			children: renderIframeViewer(alt.url)
		}));

		return (
			<Tabs
				items={tabItems}
				defaultActiveKey="viewer-0"
				className={styles.previewTabs}
				tabBarStyle={{ margin: 0, padding: '0 16px' }}
			/>
		);
	};

	const renderAttachment = (item: Attachment, index: number) => {
		const fileInfo = fileTypeMap[item.type as keyof typeof fileTypeMap];
		const fileName = getFileName(item.url, fileInfo, item.id);

		if (!fileInfo) {
			// 未知文件类型
			return (
				<div
					key={item.id || index}
					className="flex items-center space-x-2 p-2 border rounded"
				>
					<FileOutlined className="text-gray-400" />
					<a
						href={item.url}
						target="_blank"
						rel="noreferrer"
						className="text-blue-600 hover:text-blue-800"
					>
						{fileName || '未知文件'}
					</a>
				</div>
			);
		}

		// 图片类型 - 内嵌显示
		if (fileInfo.type === 'image') {
			return (
				<div key={item.id || index} className="flex flex-col space-y-2">
					<div className="flex items-center space-x-2">
						<span>{fileInfo.icon}</span>
						<span className="text-sm text-gray-600">{fileName}</span>
					</div>
					<Image
						src={item.url}
						className="h-[100px] w-auto rounded-lg shadow-sm"
					/>
				</div>
			);
		}

		// 视频类型 - 内嵌播放器
		if (fileInfo.type === 'video') {
			return (
				<div key={item.id || index} className="flex flex-col space-y-2">
					<div className="flex items-center space-x-2">
						<span>{fileInfo.icon}</span>
						<span className="text-sm text-gray-600">{fileName}</span>
					</div>
					<video
						src={item.url}
						controls
						className="max-w-xs rounded-lg shadow-sm"
						preload="metadata"
					>
						您的浏览器不支持视频播放
					</video>
				</div>
			);
		}

		// 其他文件类型 - 预览和下载按钮
		return (
			<div
				key={item.id || index}
				className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
			>
				<div className="flex items-center space-x-3">
					<span className="text-xl">{fileInfo.icon}</span>
					<div className="flex flex-col">
						<span className="font-medium text-gray-900">{fileName}</span>
						<span className="text-xs text-gray-500">{fileInfo.name}</span>
					</div>
				</div>
				<div className="flex space-x-2">
					{fileInfo.canPreview && (
						<Button
							type="primary"
							size="small"
							icon={<EyeOutlined />}
							onClick={() => handlePreview(item.url, fileName, fileInfo.type)}
						>
							预览
						</Button>
					)}
					<Button
						size="small"
						icon={<DownloadOutlined />}
						onClick={() => {
							const link = document.createElement('a');
							link.href = item.url;
							link.download = fileName;
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						}}
					>
						下载
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-3">
			{attachments && attachments.length > 0 ? (
				attachments.map(renderAttachment)
			) : (
				<span className="text-gray-500">暂无附件</span>
			)}

			{/* 预览模态框 */}
			<Modal
				title={previewModal.title}
				open={previewModal.visible}
				onCancel={() => {
					setPreviewModal({
						visible: false,
						url: '',
						title: '',
						type: '',
						alternatives: []
					});
				}}
				footer={null}
				width="95%"
				style={{ top: 20 }}
				bodyStyle={{ height: '85vh', padding: 0 }}
				destroyOnClose
			>
				{previewModal.visible && renderPreviewContent()}
			</Modal>
		</div>
	);
};

export default AttachmentViewer;
