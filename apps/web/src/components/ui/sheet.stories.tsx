import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Button } from './button';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import type { SheetSide } from './sheet';

const fixture = storybookAtomStates.sheet;

const meta = {
  title: 'Atoms/Overlays/Sheet',
  component: Sheet,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.sheet),
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The appointment detail is the honest case for a sheet: too many labelled facts and too long a
 * history for a centred dialog, and a header that must keep naming the patient while the body
 * scrolls.
 */
function AppointmentSheet({
  defaultOpen,
  side = 'right',
  title = fixture.title,
  history,
  /** Screenshot target. The content is portalled, so the marker has to live on it. */
  evidence,
}: {
  defaultOpen?: boolean;
  side?: SheetSide;
  title?: string;
  history?: readonly string[];
  evidence?: string;
}) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">{fixture.trigger}</Button>
      </SheetTrigger>
      <SheetContent side={side} data-evidence={evidence} closeLabel="Close appointment detail">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{fixture.description}</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <dl className="grid gap-3">
            {fixture.facts.map((fact) => (
              <div key={fact.term} className="grid gap-0.5">
                <dt className="text-muted-foreground text-xs font-medium">{fact.term}</dt>
                <dd className="text-sm">{fact.detail}</dd>
              </div>
            ))}
          </dl>
          {history && (
            <div className="mt-6 grid gap-2">
              <h3 className="text-sm font-semibold">Appointment history</h3>
              {history.map((entry) => (
                <p key={entry} className="text-muted-foreground text-sm leading-snug">
                  {entry}
                </p>
              ))}
            </div>
          )}
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">{fixture.secondaryAction}</Button>
          </SheetClose>
          <Button>{fixture.primaryAction}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const Default: Story = {
  render: () => <AppointmentSheet />,
};

export const Open: Story = {
  render: () => <AppointmentSheet defaultOpen evidence="sheet-layout" />,
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: fixture.title });
    await expect(sheet).toHaveAccessibleDescription(fixture.description);
    await expect(within(sheet).getByRole('button', { name: fixture.primaryAction })).toBeVisible();
  },
};

/**
 * The point of the sheet's structure: a body long enough to scroll must not take the identity in
 * the header or the actions in the footer with it.
 */
export const LongContent: Story = {
  render: () => <AppointmentSheet defaultOpen history={fixture.longHistory} />,
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: fixture.title });
    const body = sheet.querySelector('[tabindex="0"]') as HTMLElement;
    const heading = within(sheet).getByRole('heading', { name: fixture.title });
    const action = within(sheet).getByRole('button', { name: fixture.primaryAction });

    // Storybook's test browser does not resolve the stylesheet, so the assertion here is the
    // structural half of the contract: the header and the footer are siblings of the scrolling
    // region, not passengers inside it. That the region actually scrolls is proved by the
    // `sheet-layout` Playwright evidence, which runs against the built Storybook.
    await expect(body).not.toContainElement(heading);
    await expect(body).not.toContainElement(action);

    body.scrollTop = body.scrollHeight;
    await expect(heading).toBeVisible();
    await expect(action).toBeVisible();
  },
};

/**
 * A long compound patient name wraps in the header rather than truncating. A clipped name is a
 * wrong-patient risk, so the header grows instead.
 */
export const LongTitle: Story = {
  render: () => <AppointmentSheet defaultOpen title={fixture.longTitle} />,
};

/**
 * Anchoring to the bottom edge is the narrow-width answer for a detail region: the operator keeps
 * the list behind it and the actions stay within thumb reach.
 */
export const BottomEdge: Story = {
  render: () => <AppointmentSheet defaultOpen side="bottom" history={fixture.longHistory} />,
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <AppointmentSheet
      defaultOpen
      side="bottom"
      title={fixture.longTitle}
      history={fixture.longHistory}
      evidence="sheet-narrow"
    />
  ),
};

/**
 * With reduced motion the panel appears in its final position with the same focus behaviour. The
 * slide carries no meaning that the layout does not already carry.
 */
export const ReducedMotion: Story = {
  render: () => <AppointmentSheet defaultOpen />,
};

/**
 * Opening moves focus into the panel, Tab is trapped inside it, and Escape closes and returns focus
 * to the control that opened it.
 */
export const KeyboardFlow: Story = {
  render: () => <AppointmentSheet evidence="sheet-keyboard" />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: fixture.trigger });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    const sheet = await screen.findByRole('dialog', { name: fixture.title });
    await waitFor(async () => {
      await expect(sheet).toContainElement(document.activeElement as HTMLElement);
    });

    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await expect(trigger).toHaveFocus();
  },
};
