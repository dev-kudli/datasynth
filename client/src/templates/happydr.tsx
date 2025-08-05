import { ExportTypeFolder, DataTypeFolder } from '../../_plugins';

export const patient: Record<string, DataTypeFolder> = {
	fullName: 'Names',
	dateOfBirth: 'Date',
	phoneNumber: 'Phone',
	emailAddress: 'Email',
	city: 'City'
};

export const provider: Record<string, DataTypeFolder> = {
	providerName: 'Company',
	contactEmail: 'Email',
	phone: 'Phone',
	region: 'Region',
	taxID: 'OrganizationNumber'
};

export const claim: Record<string, DataTypeFolder> = {
	claimID: 'GUID',
	patientName: 'Names',
	providerName: 'Company',
	claimDate: 'Date',
	totalAmount: 'Currency'
};

export const insurance: Record<string, DataTypeFolder> = {
	policyNumber: 'PAN',
	insuranceCompany: 'Company',
	startDate: 'Date',
	endDate: 'Date',
	insuredName: 'Names'
};

export const invoice: Record<string, DataTypeFolder> = {
	invoiceNumber: 'AutoIncrement',
	invoiceDate: 'Date',
	billedTo: 'Names',
	billingAddress: 'StreetAddress',
	amount: 'Currency'
};

export const happydrTemplates = {
	patient,
	provider,
	claim,
	insurance,
	invoice
};
