import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const fixture = storybookAtomStates.tooltip;

const meta = {
  title: 'Atoms/Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.tooltip),
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A tooltip only ever supplements a control that already makes sense. It is reachable by keyboard
 * as well as pointer, and nothing it says is required to complete the task.
 */
function HintedButton({
  label = fixture.trigger,
  content = fixture.content,
  side,
  evidence,
}: {
  label?: string;
  content?: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  evidence?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">{label}</Button>
      </TooltipTrigger>
      <TooltipContent side={side} data-evidence={evidence}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

export const Default: Story = {
  render: () => <HintedButton />,
};

/**
 * Focusing the trigger from the keyboard shows the tooltip, and Escape dismisses it without
 * leaving the control.
 */
export const KeyboardFocus: Story = {
  render: () => <HintedButton evidence="tooltip-keyboard" />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: fixture.trigger });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    const tooltip = await screen.findByRole('tooltip');
    await expect(tooltip).toHaveTextContent(fixture.content);

    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
    await expect(trigger).toHaveFocus();
  },
};

/**
 * Long text wraps inside the tooltip's maximum width rather than stretching across the viewport.
 * Anything this long belongs in a hint under the field, not in a tooltip.
 */
export const LongTextBoundary: Story = {
  render: () => <HintedButton content={fixture.longContent} />,
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole('button', { name: fixture.trigger }));
    const tooltip = await screen.findByRole('tooltip');
    await expect(tooltip).toHaveTextContent(fixture.longContent);
  },
};

/**
 * Near the viewport edge the tooltip flips to the side with room instead of being clipped.
 */
export const ViewportEdge: Story = {
  render: () => (
    <div className="flex justify-end">
      <HintedButton label={fixture.edgeTrigger} content={fixture.longContent} side="right" />
    </div>
  ),
};
