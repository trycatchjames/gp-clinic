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
  field: FoundationContract;
  statePanel: FoundationContract;
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
