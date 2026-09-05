import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check, Info, TriangleAlert } from 'lucide-react';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookBadgeStates } from '@/fixtures/storybook-badge-states';
import { Badge } from './badge';

const fixture = storybookBadgeStates;

const meta = {
  title: 'Atoms/Data display/Badge',
  component: Badge,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.badge),
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <section
      data-evidence="badge-semantic-variants"
      aria-label="Badge semantic variants"
      className="max-w-2xl space-y-3"
    >
      <p className="text-xs text-muted-foreground">Synthetic labels · colour is paired with text</p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{fixture.variants.default}</Badge>
        <Badge variant="secondary">{fixture.variants.secondary}</Badge>
        <Badge variant="outline">{fixture.variants.outline}</Badge>
        <Badge variant="destructive">{fixture.variants.destructive}</Badge>
        <Badge variant="success">{fixture.variants.success}</Badge>
        <Badge variant="warning">{fixture.variants.warning}</Badge>
        <Badge variant="info">{fixture.variants.information}</Badge>
      </div>
    </section>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="success">
        <Check aria-hidden="true" />
        {fixture.withIcon.success}
      </Badge>
      <Badge variant="warning">
        <TriangleAlert aria-hidden="true" />
        {fixture.withIcon.warning}
      </Badge>
      <Badge variant="info">
        <Info aria-hidden="true" />
        {fixture.withIcon.information}
      </Badge>
    </div>
  ),
};

export const LongLabel: Story = {
  render: () => (
    <div className="w-56">
      <Badge variant="warning">{fixture.long}</Badge>
    </div>
  ),
};

export const OnColouredSurface: Story = {
  render: () => (
    <div className="grid max-w-lg gap-3 sm:grid-cols-2">
      <div className="rounded-md bg-muted p-4">
        <Badge variant="outline">{fixture.surfaces.quiet}</Badge>
      </div>
      <div className="rounded-md bg-primary p-4">
        <Badge variant="secondary">{fixture.surfaces.strong}</Badge>
      </div>
    </div>
  ),
};
