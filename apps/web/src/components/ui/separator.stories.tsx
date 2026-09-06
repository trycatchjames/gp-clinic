import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Separator } from './separator';

const fixture = storybookAtomStates.separator;

const meta = {
  title: 'Atoms/Data display/Separator',
  component: Separator,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.separator),
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="grid max-w-md gap-3">
      <p className="text-sm">{fixture.items[0]}</p>
      <Separator />
      <p className="text-sm">{fixture.items[1]}</p>
      <Separator />
      <p className="text-sm">{fixture.items[2]}</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-3 text-sm">
      {fixture.items.map((item, index) => (
        <div key={item} className="flex h-full items-center gap-3">
          {index > 0 && <Separator orientation="vertical" />}
          <span>{item}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * A decorative rule is hidden from assistive technology; only a rule that genuinely divides
 * content declares itself. Heading structure, not a line, is what carries the outline.
 */
export const Semantic: Story = {
  render: () => (
    <section
      data-evidence="separator-orientation"
      aria-label="Separator orientation"
      className="grid max-w-md gap-4"
    >
      <div className="grid gap-2">
        <p className="text-muted-foreground text-xs">Decorative — hidden from assistive technology</p>
        <Separator />
      </div>
      <div className="grid gap-2">
        <p className="text-muted-foreground text-xs">Semantic — exposed as a separator</p>
        <Separator decorative={false} />
      </div>
      <div className="grid gap-2">
        <h3 className="text-sm font-semibold">{fixture.semanticHeading}</h3>
        <Separator decorative={false} />
        <p className="text-muted-foreground text-sm">No invoices recorded in the selected period.</p>
      </div>
    </section>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('separator')).toHaveLength(2);
  },
};
