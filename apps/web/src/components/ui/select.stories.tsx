import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Label } from './label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';

const fixture = storybookAtomStates.select;

const meta = {
  title: 'Atoms/Forms/Select',
  component: Select,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.select),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The trigger keeps a real label. The placeholder says a choice has not been made yet; it is not
 * the field's name and it is never a silent default.
 */
function LocationSelect({
  id,
  defaultValue,
  invalid,
  description,
  options = fixture.options,
  label = fixture.label,
  ...props
}: React.ComponentProps<typeof Select> & {
  id: string;
  invalid?: boolean;
  description?: string;
  options?: readonly { value: string; label: string; disabled?: boolean }[];
  label?: string;
}) {
  const descriptionId = description ? `${id}-description` : undefined;
  return (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select defaultValue={defaultValue} {...props}>
        <SelectTrigger id={id} aria-invalid={invalid} aria-describedby={descriptionId}>
          <SelectValue placeholder={fixture.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && (
        <p
          id={descriptionId}
          className={invalid ? 'text-destructive text-xs' : 'text-muted-foreground text-xs'}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/** A caption above each control on a comparison sheet; not part of the atom. */
function StateRow({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <p className="text-muted-foreground text-xs">{caption}</p>
      {children}
    </div>
  );
}

export const Placeholder: Story = {
  render: () => <LocationSelect id="placeholder" />,
};

export const Selected: Story = {
  render: () => <LocationSelect id="selected" defaultValue="harbour" />,
};

export const Grouped: Story = {
  render: () => (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor="grouped">{fixture.label}</Label>
      <Select defaultValue="northside">
        <SelectTrigger id="grouped">
          <SelectValue placeholder={fixture.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {fixture.groups.map((group) => (
            <SelectGroup key={group.label}>
              <SelectLabel>{group.label}</SelectLabel>
              {group.options.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

/**
 * An unavailable location stays visible and disabled rather than disappearing: a location that is
 * simply missing from the list looks like a data problem, not a closed clinic.
 */
export const DisabledOption: Story = {
  render: () => (
    <LocationSelect id="disabled-option" defaultValue="wongaburra" options={fixture.groups[1].options} />
  ),
};

export const Invalid: Story = {
  render: () => (
    <section data-evidence="select-states" aria-label="Select states" className="grid gap-4">
      <StateRow caption="Nothing chosen yet">
        <LocationSelect id="states-placeholder" />
      </StateRow>
      <StateRow caption="Chosen">
        <LocationSelect id="states-selected" defaultValue="northside" />
      </StateRow>
      <StateRow caption="Invalid — a choice is required and none was made">
        <LocationSelect id="states-invalid" invalid description={fixture.invalidMessage} />
      </StateRow>
      <StateRow caption="Disabled — not available in this context">
        <LocationSelect id="states-disabled" defaultValue="harbour" disabled />
      </StateRow>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByLabelText(fixture.label, { selector: '#states-invalid' });
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await expect(trigger).toHaveAccessibleDescription(fixture.invalidMessage);
  },
};

export const LongOptions: Story = {
  render: () => (
    <LocationSelect id="long" defaultValue="community" options={fixture.longOptions} />
  ),
};

/**
 * Enter opens the list, arrows move the highlight, Enter commits and focus returns to the trigger.
 * Escape closes without changing the value.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <div data-evidence="select-keyboard">
      <LocationSelect id="keyboard" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByLabelText(fixture.label);

    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveTextContent(fixture.placeholder);
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(trigger).toHaveTextContent(fixture.options[1].label);
    await expect(trigger).toHaveFocus();
  },
};
