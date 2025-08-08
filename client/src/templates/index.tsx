import { happydrTemplates } from './happydr';
import { accountingTemplates } from './accounting';
import { ExportTypeFolder, DataTypeFolder } from '../../_plugins';

const templateLabels: Record<string, string> = {
	'w2TaxForm': 'W-2 Tax Form',
	'taxReturn': 'Tax Return',
	'invoice': 'Invoice',
	'expenseReport': 'expenseReport',
	'auditLog': 'auditLog',
	'balanceSheet': 'balanceSheet',
	'patient': 'Patient',
	'provider': 'Provider',
	'claim': 'Claim',
	'insurance': 'Insurance'
};

type TemplateMeta = {
	label: string;
	category: string;
	data: Record<string, DataTypeFolder>;
};

export const allTemplates: Record<string, TemplateMeta> = {
	// Flatten happydr
	...Object.entries(happydrTemplates).reduce((acc, [key, val]) => {
		acc[`healthcare.${key}`] = {
			label: templateLabels[key] || key,
			category: 'Healthcare',
			data: val
		};
		return acc;
	}, {} as Record<string, TemplateMeta>),

	// Flatten accounting
	...Object.entries(accountingTemplates).reduce((acc, [key, val]) => {
		acc[`tax-accounting.${key}`] = {
			label: templateLabels[key] || key,
			category: 'Tax-Accounting',
			data: val
		};
		return acc;
	}, {} as Record<string, TemplateMeta>)
};

export type TemplateKey = keyof typeof allTemplates;
export type TemplateOption = {
	value: TemplateKey;
	label: string;
};
