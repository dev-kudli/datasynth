import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.scss';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { onSelectExportType, dataTypeLoaded, addRows, onSelectDataType, clearPage } from '~store/generator/generator.actions';
import { ExportTypeFolder, DataTypeFolder } from '../../../_plugins';
import { getSortedGroupedDataTypes } from '~utils/dataTypeUtils';
import { GDAction } from '~types/general';

type DataTypeOption = {
	value: DataTypeFolder;
	label: string;
};

const exportFormats = ['JSON', 'CSV', 'SQL', 'XML', 'HTML', 'Javascript', 'Typescript', 'PHP', 'Pearl', 'C#', 'Ruby', 'Python'];

const HomePage: React.FC = () => {
	const rows = useSelector((state: any) => state.generator?.rows || []);
	console.log('Current rows:', rows);

	const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
	const history = useHistory();
	const dispatch = useDispatch();

	const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
	const dataTypeOptions: Array<{ value: DataTypeFolder; label: string }> = getSortedGroupedDataTypes()
		.flatMap((group: any) => group.options)
		.slice(0, 12);

	const handleSelectOutputFormat = (format: string) => {
		console.log('format', format);
		setSelectedFormat(format);
		dispatch(onSelectExportType(format as ExportTypeFolder));
	};

	const [selectedDataTypes, setSelectedDataTypes] = useState<DataTypeFolder[]>([]);

	const toggleDataType = (type: DataTypeFolder) => {
		setSelectedDataTypes(prev =>
			prev.includes(type)
				? prev.filter(t => t !== type)
				: [...prev, type]
		);
	};
	return (
		<div className={styles.homepage}>
			<section className={styles.hero}>
				<h1>Generate test data. Quickly.</h1>
				<h2>
					Then spend time on more important things. Like
					<span className={styles.fade}> ...really anything.</span>
				</h2>
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
				<h2>Quick Start <span>— or skip to the generator</span></h2>

				<div className={styles.stepWrapper}>
					<div>
						<h4>
							<span className={styles.stepNumber}>1</span> Choose the types of data you want
						</h4>
						<div className={styles.dataTypes}>
							{dataTypeOptions.map(({ value, label }) => (
								<div
									key={value}
									className={`${styles.tile} ${selectedDataTypes.includes(value) ? styles.selected : ''}`}
									onClick={() => toggleDataType(value)}
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
							{exportFormats.map((format): JSX.Element => (
								<div
									key={format}
									className={`${styles.tile} ${selectedFormat === format ? styles.selected : ''}`}
									onClick={(): void => handleSelectOutputFormat(format)}
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
						onClick={() => {
							// dispatch(clearPage(false));
							dispatch(addRows(selectedDataTypes.length));
							Object.values(rows).slice(0, selectedDataTypes.length).forEach((row: any, index) => {
								dispatch(onSelectDataType(selectedDataTypes[index], row.id));
							});
							history.push('/generator');
						}}
					>
						Generate
					</button>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
