// templates/patient.ts
import { ExportTypeFolder, DataTypeFolder } from '../../_plugins';

export const taxReturn: Record<string, DataTypeFolder> = {
	taxpayerName: 'Names',
	SSN: 'PersonalNumber',
	filingDate: 'Date',
	income: 'NumberRange',
	refundAmount: 'Currency'
};

export const invoice: Record<string, DataTypeFolder> = {
	invoiceNumber: 'AutoIncrement',
	invoiceDate: 'Date',
	clientName: 'Names',
	serviceDescription: 'TextRandom',
	totalDue: 'Currency'
};

export const expenseReport: Record<string, DataTypeFolder> = {
	employeeName: 'Names',
	department: 'List',
	expenseDate: 'Date',
	expenseAmount: 'Currency',
	description: 'TextRandom'
};

export const auditLog: Record<string, DataTypeFolder> = {
	eventID: 'GUID',
	eventTime: 'Time',
	user: 'Names',
	action: 'TextFixed',
	ipAddress: 'URLs'
};

export const balanceSheet: Record<string, DataTypeFolder> = {
	companyName: 'Company',
	fiscalYear: 'Date',
	assets: 'NumberRange',
	liabilities: 'NumberRange',
	equity: 'NumberRange'
};

export const accountingTemplates = {
	taxReturn,
	invoice,
	expenseReport,
	auditLog,
	balanceSheet
};
