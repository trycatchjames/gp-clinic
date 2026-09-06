import contractRegistry from './foundation-contracts.json';

export type FoundationContract = {
  contractId: string;
  layer: 'atom' | 'molecule';
  specRef: string;
  source: string;
  storyFile: string;
  evidence: readonly string[];
};

export const foundationContracts = contractRegistry as Readonly<{
  button: FoundationContract;
  badge: FoundationContract;
  card: FoundationContract;
  avatar: FoundationContract;
  table: FoundationContract;
  separator: FoundationContract;
  alert: FoundationContract;
  progress: FoundationContract;
  skeleton: FoundationContract;
  input: FoundationContract;
  textarea: FoundationContract;
  label: FoundationContract;
  checkbox: FoundationContract;
  radioGroup: FoundationContract;
  switchControl: FoundationContract;
  select: FoundationContract;
  tabs: FoundationContract;
  dialog: FoundationContract;
  dropdownMenu: FoundationContract;
  tooltip: FoundationContract;
  sheet: FoundationContract;
  field: FoundationContract;
  filterBar: FoundationContract;
  listView: FoundationContract;
  contextBanner: FoundationContract;
  statePanel: FoundationContract;
  summaryList: FoundationContract;
  dataTable: FoundationContract;
  comboboxField: FoundationContract;
  dateField: FoundationContract;
  dateRangeField: FoundationContract;
  timeField: FoundationContract;
  fileInputField: FoundationContract;
  consequenceConfirmation: FoundationContract;
  toastRegion: FoundationContract;
  saveState: FoundationContract;
  formErrorSummary: FoundationContract;
  formSection: FoundationContract;
  collapsibleSection: FoundationContract;
  actionBar: FoundationContract;
}>;

const repositoryUrl = 'https://github.com/trycatchjames/gp-clinic/blob/main';

export function foundationParameters(contract: FoundationContract) {
  const evidence = contract.evidence.map((id) => `\`${id}\``).join(', ');
  const description = [
    `[${contract.contractId}](${repositoryUrl}/${contract.specRef})`,
    `Source: \`${contract.source}\``,
    `Evidence: ${evidence}`,
  ].join(' · ');

  return {
    designSystem: contract,
    docs: {
      description: {
        component: description,
      },
    },
  };
}
