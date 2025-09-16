// templates/patient.ts
import { ExportTypeFolder, DataTypeFolder } from '../../_plugins';
import { format, subYears, addYears, fromUnixTime } from 'date-fns';

export type DataTypeConfig = {
    type: DataTypeFolder;
    options?: any;
};

function currencyOptions(from: string, to: string): DataTypeConfig {
	return {
		type: 'Currency',
		options: {
			example: `${from}|${to}|$|prefix|true|,|.`,
			from: from,
			to: to,
			currencySymbol: '$',
			currencySymbolLocation: 'prefix',
			includeCents: true,
			thousandsSeparator: ',',
			centsSeparator: '.'
		}
	};
}

export const taxReturn: Record<string, DataTypeConfig> = {
	taxpayerName: {
		type: 'Names',
		options: {
			example: 'John Doe',
			options: ['John', 'Jane', 'Alex', 'Taylor'],
			source: 'any',
			selectedCountries: []
		}
	},
	SSN: {
		type: 'NumberRange',
		options: {
			min: 0,
			max: 1000000,
		}
	},
	filingDate: {
		type: 'Date',
		options: {
			fromDate: parseInt(format(subYears(new Date(), 10), 't'), 10), // last 10 years
			toDate: parseInt(format(new Date(), 't'), 10),
			example: 'MMM d, y',
			format: 'MMM d, y'
		}
	},
	income: {
		type: 'NumberRange',
		options: {
			min: 0,
			max: 1000000,
		}
	},
	// refundAmount: {
	// 	type: 'Currency',
	// 	options: {
	// 		currency: 'USD',
	// 		symbol: '$',
	// 		min: 0,
	// 		max: 50000,
	// 		decimals: 2,
	// 		example: '$1200.00'
	// 	}
	// }
};

export const invoice: Record<string, DataTypeConfig> = {
	invoiceNumber: {
		type: 'AutoIncrement',
		options: {
			start: 1000,
			step: 1,
			example: '1000'
		}
	},
	invoiceDate: {
		type: 'Date',
		options: {
			fromDate: parseInt(format(subYears(new Date(), 2), 't'), 10),
			toDate: parseInt(format(new Date(), 't'), 10),
			example: 'MMM d, y',
			format: 'MMM d, y'
		}
	},
	clientName: {
		type: 'Names',
		options: {
			example: 'Acme Corp.',
			options: ['Acme Corp.', 'Globex Inc.', 'Soylent Co.'],
			source: 'any',
			selectedCountries: []
		}
	},
	serviceDescription: {
		type: 'TextRandom',
		options: {
			example: 'Consulting Services for August',
			length: 10,
			characterSet: 'alphanumeric'
		}
	},
	totalDue: {
		type: 'Currency',
		options: {
			currency: 'USD',
			symbol: '$',
			min: 100,
			max: 100000,
			decimals: 2,
			example: '$1520.50'
		}
	}
};

export const expenseReport: Record<string, DataTypeConfig> = {
	employeeName: {
		type: 'Names',
		options: {
			example: 'Jane Smith',
			options: ['Jane Smith', 'John Doe', 'Emily Johnson'],
			source: 'any',
			selectedCountries: []
		}
	},
	department: {
		type: 'List',
		options: {
			example: 'Marketing',
			listType: 'exactly',
			exactly: '1',
			values: ['Marketing', 'Sales', 'Engineering', 'HR'],
			delimiter: ', '
		}
	},
	expenseDate: {
		type: 'Date',
		options: {
			fromDate: parseInt(format(subYears(new Date(), 1), 't'), 10),
			toDate: parseInt(format(new Date(), 't'), 10),
			example: 'MMM d, y',
			format: 'MMM d, y'
		}
	},
	expenseAmount: {
		type: 'Currency',
		options: {
			currency: 'USD',
			symbol: '$',
			min: 10,
			max: 10000,
			decimals: 2,
			example: '$145.67'
		}
	},
	description: {
		type: 'TextRandom',
		options: {
			example: 'Hotel stay during conference',
			length: 15,
			characterSet: 'alphanumeric'
		}
	}
};

// export const auditLog: Record<string, DataTypeFolder> = {
// 	eventID: 'GUID',
// 	eventTime: 'Time',
// 	user: 'Names',
// 	action: 'TextFixed',
// 	ipAddress: 'URLs'
// };

export const balanceSheet: Record<string, DataTypeConfig> = {
	companyName: {
		type: 'Company',
		options: {
			example: 'Acme Corp'
		}
	},
	fiscalYear: {
		type: 'Date',
		options: {
			fromDate: parseInt(format(subYears(new Date(), 10), 't'), 10),
			toDate: parseInt(format(new Date(), 't'), 10),
			example: '2024',
			format: 'yyyy'
		}
	},
	assets: {
		type: 'NumberRange',
		options: {
			min: 100000,
			max: 10000000,
			decimals: 2,
			example: '1250000.00'
		}
	},
	liabilities: {
		type: 'NumberRange',
		options: {
			min: 50000,
			max: 8000000,
			decimals: 2,
			example: '750000.00'
		}
	},
	equity: {
		type: 'NumberRange',
		options: {
			min: 50000,
			max: 5000000,
			decimals: 2,
			example: '500000.00'
		}
	}
};

export const w2TaxForm: Record<string, DataTypeConfig> = {
	// Employer Info
	employerName: { type: 'Company', options: { example: 'Acme Corporation' } },
	employerEin: {
		type: 'NumberRange',
		options: {
			min: 100000000,
			max: 999999999,
			decimals: 0,
			example: '12-3456789'
		}
	},
	employerAddress: { type: 'StreetAddress' },
	employerCity: { type: 'City', options: { source: 'any', selectedCountries: [], targetRowId: '' } },
	employerState: {
		type: 'Region',
		options: {
			source: 'anyRegion',
			selectedCountries: [],
			targetRowId: '',
			formats: ['full']
		}
	},
	employerZip: { type: 'PostalZip', options: { source: 'any', selectedCountries: ['US'], targetRowId: '' } },

	// Employee Info
	employeeName: {
		type: 'Names',
		options: {
			example: 'Jane Smith',
			options: ['Name Surname'],
			source: 'any',
			selectedCountries: []
		}
	},
	employeeSsn: {
		type: 'NumberRange',
		options: {
			min: 100000000,
			max: 999999999,
			decimals: 0,
			example: '123-45-6789'
		}
	},
	employeeAddress: { type: 'StreetAddress' },
	employeeCity: { type: 'City', options: { source: 'any', selectedCountries: [], targetRowId: '' } },
	employeeState: {
		type: 'Region',
		options: {
			source: 'anyRegion',
			selectedCountries: [],
			targetRowId: '',
			formats: ['full']
		}
	},
	employeeZip: { type: 'PostalZip', options: { source: 'any', selectedCountries: ['US'], targetRowId: '' } },

	// Income and Tax Info
	wagesTipsOtherComp1: currencyOptions('30000.00', '150000.00'),
	federalIncomeTaxWithheld2: currencyOptions('3000.00', '30000.00'),
	socialSecurityWages3: currencyOptions('30000.00', '150000.00'),
	socialSecurityTaxWithheld4: currencyOptions('1800.00', '9300.00'),
	medicareWagesAndTips5: currencyOptions('30000.00', '150000.00'),
	medicareTaxWithheld6: currencyOptions('500.00', '3000.00'),
	socialSecurityTips7: currencyOptions('0.00', '5000.00'),
	allocatedTips8: currencyOptions('0.00', '5000.00'),
	dependentCareBenefits10: currencyOptions('0.00', '5000.00'),
	nonQualifiedPlans11: currencyOptions('0.00', '20000.00'),

	// Box 12 codes
	codeDd12a: currencyOptions('0.00', '10000.00'),
	codeD12b: currencyOptions('0.00', '10000.00'),

	// Box 13
	statutoryEmployee13: { 
		type: 'Boolean', 
		options: {
			example: 'Yes|No',
			values: ['Yes', 'No']
		}
	},
	retirementPlan13: {
		type: 'Boolean',
		options: {
			example: 'Yes|No',
			values: ['Yes', 'No']
		}
	},
	thirdPartySickPay13: { 
		type: 'Boolean',
		options: {
			example: 'Yes|No',
			values: ['Yes', 'No']
		},
	},

	// Box 14
	otherDescription14: {
		type: 'Constant',
		options: {
			loopCount: 1,
			values: ['Union Dues']
		}
	},

	// State and Local Info
	state15: { 
		type: 'Region',
		options: {
			source: 'anyRegion',
			selectedCountries: [],
			targetRowId: '',
			formats: ['full']
		}
	},
	stateWagesTips16: currencyOptions('30000.00', '150000.00'),
	stateIncomeTax17: currencyOptions('1000.00', '10000.00'),
	localWagesTips18: currencyOptions('30000.00', '150000.00'),
	localIncomeTax19: currencyOptions('500.00', '5000.00'),

	localityName20: { type: 'City', options: { source: 'any', selectedCountries: [], targetRowId: '' } },

	// Filing Info
	taxYear: {
		type: 'Date',
		options: {
			fromDate: parseInt(format(subYears(new Date(), 5), 't'), 10),
			toDate: parseInt(format(new Date(), 't'), 10),
			example: '2024',
			format: 'yyyy'
		}
	}
};

export const accountingTemplates = {
	taxReturn,
	invoice,
	expenseReport,
	// auditLog,
	balanceSheet,
	w2TaxForm
};
