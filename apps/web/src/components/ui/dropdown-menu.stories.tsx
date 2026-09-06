import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { MoreHorizontal } from 'lucide-react';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

const fixture = storybookAtomStates.dropdownMenu;
const onSelect = fn();
const keyboardSelect = fn();

const meta = {
  title: 'Atoms/Overlays/Dropdown Menu',
  component: DropdownMenu,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.dropdownMenu),
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The trigger keeps a real accessible name. An icon-only "more" button with no name is the single
 * most common way a dense row becomes unusable with a screen reader.
 */
function RecordMenu({
  defaultOpen,
  evidence,
  children,
}: {
  defaultOpen?: boolean;
  evidence?: string;
  children: ReactNode;
}) {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal aria-hidden="true" />
          {fixture.trigger}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64" data-evidence={evidence}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Default: Story = {
  render: () => (
    <RecordMenu defaultOpen>
      {fixture.items.map((item) => (
        <DropdownMenuItem key={item.id} onSelect={onSelect}>
          {item.label}
        </DropdownMenuItem>
      ))}
    </RecordMenu>
  ),
};

export const Grouped: Story = {
  render: () => (
    <RecordMenu defaultOpen>
      <DropdownMenuLabel>{fixture.groupLabel}</DropdownMenuLabel>
      <DropdownMenuGroup>
        {fixture.items.map((item) => (
          <DropdownMenuItem key={item.id} onSelect={onSelect}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled>{fixture.disabledItem}</DropdownMenuItem>
    </RecordMenu>
  ),
};

/**
 * An action the current role cannot perform stays listed and disabled. Hiding it would leave the
 * operator wondering whether the practice supports it at all.
 */
export const DisabledItem: Story = {
  render: () => (
    <RecordMenu defaultOpen>
      <DropdownMenuItem onSelect={onSelect}>{fixture.items[0].label}</DropdownMenuItem>
      <DropdownMenuItem disabled>{fixture.disabledItem}</DropdownMenuItem>
    </RecordMenu>
  ),
  play: async () => {
    const menu = await screen.findByRole('menu');
    await expect(within(menu).getByText(fixture.disabledItem)).toHaveAttribute(
      'data-disabled',
      '',
    );
  },
};

/**
 * The destructive item is separated from the routine ones and coloured, but the word "Cancel"
 * carries the meaning on its own.
 */
export const DestructiveItem: Story = {
  render: () => (
    <RecordMenu defaultOpen evidence="menu-states">
      <DropdownMenuLabel>{fixture.groupLabel}</DropdownMenuLabel>
      <DropdownMenuGroup>
        {fixture.items.map((item) => (
          <DropdownMenuItem key={item.id} onSelect={onSelect}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled>{fixture.disabledItem}</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onSelect={onSelect}>
        {fixture.destructiveItem}
      </DropdownMenuItem>
    </RecordMenu>
  ),
};

export const LongLabels: Story = {
  render: () => (
    <RecordMenu defaultOpen>
      {fixture.longLabels.map((label) => (
        <DropdownMenuItem key={label} className="whitespace-normal" onSelect={onSelect}>
          {label}
        </DropdownMenuItem>
      ))}
    </RecordMenu>
  ),
};

/**
 * Enter opens the menu and focus moves to the first item; arrows move between items without
 * activating them; Escape closes and returns focus to the trigger.
 */
export const KeyboardFlow: Story = {
  render: function KeyboardFlowStory() {
    return (
      <RecordMenu evidence="menu-keyboard">
        {fixture.items.map((item) => (
          <DropdownMenuItem key={item.id} onSelect={keyboardSelect}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </RecordMenu>
    );
  },
  play: async ({ canvasElement }) => {
    keyboardSelect.mockClear();
    const trigger = within(canvasElement).getByRole('button', { name: fixture.trigger });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    const menu = await screen.findByRole('menu');
    const first = within(menu).getByRole('menuitem', { name: fixture.items[0].label });
    await waitFor(async () => {
      await expect(first).toHaveFocus();
    });

    await userEvent.keyboard('{ArrowDown}');
    await expect(
      within(menu).getByRole('menuitem', { name: fixture.items[1].label }),
    ).toHaveFocus();
    await expect(keyboardSelect).not.toHaveBeenCalled();

    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
    await expect(trigger).toHaveFocus();
  },
};
