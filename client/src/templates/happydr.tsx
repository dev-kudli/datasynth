import { DataTypeFolder } from '../../_plugins';
import { format, subYears, addYears, fromUnixTime } from 'date-fns';

export type DataTypeConfig = {
    type: DataTypeFolder;
    options?: any; // You can further type this per DataTypeFolder for more type safety
};

export const patient: Record<string, DataTypeConfig> = {
	id: { 
		type: 'GUID' 
	},
	givenName: { 
		type: 'Names' ,
		options: {
			example: 'Name',
			options: ['Name'],
			source: 'any',
			selectedCountries: []
		},
	},
	familyName: { 
		type: 'Names' ,
		options: {
			example: 'Surname',
			options: ['Surname'],
			source: 'any',
			selectedCountries: []
		},
	},
	gender: {
		type: 'List',
		options: {
			example: 'male|female',
			listType: 'exactly',
			exactly: '1',
			betweenLow: '',
			betweenHigh: '',
			values: ['male', 'female'],
			delimiter: ', '
		}
	},
	dateOfBirth: { 
		type: 'Date' ,
		options: {
			fromDate: parseInt(format(subYears(new Date(), 1), 't'), 10),
			toDate: parseInt(format(addYears(new Date(), 1), 't'), 10),
			example: 'MMM d, y',
			format: 'MMM d, y'
		}
	},
	phoneNumber: { 
		type: 'Phone' ,
		options: {
			example: '1-Xxx-Xxx-xxxx|(Xxx) Xxx-xxxx',
			option: ['1-Xxx-Xxx-xxxx', '(Xxx) Xxx-xxxx']
		}
	},
	streetAddress: { 
		type: 'StreetAddress' 
	},
	city: {
		type: 'City',
		options: {
			source: 'any',
			selectedCountries: [],
			targetRowId: ''
		}
	},
	state: { 
		type: 'Region',
		options: {
			source: 'anyRegion',
			selectedCountries: [],
			targetRowId: '',
			formats: ['full']
		}
	},
	postalCode: { 
		type: 'PostalZip',
		options: {
			source: 'any',
			selectedCountries: [],
			targetRowId: ''
		}
	},
	country: { 
		type: 'Country',
		options: {
			source: 'plugins',
			selectedCountries: []
		}
	},
};

export const practitioner: Record<string, DataTypeConfig> = {
	id: {
		type: 'GUID'
	},
	givenName: {
		type: 'Names',
		options: {
			example: 'Name',
			options: ['Name'],
			source: 'any',
			selectedCountries: []
		}
	},
	familyName: {
		type: 'Names',
		options: {
			example: 'Surname',
			options: ['Surname'],
			source: 'any',
			selectedCountries: []
		}
	}
};

export const organization: Record<string, DataTypeConfig> = {
	id: {
		type: 'GUID'
	},
	name: {
		type: 'Company'
	},
	phoneNumber: {
		type: 'Phone',
		options: {
			example: '1-Xxx-Xxx-xxxx|(Xxx) Xxx-xxxx',
			option: ['1-Xxx-Xxx-xxxx', '(Xxx) Xxx-xxxx']
		}
	},
	streetAddress: {
		type: 'StreetAddress'
	},
	city: {
		type: 'City',
		options: {
			source: 'any',
			selectedCountries: [],
			targetRowId: ''
		}
	},
	state: {
		type: 'Region',
		options: {
			source: 'anyRegion',
			selectedCountries: [],
			targetRowId: '',
			formats: ['full']
		}
	},
	postalCode: {
		type: 'PostalZip',
		options: {
			source: 'any',
			selectedCountries: [],
			targetRowId: ''
		}
	},
	country: {
		type: 'Country',
		options: {
			source: 'plugins',
			selectedCountries: []
		}
	}
};

export const coverage: Record<string, DataTypeConfig> = {
	id: {
		type: 'GUID'
	},
	status: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['active']
		}
	},
	beneficiaryId: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Patient']
		}
	},
	subscriberId: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Patient']
		}
	},
	policyHolderId: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Patient']
		}
	},
	payorOrganizationId: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Organization']
		}
	},
	coverageType: {
		type: 'Constant',
		options: {
			loopCount: 4,
			values: ['HMO', 'PPO', 'Medicare', 'Medicaid']
		}
	},
	identifier: {
		type: 'GUID'
	},
	relationship: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['self']
		}
	},
	dependent: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['1']
		}
	},
	classType: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Group']
		}
	},
	classValue: {
		type: 'NumberRange',
		options: {
			min: 100000,
			max: 999999
		}
	},
	className: {
		type: 'Company'
	}
};

export const encounter: Record<string, DataTypeConfig> = {
	id: {
		type: 'GUID',
	},
	status: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['finished']
		}
	},
	classCode: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['AMB']
		}
	},
	subjectReference: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Patient']
		}
	},
	serviceReference: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Patient']
		}
	},
	periodStart: {
		type: 'Date',
		options: {
			fromDate: parseInt(format(subYears(new Date(), 1), 't'), 10),
			toDate: parseInt(format(addYears(new Date(), 1), 't'), 10),
			example: 'MMM d, y',
			format: 'MMM d, y'
		}
	},
	periodEnd: {
		type: 'Date',
		options: {
			fromDate: parseInt(format(subYears(new Date(), 1), 't'), 10),
			toDate: parseInt(format(addYears(new Date(), 1), 't'), 10),
			example: 'MMM d, y',
			format: 'MMM d, y'
		}
	}
};

export const condition: Record<string, DataTypeConfig> = {
	id: {
		type: 'GUID'
	},
	code: {
		type: 'List',
		options: {
			example: 'Acute bronchitis',
			listType: 'exactly',
			exactly: '1',
			betweenLow: '',
			betweenHigh: '',
			values: ['Acute bronchitis', 'Hypertension', 'Type 2 diabetes'],
			delimiter: ', '
		}
	},
	subject: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Patient']
		}
	},
	encounter: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Encounter']
		}
	},
	onsetDateTime: {
		type: 'Date',
		options: {
			fromDate: parseInt(format(subYears(new Date(), 1), 't'), 10),
			toDate: parseInt(format(addYears(new Date(), 1), 't'), 10),
			example: 'MMM d, y',
			format: 'MMM d, y'
		}
	},
	clinicalStatus: {
		type: 'Constant',
		options: {
			values: ['active']
		}
	},
	verificationStatus: {
		type: 'Constant',
		options: {
			values: ['confirmed']
		}
	},
	category: {
		type: 'Constant',
		options: {
			values: ['encounter-diagnosis']
		}
	}
};

export const procedure: Record<string, DataTypeConfig> = {
	id: {
		type: 'GUID'
	},
	status: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['completed']
		}
	},
	code: {
		type: 'List',
		options: {
			example: 'Office visit',
			listType: 'exactly',
			exactly: '1',
			betweenLow: '',
			betweenHigh: '',
			values: ['Office visit', 'Blood draw', 'X-ray'],
			delimiter: ', '
		}
	},
	subject: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Patient']
		}
	},
	encounter: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Encounter']
		}
	},
	performedDateTime: {
		type: 'Date',
		options: {
			fromDate: parseInt(format(subYears(new Date(), 1), 't'), 10),
			toDate: parseInt(format(addYears(new Date(), 1), 't'), 10),
			example: 'MMM d, y',
			format: 'MMM d, y'
		}
	}
};

export const claim: Record<string, DataTypeConfig> = {
	id: {
		type: 'GUID'
	},
	identifier: {
		type: 'GUID'
	},
	status: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['completed']
		}
	},
	use: {
		type: 'Constant',
		options: {
			loopCount: 3,
			values: ['claim', 'preauthorization', 'predetermination']
		}
	},
	type: {
		type: 'Constant',
		options: {
			loopCount: 5,
			values: ['oral', 'pharmacy', 'vision', 'institutional', 'professional']
		}
	},
	subtype: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['outpatient']
		}
	},
	priority: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['noarmal']
		}
	},
	fundsReserve: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['priority']
		}
	},
	patientReference: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Patient']
		}
	},
	entererReference: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Practitioner']
		}
	},
	providerReference: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Practitioner']
		}
	},
	insurerReference: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Organization']
		}
	},
	billableStartPeriod: {
		type: 'Date',
		options: {
			fromDate: parseInt(format(subYears(new Date(), 1), 't'), 10),
			toDate: parseInt(format(addYears(new Date(), 1), 't'), 10),
			example: 'MMM d, y',
			format: 'MMM d, y'
		}
	},
	billableEndPeriod: {
		type: 'Date',
		options: {
			fromDate: parseInt(format(subYears(new Date(), 1), 't'), 10),
			toDate: parseInt(format(addYears(new Date(), 1), 't'), 10),
			example: 'MMM d, y',
			format: 'MMM d, y'
		}
	},
	payeeCode: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['subscriber']
		}
	},
	payeePartyReference: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Patient']
		}
	},
	facilityReference: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Organization']
		}
	},
	careTeamProviderReference: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Provider']
		}
	},
	diagnosisReference: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Diagnosis']
		}
	},
	procedureReference: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Procedure']
		}
	},
	insuranceCoverage: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Coverage']
		}
	},
	accidentAddress: { 
		type: 'StreetAddress' 
	},
	accidentCity: {
		type: 'City',
		options: {
			source: 'any',
			selectedCountries: [],
			targetRowId: ''
		}
	},
	accidentState: { 
		type: 'Region',
		options: {
			source: 'anyRegion',
			selectedCountries: [],
			targetRowId: '',
			formats: ['full']
		}
	},
	accidentPostalCode: { 
		type: 'PostalZip',
		options: {
			source: 'any',
			selectedCountries: [],
			targetRowId: ''
		}
	},
	accidentCountry: { 
		type: 'Country',
		options: {
			source: 'plugins',
			selectedCountries: []
		}
	},
};

export const happydrTemplates = {
	patient,
	practitioner,
	organization,
	coverage,
	encounter,
	condition,
	procedure,
	// claim,
};
