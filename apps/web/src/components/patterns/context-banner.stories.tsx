import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { TriangleAlert } from 'lucide-react';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContextBanner } from './context-banner';

const fixture = storybookMoleculeStates.contextBanner;

const meta = {
  title: 'Molecules/Context/Context Banner',
  component: ContextBanner,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.contextBanner),
  args: {
    contextLabel: fixture.contextLabel,
    title: fixture.title,
    description: fixture.description,
    facts: fixture.facts,
  },
} satisfies Meta<typeof ContextBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

const safetyNotice = (
  <p className="flex items-start gap-2 font-medium">
    <TriangleAlert aria-hidden="true" className="text-destructive mt-0.5 size-4 shrink-0" />
    {fixture.notice}
  </p>
);

const actions = (
  <>
    <Button size="sm">{fixture.primaryAction}</Button>
    <Button size="sm" variant="outline">
      {fixture.secondaryAction}
    </Button>
  </>
);

export const Default: Story = {};

export const WithStatus: Story = {
  args: {
    status: <Badge variant="success">{fixture.status}</Badge>,
  },
};

/**
 * The notice region is where a capability puts something that must be read before acting. It sits
 * below the identity rather than replacing it, so the operator never loses track of whose record
 * the warning belongs to.
 */
export const WithNotice: Story = {
  args: {
    status: <Badge variant="success">{fixture.status}</Badge>,
    notice: safetyNotice,
  },
  play: async ({ canvasElement }) => {
    const banner = within(canvasElement).getByRole('region', { name: fixture.title });
    await expect(within(banner).getByText(fixture.notice)).toBeVisible();
  },
};

export const WithActions: Story = {
  args: {
    status: <Badge variant="success">{fixture.status}</Badge>,
    notice: safetyNotice,
    actions,
  },
};

/**
 * Absent facts are stated, not dropped. A missing Medicare number reads as "Not recorded" because
 * a fact that silently disappears looks like one that was never needed.
 */
export const MissingOptionalFacts: Story = {
  args: {
    facts: fixture.partialFacts,
    description: undefined,
    status: <Badge variant="outline">Details incomplete</Badge>,
  },
};

export const States: Story = {
  render: () => (
    <section
      data-evidence="context-banner-states"
      aria-label="Context banner states"
      className="grid max-w-5xl gap-4"
    >
      <ContextBanner
        contextLabel={fixture.contextLabel}
        title={fixture.title}
        description={fixture.description}
        facts={fixture.facts}
      />
      <ContextBanner
        contextLabel={fixture.contextLabel}
        title={fixture.noticeTitle}
        description={fixture.noticeDescription}
        status={<Badge variant="success">{fixture.status}</Badge>}
        facts={fixture.noticeFacts}
        actions={actions}
        notice={safetyNotice}
      />
      <ContextBanner
        contextLabel={fixture.contextLabel}
        title={fixture.incompleteTitle}
        description={fixture.incompleteDescription}
        status={<Badge variant="outline">Details incomplete</Badge>}
        facts={fixture.incompleteFacts}
      />
    </section>
  ),
};

export const ContentStress: Story = {
  args: {
    title: fixture.longTitle,
    description: fixture.longDescription,
    status: <Badge variant="warning">Inactive since March</Badge>,
    actions,
    notice: <p className="leading-relaxed">{fixture.longNotice}</p>,
  },
};

/**
 * At 360 pixels the actions move below the context instead of squeezing the name. Identity, status
 * and the notice all stay visible.
 */
export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <section data-evidence="context-banner-narrow" aria-label="Context banner narrow">
      <ContextBanner
        contextLabel={fixture.contextLabel}
        title={fixture.longTitle}
        description={fixture.longDescription}
        status={<Badge variant="warning">Inactive since March</Badge>}
        facts={fixture.facts}
        actions={actions}
        notice={safetyNotice}
      />
    </section>
  ),
};
