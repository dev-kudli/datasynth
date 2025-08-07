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

export const w2TaxForm: Record<string, DataTypeFolder> = {
	// Employer Info
	employerName: 'Company',
	employerEin: 'NumberRange',
	employerAddress: 'StreetAddress',
	employerCity: 'City',
	employerState: 'Region',
	employerZip: 'PostalZip',

	// Employee Info
	employeeName: 'Names',
	employeeSsn: 'NumberRange',
	employeeAddress: 'StreetAddress',
	employeeCity: 'City',
	employeeState: 'Region',
	employeeZip: 'PostalZip',

	// Income and Tax Info
	wagesTipsOtherComp1: 'Currency',
	federalIncomeTaxWithheld2: 'Currency',
	socialSecurityWages3: 'Currency',
	socialSecurityTaxWithheld4: 'Currency',
	medicareWagesAndTips5: 'Currency',
	medicareTaxWithheld6: 'Currency',
	socialSecurityTips7: 'Currency',
	allocatedTips8: 'Currency',
	dependentCareBenefits10: 'Currency',
	nonQualifiedPlans11: 'Currency',

	// Box 12 codes
	codeDd12a: 'Currency',
	codeD12b: 'Currency',

	// Box 13 (checkboxes)
	statutoryEmployee13: 'Boolean',
	retirementPlan13: 'Boolean',
	thirdPartySickPay13: 'Boolean',

	// Box 14
	otherDescription14: 'TextFixed',

	// State and Local Info
	state15: 'Region',
	stateWagesTips16: 'Currency',
	stateIncomeTax17: 'Currency',
	localWagesTips18: 'Currency',
	localIncomeTax19: 'Currency',
	localityName20: 'City',

	// Filing Info
	taxYear: 'Date'
};

export const accountingTemplates = {
	taxReturn,
	invoice,
	expenseReport,
	auditLog,
	balanceSheet,
	w2TaxForm
};
