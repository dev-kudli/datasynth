import React, { useState } from 'react';
import styles from './HomePage.module.scss';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
	clearPage,
	addRows,
	onSelectDataType,
	onSelectExportType,
	refreshPreview,
	onChangeTitle
} from '~store/generator/generator.actions';
import { ExportTypeFolder, DataTypeFolder } from '../../../_plugins';
import { w2TaxForm } from '../../templates/accounting';
import { getSortedGroupedDataTypes } from '~utils/dataTypeUtils';
import store from '../store';
import { batch } from 'react-redux';

type DataTypeOption = {
	value: DataTypeFolder;
	label: string;
};

type TaxFormType =
	| 'w2'
	| '1099_int'
	| '1099_div'
	| '1099_misc'
	| '1099_nec'
	| '1099_b'
	| '1098'
	| '1040'
	| 'schedule_c'
	| 'schedule_d'
	| 'k1'
	| 'ssn_card';

type TaxFormOption = {
	value: TaxFormType;
	label: string;
};

const exportFormats = ['JSON', 'CSV', 'SQL', 'XML', 'HTML', 'Javascript', 'Typescript', 'PHP', 'Pearl', 'C#', 'Ruby', 'Python'];
const taxFormMap: Record<string, Record<string, DataTypeFolder>> = {
	w2: w2TaxForm,
};

const HomePage: React.FC = () => {
	const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
	const [selectedDataTypes, setSelectedDataTypes] = useState<DataTypeFolder[]>([]);
	const [selectedTaxForm, setSelectedTaxForm] = useState<TaxFormType | null>(null);
	const history = useHistory();
	const dispatch = useDispatch();

	const dataTypeOptions: Array<DataTypeOption> = getSortedGroupedDataTypes()
		.flatMap((group: any) => group.options)
		.slice(0, 12);

	const taxFormOptions: Array<TaxFormOption> = [
		{ value: "w2", label: "W-2" },
		{ value: "1099_int", label: "1099-INT" },
		{ value: "1099_div", label: "1099-DIV" },
		{ value: "1099_misc", label: "1099-MISC" },
		{ value: "1099_nec", label: "1099-NEC" },
		{ value: "1099_b", label: "1099-B" },
		{ value: "1098", label: "1098" },
		{ value: "1040", label: "1040" },
		{ value: "schedule_c", label: "Schedule C" },
		{ value: "schedule_d", label: "Schedule D" },
		{ value: "k1", label: "K-1" },
		{ value: "ssn_card", label: "SSN Card" },
	];
		  
	const handleGenerate = async () => {
		const numRows = selectedDataTypes.length;

		await dispatch(clearPage(false));
		await dispatch(addRows(numRows));

		const rows = Object.values(store.getState().generator.rows).slice(-numRows);
		rows.forEach((row: any, i: number) => {
			dispatch(onSelectDataType(selectedDataTypes[i], row.id));
		});

		dispatch(onSelectExportType(selectedFormat as ExportTypeFolder));
		dispatch(refreshPreview());

		history.push('/generator');
	};

	const handleGenerateForms = async () => {
		if (!selectedTaxForm) return;
	
		const formFields = Object.values(taxFormMap[selectedTaxForm]);
		const formTitles = Object.keys(taxFormMap[selectedTaxForm]);
		setSelectedDataTypes(formFields);
	
		await dispatch(clearPage(false));
		await dispatch(addRows(formFields.length));
	
		const rows = Object.values(store.getState().generator.rows).slice(-formFields.length);
		batch(() => {
			rows.forEach((row: any, i: number) => {
				dispatch(onSelectDataType(formFields[i], row.id));
				dispatch(onChangeTitle(row.id, formTitles[i]));
			});
			dispatch(onSelectExportType(selectedFormat as ExportTypeFolder));
			// dispatch(refreshPreview());
			history.push('/generator');
		});
		
	};

	return (
		<div className={styles.homepage}>
			<section className={styles.hero}>
				<h1>Generate test data. Quickly.</h1>
				<h2>Then spend time on more important things. Like<span className={styles.fade}> ...really anything.</span></h2>
				<div className={styles.heroActions}>
					<button>Take a tour</button>
				</div>
				<img src="./images/dice180x180.png" alt="Dice icon" />
				<img src="./images/dice512x512.png" alt="Full dice icon" />
			</section>

			<section className={styles.features}>
				<ul>
					<li>Easy-to-use interface</li>
					<li>Preview what you're generating while you're building it</li>
					<li>30+ types of data to generate (names, emails, countries etc.)</li>
				</ul>
				<ul>
					<li>10+ generation formats (JSON, CSV, XML, SQL etc.)</li>
					<li>Provides interconnected data (e.g., related country, region, city)</li>
					<li>Save your data sets (requires user account)</li>
				</ul>
			</section>

			<section className={styles.quickStart}>
				<h2>Choose your domain</h2>

				<div className={styles.stepWrapper}>
					<div>
						<h4><span className={styles.stepNumber}>1</span> Choose the types of tax forms</h4>
						<div className={styles.dataTypes}>
							{taxFormOptions.map(({ value, label }) => (
								<div
									key={value}
									className={`${styles.tile} ${selectedTaxForm === value ? styles.selected : ''}`}
									onClick={() => {
										setSelectedTaxForm(value as TaxFormType);
									}}
								>
									{label}
								</div>
							))}
						</div>
					</div>

					<div>
						<h4><span className={styles.stepNumber}>2</span> Choose a data format</h4>
						<div className={styles.exportFormats}>
							{exportFormats.map(format => (
								<div
									key={format}
									className={`${styles.tile} ${selectedFormat === format ? styles.selected : ''}`}
									onClick={() => setSelectedFormat(format)}
								>
									{format}
								</div>
							))}
						</div>
					</div>
				</div>

				<div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
					<button
						style={{
							padding: '0.75rem 2rem',
							fontSize: '1.1rem',
							borderRadius: '6px',
							border: 'none',
							backgroundColor: '#007bff',
							color: '#fff',
							cursor: 'pointer',
							transition: 'background-color 0.3s ease',
						}}
						onClick={handleGenerateForms}
					>
						Generate
					</button>
				</div>
			</section>

			<section className={styles.quickStart}>
				<h2>Quick Start <span>— or skip to the generator</span></h2>

				<div className={styles.stepWrapper}>
					<div>
						<h4><span className={styles.stepNumber}>1</span> Choose the types of data you want</h4>
						<div className={styles.dataTypes}>
							{dataTypeOptions.map(({ value, label }) => (
								<div
									key={value}
									className={`${styles.tile} ${selectedDataTypes.includes(value) ? styles.selected : ''}`}
									onClick={() =>
										setSelectedDataTypes(prev =>
											prev.includes(value)
												? prev.filter(t => t !== value)
												: [...prev, value]
										)
									}
								>
									{label}
								</div>
							))}
						</div>
					</div>

					<div>
						<h4><span className={styles.stepNumber}>2</span> Choose a data format</h4>
						<div className={styles.exportFormats}>
							{exportFormats.map(format => (
								<div
									key={format}
									className={`${styles.tile} ${selectedFormat === format ? styles.selected : ''}`}
									onClick={() => setSelectedFormat(format)}
								>
									{format}
								</div>
							))}
						</div>
					</div>
				</div>

				<div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
					<button
						style={{
							padding: '0.75rem 2rem',
							fontSize: '1.1rem',
							borderRadius: '6px',
							border: 'none',
							backgroundColor: '#007bff',
							color: '#fff',
							cursor: 'pointer',
							transition: 'background-color 0.3s ease',
						}}
						onClick={handleGenerate}
					>
						Generate
					</button>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
