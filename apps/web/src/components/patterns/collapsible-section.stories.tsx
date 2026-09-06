import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { Badge } from '@/components/ui/badge';
import { CollapsibleSection } from './collapsible-section';

const fixture = storybookMoleculeStates.collapsible;

const meta = {
  title: 'Molecules/Context/Collapsible Section',
  component: CollapsibleSection,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.collapsibleSection),
  args: { title: fixture.title, open: true, onOpenChange: () => {}, children: null },
} satisfies Meta<typeof CollapsibleSection>;

export default meta;
type Story = StoryObj<typeof meta>;

function SummaryBody() {
  return (
    <dl className="grid gap-3">
      {fixture.items.map((item) => (
        <div key={item.term} className="grid gap-0.5">
          <dt className="text-muted-foreground text-xs font-medium">{item.term}</dt>
          <dd className="text-sm">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

function Indicators({ labels = fixture.indicators.map((i) => i.label) }: { labels?: string[] }) {
  return (
    <>
      {labels.map((label) => (
        <Badge key={label} variant="destructive">
          {label}
        </Badge>
      ))}
    </>
  );
}

function Controlled({
  defaultOpen = true,
  indicators,
  title = fixture.title,
  evidence,
}: {
  defaultOpen?: boolean;
  indicators?: React.ReactNode;
  title?: string;
  evidence?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div data-evidence={evidence} className="max-w-2xl">
      <CollapsibleSection
        title={title}
        summary={fixture.summary}
        open={open}
        onOpenChange={setOpen}
        indicators={indicators}
      >
        <SummaryBody />
      </CollapsibleSection>
    </div>
  );
}

export const Default: Story = {
  render: () => <Controlled indicators={<Indicators />} evidence="collapsible-open" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /Health summary/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(canvas.getByText('Current medicines')).toBeVisible();
  },
};

/**
 * The reason this exists rather than a bare disclosure: closed, the allergy and the interpreter
 * requirement are still on screen, and the summary still says how much is inside.
 */
export const Closed: Story = {
  render: () => (
    <Controlled defaultOpen={false} indicators={<Indicators />} evidence="collapsible-closed" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Anaphylaxis: amoxicillin')).toBeVisible();
    await expect(canvas.getByText('Interpreter required — Dari')).toBeVisible();
    await expect(canvas.getByText(fixture.summary)).toBeVisible();

    // Closed means gone, not merely invisible: nothing inside stays in the tab order.
    await expect(canvas.queryByText('Current medicines')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: /Health summary/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  },
};

export const WithIndicators: Story = {
  render: () => <Controlled indicators={<Indicators />} />,
};

/**
 * A long allergy is not shortened. A truncated "Anaphylaxis: amoxicillin…" that hides the rest of
 * the beta-lactam class is a prescribing risk, so the indicator wraps and the row grows.
 */
export const ContentStress: Story = {
  render: () => (
    <Controlled
      defaultOpen={false}
      title="Health summary, open obligations and recorded safety alerts"
      indicators={<Indicators labels={[fixture.longIndicator]} />}
    />
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <div data-evidence="collapsible-narrow" className="w-full max-w-full">
      <Controlled
        defaultOpen={false}
        title="Health summary, open obligations and recorded safety alerts"
        indicators={<Indicators labels={[fixture.longIndicator, fixture.indicators[1].label]} />}
      />
    </div>
  ),
};

/**
 * The disclosure is a native button inside the heading, so it is reachable by Tab and by heading
 * navigation, and toggling never moves focus off it.
 */
export const KeyboardFlow: Story = {
  render: () => <Controlled indicators={<Indicators />} evidence="collapsible-keyboard" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: /Health summary/ });

    await userEvent.tab();
    await expect(toggle).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await waitFor(async () => {
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });
    // Losing focus here would drop a keyboard operator back to the top of the record.
    await expect(toggle).toHaveFocus();
    await expect(canvas.getByText('Anaphylaxis: amoxicillin')).toBeVisible();

    await userEvent.keyboard('{Enter}');
    await waitFor(async () => {
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });
    await expect(toggle).toHaveFocus();
  },
};
