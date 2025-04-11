import request from '@/utils/request';
// projectId        String
// /// 基地
// projectBase      String?
// /// 项目日期
// projectStartDate DateTime?
// /// 项目名称
// projectName      String?
// /// 索赔文件号
// claimFileNumber  String?
// /// 进展状态
// progress         String?
// /// 设备信息
// equipment        String?
// /// 项目地点
// location         String?
// /// 执行方
// executor         String?

// /// 收到工业 PO 时间
// poReceivedDate  DateTime?
// /// TSC_PO 编号
// tscPoId         String?
// /// PO 完成时间
// poCompletedDate DateTime?
// /// PO 周期（天）
// poDurationDays  Int?

// /// 供应商开票金额
// vendorInvoiceAmount Decimal?  @db.Decimal(20, 6)
// /// 供应商开票时间
// vendorInvoiceDate   DateTime?
// /// 供应商付款时间
// vendorPaymentDate   DateTime?

// /// 对工业开具发票时间
// invoiceIssuedDate      DateTime?
// /// 给工业发票金额（15% PLUS）
// invoiceTotalWithMargin Decimal?  @db.Decimal(20, 6)
// /// 到账时间
// paymentReceivedDate    DateTime?
// /// 账期（天）
// paymentTermDays        Int?

// /// 服务内容
// serviceContent String?

// /// 创建时间
// createdAt DateTime @default(now())
// /// 更新时间
// // updatedAt DateTime @updatedAt
export interface OperationSheet {
	id: number;
	projectId: string;
	projectBase?: string;
	projectStartDate?: string;
	projectName?: string;
	claimFileNumber?: string;
	progress?: string;
	equipment?: string;
	location?: string;
	executor?: string;
	poReceivedDate?: string;
	tscPoId?: string;
	poCompletedDate?: string;
	poDurationDays?: number;
	vendorInvoiceAmount?: number;
	vendorInvoiceDate?: string;
	vendorPaymentDate?: string;
	invoiceIssuedDate?: string;
	invoiceTotalWithMargin?: number;
	paymentReceivedDate?: string;
	paymentTermDays?: number;
	serviceContent?: string;
	createdAt?: string;
	updatedAt?: string;
}

export const getOperationSheet = (params: any) => {
	return request<{
		data: OperationSheet[];
		total: number;
	}>({
		url: '/operation-sheet',
		method: 'GET',
		params
	});
};

export const createOperationSheet = (data: OperationSheet) => {
	return request({
		url: '/operation-sheet',
		method: 'POST',
		data
	});
};

export const findOperationSheet = (id: number) => {
	return request<OperationSheet>({
		url: `/operation-sheet/${id}`,
		method: 'GET'
	});
};

export const updateOperationSheet = (id: number, data: OperationSheet) => {
	return request({
		url: `/operation-sheet/${id}`,
		method: 'PATCH',
		data
	});
};

export const deleteOperationSheet = (id: number) => {
	return request({
		url: `/operation-sheet/${id}`,
		method: 'DELETE'
	});
};
