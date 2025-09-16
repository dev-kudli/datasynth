import * as React from 'react';
import NumberFormat from 'react-number-format';
import env from '../../../_env';
import Button from '@material-ui/core/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '~components/dialogs';
import { getI18nString } from '~utils/langUtils';
import { getFormattedNum } from '~utils/numberUtils';
import styles from './ActivityPanel.scss';
import sharedStyles from '../../styles/shared.scss';
import { ErrorTooltip } from '~components/tooltips';
import { MediumSpinner } from '~components/loaders/loaders';
import Engine from './Engine.container';
import { DataPacket } from '~store/packets/packets.reducer';
import C from '~core/constants';
import * as coreUtils from '~utils/coreUtils';
import CheckIcon from '@material-ui/icons/Check';

export type GenerationSettingsProps = {
	visible: boolean;
	packet: DataPacket | null;
	isLoggedIn: boolean;
	isGenerating: boolean;
	onChangeNumRowsToGenerate: (numRows: number) => void;
	onClose: () => void;
	onGenerate: () => void;
	onAbort: () => void;
	onDownload: () => void;
	numRowsToGenerate: number;
	i18n: any;
	stripWhitespace: boolean;
	onToggleStripWhitespace: () => void;
	workerResources: any;
};

const GenerationSettingsPanel = ({
	visible, isLoggedIn, onClose, i18n, stripWhitespace, numRowsToGenerate, onChangeNumRowsToGenerate,
	onToggleStripWhitespace, onGenerate, isGenerating, packet, onAbort, onDownload
}: GenerationSettingsProps): JSX.Element => {
	let error = '';

	if (!numRowsToGenerate) {
		error = i18n.requiredField;
	} else if (!isLoggedIn && numRowsToGenerate > env.maxDemoModeRows) {
		error = getI18nString(i18n.overMaxAnonRows, [getFormattedNum(env.maxDemoModeRows)]);
	}

	const getEngine = (): JSX.Element | null => {
		if (!visible || !isGenerating) {
			return null;
		}

		return (
			<Engine />
		);
	};

	const getGenerationOverlay = (): JSX.Element | null => {
		if (!isGenerating || !packet) {
			return null;
		}

		const { numGeneratedRows } = packet;

		if (packet.numGeneratedRows === numRowsToGenerate) {
			return (
				<>
					<div className={styles.generationOverlayBg} />
					<div className={styles.generationComplete}>
						<CheckIcon fontSize="large" />
						{i18n.dataGenerated}
					</div>
				</>
			);
		}

		return (
			<>
				<div className={styles.generationOverlayBg} />
				<div className={styles.generationOverlay}>
					<MediumSpinner style={{ margin: 15 }} />
					<div className={styles.generationLabel}>
						{i18n.generated} <b>{numGeneratedRows}</b> / <b>{numRowsToGenerate}</b>
					</div>
				</div>
			</>
		);
	};

	let buttonLabel = i18n.generate;
	let actionButtonClick = onGenerate;
	let actionButtonDisabled = !!error;

	const uploadButtonClick = async () => {
		const EXISTDB_URL = "http://localhost:8080/exist/rest/db";
		const COLLECTION = "w2_staging";
		const timestamp = new Date().toISOString().replace(/[:.-]/g, "").slice(0, 15); // e.g. 20250909T153000
		const DOCUMENT_NAME = `w2_${timestamp}.xml`;
		const FULL_URL = `${EXISTDB_URL}/${COLLECTION}/${DOCUMENT_NAME}`;
	
		const AUTH = {
			username: 'admin',
			password: ''
		};
	
		const w2Xml = `<?xml version="1.0" encoding="UTF-8"?>
			<W2Form>
				<Employee>
					<FirstName>John</FirstName>
					<LastName>Doe</LastName>
					<SSN>123-45-6789</SSN>
				</Employee>
				<Employer>
					<Name>Example Corp</Name>
					<EIN>12-3456789</EIN>
					<Address>
					<Street>123 Business Rd</Street>
					<City>Metropolis</City>
					<State>NY</State>
					<ZIP>10001</ZIP>
					</Address>
				</Employer>
				<Wages>
					<WagesAmount>55000.00</WagesAmount>
					<FederalIncomeTaxWithheld>5000.00</FederalIncomeTaxWithheld>
					<SocialSecurityWages>55000.00</SocialSecurityWages>
					<SocialSecurityTaxWithheld>3410.00</SocialSecurityTaxWithheld>
					<MedicareWages>55000.00</MedicareWages>
					<MedicareTaxWithheld>797.50</MedicareTaxWithheld>
				</Wages>
				<TaxYear>2024</TaxYear>
			</W2Form>`; // Replace with your actual XML content
	
		try {
			const resp = await fetch(FULL_URL, {
				method: 'PUT',
				body: new TextEncoder().encode(w2Xml),
				// Basic Auth
				headers: {
					'Content-Type': 'application/xml',
					'Authorization': 'Basic ' + btoa(`${AUTH.username}:${AUTH.password}`)
				}
			});
	
			if ([200, 201, 204].includes(resp.status)) {
				console.log("✅ XML uploaded successfully!");
			} else {
				const text = await resp.text();
				console.error("❌ Upload failed:", resp.status, text);
			}
		} catch (error) {
			console.error("❌ Error during upload:", error);
		}
	};	

	if (packet) {
		if (packet.numGeneratedRows === numRowsToGenerate) {
			buttonLabel = i18n.download;
			actionButtonClick = onDownload;
			actionButtonDisabled = false;
		}
	}

	const closeModal = (): void => {
		if (packet) {
			const { dataTypeWorkerId } = packet;
			const dataTypeWorker = coreUtils.getDataTypeWorker(dataTypeWorkerId);

			onAbort();
			onClose();
			dataTypeWorker.postMessage({ action: C.ACTIVITY_PANEL_ACTIONS.ABORT });
			coreUtils.destroyDataTypeWorker(dataTypeWorkerId);
		} else {
			onClose();
		}
	};

	let cancelButton: any = <Button onClick={closeModal} color="default">{i18n.cancel}</Button>;
	if (packet && packet.numGeneratedRows === numRowsToGenerate) {
		cancelButton = null;
	}

	return (
		<>
			<Dialog onClose={onClose} open={visible}>
				<div style={{ width: 400 }}>
					<DialogTitle onClose={closeModal}>{i18n.generate}</DialogTitle>
					<DialogContent dividers className={styles.generationSettingsContent}>
						{getGenerationOverlay()}
						<div className={`${styles.row} ${styles.generationRow}`}>
							{i18n.generate}
							<ErrorTooltip title={error} arrow disableHoverListener={!error} disableFocusListener={!error}>
								<NumberFormat
									className={error ? sharedStyles.errorField : ''}
									value={numRowsToGenerate}
									displayType="input"
									autoFocus
									thousandSeparator={true}
									onValueChange={({ value }): void => onChangeNumRowsToGenerate(parseInt(value, 10))}
								/>
							</ErrorTooltip>
							{i18n.rows}
						</div>
						<div className={styles.row} style={{ marginBottom: 16 }}>
							<input
								type="checkbox"
								id="stripWhitespace"
								checked={stripWhitespace}
								onChange={onToggleStripWhitespace}
							/>
							<label htmlFor="stripWhitespace">{i18n.stripWhitespace}</label>
						</div>
					</DialogContent>
					<DialogActions>
						{cancelButton}
						<Button
							type="submit"
							onClick={actionButtonClick}
							color="primary"
							disabled={actionButtonDisabled}
							disableElevation
							variant="contained"
						>
							{buttonLabel}
						</Button>
						<Button
							type="submit"
							onClick={uploadButtonClick}
							color="primary"
							disabled={actionButtonDisabled}
							disableElevation
							variant="contained"
						>
							upload
						</Button>
					</DialogActions>
				</div>
			</Dialog>
			{getEngine()}
		</>
	);
};

export default GenerationSettingsPanel;
