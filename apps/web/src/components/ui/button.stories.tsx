import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LoaderCircle, Search } from 'lucide-react';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookFoundationStates } from '@/fixtures/storybook-foundation-states';
import { Button } from './button';

const fixture = storybookFoundationStates.button;

const meta = {
  title: 'Atoms/Actions/Button',
  component: Button,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.button),
  args: {
    children: fixture.primary,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hierarchy: Story = {
  render: () => (
    <div data-evidence="storybook-button-states" className="flex flex-wrap items-center gap-3">
      <Button>{fixture.primary}</Button>
      <Button variant="secondary">{fixture.secondary}</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">More actions</Button>
      <Button variant="link">View history</Button>
    </div>
  ),
};

export const Destructive: Story = {
  args: {
    children: fixture.destructive,
    variant: 'destructive',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Save unavailable',
    disabled: true,
  },
};

export const Loading: Story = {
  render: () => (
    <Button disabled aria-busy="true">
      <LoaderCircle aria-hidden="true" className="motion-safe:animate-spin" />
      Saving changes
    </Button>
  ),
};

export const IconAccessibleName: Story = {
  render: () => (
    <Button type="button" size="icon" variant="outline" aria-label="Search patients">
      <Search aria-hidden="true" />
    </Button>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Search patients' })).toBeVisible();
  },
};

export const KeyboardFlow: Story = {
  args: {
    children: fixture.primary,
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: fixture.primary });

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const ContentStress: Story = {
  render: () => (
    <div className="w-52">
      <Button>{fixture.long}</Button>
    </div>
  ),
};
