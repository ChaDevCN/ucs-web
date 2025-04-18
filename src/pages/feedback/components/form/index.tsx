import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
	ProForm,
	ProFormDatePicker,
	ProFormGroup,
	ProFormMoney,
	ProFormText,
	ProFormTextArea
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Card, Form, message } from 'antd';
import dayjs from 'dayjs';

import {
	createOperationSheet,
	findOperationSheet,
	updateOperationSheet
} from '../../service';

import { useWidth } from '@/hooks/use-width';
const formWidth = 'md';
export const Index = () => {
	const [searchParams] = useSearchParams();
	const type = searchParams.get('type') === 'look';

	const { id } = useParams();
	const { isMobile } = useWidth();
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const config = {
		title: id !== '-1' ? '编辑工单' : '新增工单'
	};
	const { run } = useRequest(createOperationSheet, {
		manual: true,
		onSuccess: () => {
			message.success('新增成功');
			navigate('/feedback');
		}
	});

	const { run: find } = useRequest(() => findOperationSheet(Number(id)), {
		manual: true,
		onSuccess: (res) => {
			form.setFieldsValue(res.data);
		}
	});
	const { run: update } = useRequest(updateOperationSheet, {
		manual: true,
		onSuccess: () => {
			message.success('修改成功');
			navigate('/feedback');
		}
	});
	const transformDate = (value: any) => {
		return dayjs(value).format('YYYY-MM-DD');
	};
	const onFinish = (values: any) => {
		if (id !== '-1') {
			update(Number(id), values);
		} else {
			run(values);
		}
	};
	const onError = () => {
		try {
			const errorList = document.querySelectorAll('.ant-form-item-has-error');
			errorList[0].scrollIntoView({ behavior: 'smooth' });
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (id !== '-1') {
			find();
		}
	}, [id]);

	return (
		<Card className="max-h-full overflow-y-auto" title={config.title}>
			<ProForm
				onFinish={onFinish}
				readonly={type}
				onFinishFailed={onError}
				className="[&>div:last-child]:justify-end"
				form={form}
				onReset={() => {
					navigate('/feedback');
				}}
				submitter={{
					searchConfig: {
						resetText: '取消'
					}
				}}
			>
				{/* 基本信息 */}
				<ProFormGroup title="基本信息">
					<ProFormText
						label="项目编号"
						name="projectId"
						width={formWidth}
						rules={[{ required: true, message: '请输入项目编号' }]}
					/>
					<ProFormText label="基地" name="projectBase" width={formWidth} />
					<ProFormDatePicker
						name="projectStartDate"
						label="日期"
						transform={transformDate}
						width={formWidth}
					/>
					<ProFormText label="项目名称" name="projectName" width={formWidth} />
					<ProFormText
						label="索赔文件号"
						name="claimFileNumber"
						width={formWidth}
					/>
					<ProFormText label="进展" name="progress" width={formWidth} />
					<ProFormText label="设备" name="equipment" width={formWidth} />
					<ProFormText label="地点" name="location" width={formWidth} />
					<ProFormText label="执行方" name="executor" width={formWidth} />
				</ProFormGroup>

				{/* PO相关信息 */}
				<ProFormGroup title="PO相关信息">
					<ProFormDatePicker
						label="收到工业PO时间"
						name="poReceivedDate"
						transform={transformDate}
						width={formWidth}
					/>
					<ProFormText label="TSC_PO编号" name="tscPoId" width={formWidth} />
					<ProFormDatePicker
						label="PO完成时间"
						name="poCompletedDate"
						transform={transformDate}
						width={formWidth}
					/>
					<ProFormText
						label="PO周期(天)"
						name="poDurationDays"
						width={formWidth}
					/>
				</ProFormGroup>

				{/* 第三方信息 */}
				<ProFormGroup title="第三方信息">
					<ProFormMoney label="供应商开票金额" name="vendorInvoiceAmount" />
					<ProFormDatePicker
						label="供应商开票时间"
						name="vendorInvoiceDate"
						transform={transformDate}
						width={formWidth}
					/>
					<ProFormDatePicker
						label="供应商付款时间"
						name="vendorPaymentDate"
						transform={transformDate}
						width={formWidth}
					/>
				</ProFormGroup>

				{/* 发票信息 */}
				<ProFormGroup title="发票信息">
					<ProFormDatePicker
						label="对工业开具发票时间"
						name="invoiceIssuedDate"
						transform={transformDate}
						width={formWidth}
					/>
					<ProFormMoney
						label="给工业发票金额(15%PLUS)"
						name="invoiceTotalWithMargin"
					/>
					<ProFormDatePicker
						label="到账时间"
						name="paymentReceivedDate"
						transform={transformDate}
						width={formWidth}
					/>
					<ProFormText
						label="账期(天)"
						name="paymentTermDays"
						width={formWidth}
					/>
				</ProFormGroup>

				{/* 服务内容 */}
				<ProFormGroup title="服务内容">
					<ProFormTextArea
						label="服务内容"
						name="serviceContent"
						width={isMobile ? formWidth : 'xl'}
					/>
				</ProFormGroup>
			</ProForm>
		</Card>
	);
};
export default Index;
