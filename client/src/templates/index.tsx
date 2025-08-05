import { happydrTemplates } from './happydr';
import { accountingTemplates } from './accounting';

export const allTemplates = {
	...Object.entries(happydrTemplates).reduce((acc, [key, val]) => {
		acc[`happydr.${key}`] = val;
		return acc;
	}, {} as Record<string, Record<string, string>>),

	...Object.entries(accountingTemplates).reduce((acc, [key, val]) => {
		acc[`accounting.${key}`] = val;
		return acc;
	}, {} as Record<string, Record<string, string>>)
};

export type TemplateKey = keyof typeof allTemplates;