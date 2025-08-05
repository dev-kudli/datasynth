import React, { useMemo } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Measure from 'react-measure';
import { useWindowSize } from 'react-hooks-window-size';
import * as styles from './Grid.scss';
import { PrimaryButton } from '~components/Buttons.component';
import { DataRow } from '~store/generator/generator.reducer';
import { DataTypeFolder, ExportTypeFolder } from '../../../../_plugins';
import GridRow from './GridRow.container';
import C from '../../constants';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '~components/dialogs';
import * as astyles from '../../dialogs/about/About.scss';
import RadioPill, { RadioPillRow } from '~components/pills/RadioPill';
import Dropdown from '~components/dropdown/Dropdown';
import store from '../../store';
import { useDispatch } from 'react-redux';
import {
	clearPage,
	addRows,
	onSelectDataType,
	onSelectExportType,
	refreshPreview
} from '~store/generator/generator.actions';
import { allTemplates, TemplateKey } from '../../../templates';

export type GridProps = {
	rows: DataRow[];
	onAddRows: (numRows: number) => void;
	onSort: (id: string, newIndex: number) => void;
	toggleGrid: () => void;
	i18n: any;
	columnTitle: string;
	changeSmallScreenVisiblePanel: () => void;
	showHelpDialog: (section: DataTypeFolder) => void;
	onClearPage: (addDefaultRows: boolean) => void;
};

export type AboutProps = {
	visible: boolean;
	onClose: any;
	scriptVersion: string;
	i18n: any;
	data: string;
	onAddRows: (numRows: number) => void;
	onLoaded?: () => void;
};

export const enum Cohort {
	happydr = 'happydr',
	accounting = 'accounting',
}

const patient = {
	name: 'Names',
	phone: 'Phone',
	City: 'City',
};

const AboutDialog = ({ visible, onClose, scriptVersion, i18n, data, onAddRows }: AboutProps): JSX.Element => {
	const [selectedCohort, setSelectedCohort] = React.useState<Cohort>(Cohort.accounting);

	const handleSelect = (cohort: Cohort): void => {
		setSelectedCohort(cohort);
	};

	const dispatch = useDispatch();

	const getCohortDropdown = (): React.ReactNode => {
		const filteredTemplates = Object.entries(allTemplates)
			.filter(([key]) => key.startsWith(selectedCohort))
			.map(([key]) => ({
				label: key.replace(`${selectedCohort}.`, ''),
				value: key
			}));
	
		if (filteredTemplates.length === 0) return null;
	
		return (
			<Dropdown
				options={filteredTemplates}
				onChange={async (val: { value: TemplateKey }) => {
					const template = allTemplates[val.value];
					const numRows = Object.keys(template).length;
				
					await dispatch(clearPage(false));
					await dispatch(addRows(numRows));
				
					const state = store.getState();
					const rows = Object.values(state.generator.rows).slice(-numRows);
				
					for (let idx = 0; idx < Object.entries(template).length; idx++) {
						const [, dataType] = Object.entries(template)[idx];
						const row: any = rows[idx];
						await dispatch(onSelectDataType(dataType as DataTypeFolder, row.id));
					}
				}}
			/>
		);
	};
	

	return (
		<Dialog onClose={onClose} open={visible} className={astyles.aboutDialog}>
			<div style={{ maxWidth: 500 }}>
				<DialogTitle onClose={onClose}>Select your cohort</DialogTitle>
				<DialogContent dividers>
					<div>
						Choose prebuilt templates for your application
					</div>

					<h3>Source</h3>

					<RadioPillRow>
						<RadioPill
							label={i18n.accountingpt}
							onClick={(): void => handleSelect(Cohort.accounting)}
							name={`cohort-source`}
							checked={selectedCohort === Cohort.accounting}
							tooltip={i18n.anyDesc}
							style={{ marginRight: '5px' }}
						/>
						<RadioPill
							label={i18n.happydr}
							onClick={(): void => handleSelect(Cohort.happydr)}
							name={`cohort-source`}
							checked={selectedCohort === Cohort.happydr}
							tooltip={i18n.anyDesc}
						/>
					</RadioPillRow>

					{getCohortDropdown()}
					<div style={{ padding: '16px', textAlign: 'right' }}>
						<Button
							type="submit"
							disableElevation
							color="primary"
							variant="contained"
							onClick={onClose}
						>
							Save
						</Button>
					</div>
				</DialogContent>
			</div>
		</Dialog>
	);
};

const Grid = ({
	rows, onAddRows, onSort, i18n, columnTitle, toggleGrid, changeSmallScreenVisiblePanel,
	showHelpDialog, onClearPage
}: GridProps): JSX.Element => {
	const [numRows, setNumRows] = React.useState(1);
	const [dimensions, setDimensions] = React.useState<any>({ height: 0, width: 0 });
	const [showAboutDialog, setAboutDialogVisibility] = React.useState(false);

	const windowSize = useWindowSize();
	const dispatch = useDispatch();

	let gridSizeClass = '';
	if (dimensions.width < C.GRID.SMALL_BREAKPOINT) {
		gridSizeClass = styles.gridSmall;
	} else if (dimensions.width < C.GRID.MEDIUM_BREAKPOINT) {
		gridSizeClass = styles.gridMedium;
	}

	const addRowsBtnLabel = numRows === 1 ? i18n.row : i18n.rows;

	// uber-kludge. Ensures we're passing the same dimensions object ref to prevent repaints of GridRow
	const memoizedDimensions = useMemo(() => (dimensions), [
		dimensions.bottom,
		dimensions.height,
		dimensions.left,
		dimensions.right,
		dimensions.top,
		dimensions.width
	]);

	return (
		<>
			<AboutDialog 
				visible={showAboutDialog}
				onClose={async (): Promise<void> => {
					await dispatch(refreshPreview());
					setAboutDialogVisibility(false);
				}}
				scriptVersion={"v1"}
				i18n={i18n}
				data='happydr'
				onAddRows={onAddRows}
			/>
			<Button
				type="submit"
				color="primary"
				variant="contained"
				disableElevation
				onClick={(): void => setAboutDialogVisibility(true)}
			>
				Load
			</Button>
							
			<Measure
				bounds
				onResize={(contentRect: any): void => setDimensions(contentRect.bounds)}
			>
				{({ measureRef }): any => (
					<div className={`${styles.gridWrapper} ${gridSizeClass}`} ref={measureRef}>
						<div>
							<div className={styles.gridHeaderWrapper}>
								<div className={`${styles.gridRow} ${styles.gridHeader} tour-gridHeader`} style={{ flex: `0 0 auto` }}>
									<div className={styles.orderCol}>{rows.length}</div>
									<div className={styles.dataTypeCol}>
										{i18n.dataType}
									</div>
									<div className={styles.titleCol}>{columnTitle}</div>
									<div className={styles.examplesCol}>{i18n.examples}</div>
									<div className={styles.optionsCol}>{i18n.options}</div>
									<div className={styles.settingsIconCol} />
									<div className={styles.deleteCol} />
								</div>
							</div>
						</div>
						<div className={`${styles.scrollableGridRows} tour-scrollableGridRows`}>
							<div className={`${styles.gridRowsWrapper} tour-gridRows`}>
								<DragDropContext onDragEnd={({ draggableId, destination }: any): any => onSort(draggableId, destination.index)}>
									<Droppable droppableId="droppable">
										{(provided: any): any => (
											<div
												className={styles.grid}
												{...provided.droppableProps}
												ref={provided.innerRef}
											>
												{rows.map((row, index) => (
													<GridRow
														row={row}
														key={row.id}
														index={index}
														gridPanelDimensions={memoizedDimensions}
														showHelpDialog={showHelpDialog}
													/>
												))}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</DragDropContext>

								<form onSubmit={(e): any => e.preventDefault()} className={`${styles.addRows} tour-addRows`}>
									<span>{i18n.add}</span>
									<input type="number"
										   value={numRows}
										   onChange={(e): void => setNumRows(parseInt(e.target.value, 10))}
										   min={1}
										   max={1000}
										   step={1}
									/>
									<PrimaryButton size="small" onClick={(): void => onAddRows(numRows)}>
										{addRowsBtnLabel}
									</PrimaryButton>
								</form>
							</div>
						</div>
					</div>
				)}
			</Measure>
		</>
	);
};

export default Grid;
