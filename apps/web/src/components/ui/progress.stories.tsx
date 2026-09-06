import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Progress } from './progress';

const fixture = storybookAtomStates.progress;

const meta = {
  title: 'Atoms/Feedback/Progress',
  component: Progress,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.progress),
  args: {
    'aria-label': fixture.label,
    className: 'max-w-md',
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Zero: Story = {
  args: { value: fixture.zero },
};

export const Partial: Story = {
  args: { value: fixture.partial },
};

export const Complete: Story = {
  args: { value: fixture.complete },
};

/**
 * The bar is never the only status. A visible count carries the same fact for anyone who cannot
 * judge a fill width, and `aria-valuetext` gives assistive technology the same words.
 */
export const Labelled: Story = {
  render: () => (
    <div data-evidence="progress-values" className="grid max-w-md gap-5">
      {[
        { value: fixture.zero, text: 'Not started' },
        { value: fixture.partial, text: fixture.partialText },
        { value: fixture.complete, text: fixture.completeText },
      ].map((step) => (
        <div key={step.value} className="grid gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium">{fixture.label}</span>
            <span className="text-muted-foreground text-xs tabular">{step.text}</span>
          </div>
          <Progress aria-label={fixture.label} aria-valuetext={step.text} value={step.value} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const bars = within(canvasElement).getAllByRole('progressbar');
    await expect(bars).toHaveLength(3);
    await expect(bars[1]).toHaveAttribute('aria-valuetext', fixture.partialText);
    await expect(bars[2]).toHaveAttribute('aria-valuenow', String(fixture.complete));
  },
};

/**
 * With reduced motion the fill still reaches the right position — only the transition to it is
 * removed, so no information depends on watching the bar move.
 */
export const ReducedMotion: Story = {
  args: { value: fixture.partial, 'aria-valuetext': fixture.partialText },
};
