import { happydrTemplates } from './happydr';
import { accountingTemplates } from './accounting';
import { DataTypeFolder } from '../../_plugins';
import { DataTypeConfig } from './happydr';

const templateLabels: Record<string, string> = {
	'w2TaxForm': 'W-2 Tax Form',
};

function camelCaseToLabel(key: string): string {
	return key
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2') // insert space before capital letters
		.replace(/^./, str => str.toUpperCase()); // capitalize the first letter
}

type TemplateMeta = {
	label: string;
	category: string;
	data: Record<string, DataTypeConfig>;
};

export const allTemplates: Record<string, TemplateMeta> = {
	// Flatten happydr
	...Object.entries(happydrTemplates).reduce((acc, [key, val]) => {
		acc[`healthcare.${key}`] = {
			label: templateLabels[key] || camelCaseToLabel(key),
			category: 'Healthcare',
			data: val
		};
		return acc;
	}, {} as Record<string, TemplateMeta>),

	// Flatten accounting
	...Object.entries(accountingTemplates).reduce((acc, [key, val]) => {
		acc[`tax-accounting.${key}`] = {
			label: templateLabels[key] || camelCaseToLabel(key),
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
