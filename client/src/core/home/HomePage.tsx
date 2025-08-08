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
import { getSortedGroupedDataTypes } from '~utils/dataTypeUtils';
import store from '../store';
import { batch } from 'react-redux';
import { allTemplates, TemplateOption, TemplateKey } from '../../templates';

type DataTypeOption = {
	value: DataTypeFolder;
	label: string;
};

const exportFormats = ['JSON', 'CSV', 'SQL', 'XML', 'HTML', 'Javascript', 'Typescript', 'PHP', 'Pearl', 'C#', 'Ruby', 'Python'];

const HomePage: React.FC = () => {
	const availableCohorts = ['Tax-Accounting', 'Healthcare'];

	const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
	const [selectedDataTypes, setSelectedDataTypes] = useState<DataTypeFolder[]>([]);
	const [selectedTemplate, setSelectedTemplate] = useState<string>('');
	const [selectedCohort, setSelectedCohort] = useState<string>(availableCohorts[0]);
	const history = useHistory();
	const dispatch = useDispatch();

	const dataTypeOptions: Array<DataTypeOption> = getSortedGroupedDataTypes()
		.flatMap((group: any) => group.options)
		.slice(0, 12);

	const filteredTemplates = Object.entries(allTemplates)
		.filter(([key]) => key.startsWith(selectedCohort.toLowerCase()))
		.map(([key, mets]) => ({
			label: mets.label,
			value: key
		}));
		  
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
		if (!selectedTemplate) return;
	
		const template = allTemplates[selectedTemplate];
		const fieldMap = template.data;
		const fieldNames = Object.keys(fieldMap);
		const fieldTypes = Object.values(fieldMap);
		setSelectedDataTypes(fieldTypes);
	
		await dispatch(clearPage(false));
		await dispatch(addRows(fieldTypes.length));
	
		const rows = Object.values(store.getState().generator.rows).slice(-fieldTypes.length);
		batch(() => {
			rows.forEach((row: any, i: number) => {
				dispatch(onSelectDataType(fieldTypes[i], row.id));
				dispatch(onChangeTitle(row.id, fieldNames[i]));
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

				<div>
					<h4><span className={styles.stepNumber}>1</span> Choose a template type</h4>
					<div className={styles.categorySelector}>
						{availableCohorts.map(category => (
							<div
								key={category}
								className={`${styles.pill} ${selectedCohort === category ? styles.selected : ''}`}
								onClick={() => {
									setSelectedCohort(category);
									setSelectedTemplate('');
								}}
							>
								{category.toUpperCase()}
							</div>
						))}
					</div>
				</div>

				<div className={styles.stepWrapper}>
					<div>
						<h4>
							<span className={styles.stepNumber}>2</span> Choose a template
						</h4>
						<div className={styles.dataTypes}>
							{filteredTemplates.map(({ value, label }) => (
								<div
									key={value}
									className={`${styles.tile} ${selectedTemplate === value ? styles.selected : ''}`}
									onClick={() => setSelectedTemplate(value)}
								>
									{label}
								</div>
							))}
						</div>
					</div>

					<div>
						<h4>
							<span className={styles.stepNumber}>2</span> Choose a data format
						</h4>
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
