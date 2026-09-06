import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Field } from './form-field';
import type { SaveStateValue } from './save-state';
import { SaveState } from './save-state';

const fixture = storybookMoleculeStates.saveState;

const meta = {
  title: 'Molecules/Operation states/Save State',
  component: SaveState,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.saveState),
  args: {
    value: { kind: 'unsaved' },
    timeZone: fixture.timeZone,
    label: fixture.label,
  },
} satisfies Meta<typeof SaveState>;

export default meta;
type Story = StoryObj<typeof meta>;

const failed: SaveStateValue = {
  kind: 'failed',
  reason: fixture.failureReason,
  retry: { label: fixture.retryLabel, onSelect: fn() },
};

const conflict: SaveStateValue = {
  kind: 'conflict',
  reason: fixture.conflictReason,
  reconcile: { label: fixture.reconcileLabel, onSelect: fn() },
};

export const Default: Story = {};

export const Saving: Story = { args: { value: { kind: 'saving' } } };

export const Saved: Story = { args: { value: { kind: 'saved', at: fixture.savedAt } } };

/**
 * The state the design-system invariant exists for. Recovered work is recent, it looks complete,
 * and it is not on the record — so the visible text says so rather than leaving it to an icon.
 */
export const LocalOnly: Story = {
  args: { value: { kind: 'local', at: fixture.localAt } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/not on the record/)).toBeVisible();
    await expect(canvas.queryByText(/^Saved/)).not.toBeInTheDocument();
  },
};

export const FailedSave: Story = {
  args: { value: failed },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The state phrase and the caller's reason are separate elements, and the announced form of
    // the same state is a third, fuller line.
    await expect(canvas.getByText('Not saved.', { exact: true })).toBeVisible();
    await expect(canvas.getByText(fixture.failureReason, { exact: true })).toBeVisible();
    await expect(canvas.getByRole('button', { name: fixture.retryLabel })).toBeEnabled();
  },
};

export const Conflict: Story = {
  args: { value: conflict },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // No free-text merge is attempted or implied; both versions are still available.
    await expect(canvas.getByText('Changed elsewhere.', { exact: true })).toBeVisible();
    await expect(canvas.getByText(fixture.conflictReason, { exact: true })).toBeVisible();
    await expect(canvas.getByRole('button', { name: fixture.reconcileLabel })).toBeEnabled();
  },
};

/**
 * Six states side by side. None of them may be mistaken for another, and only the durable commit
 * uses the word "saved".
 */
export const AllStates: Story = {
  render: (args) => (
    <div
      data-evidence="save-state-kinds"
      aria-label="Save states"
      className="grid max-w-2xl gap-3"
    >
      {(
        [
          { kind: 'unsaved' },
          { kind: 'saving' },
          { kind: 'saved', at: fixture.savedAt },
          { kind: 'local', at: fixture.localAt },
          failed,
          conflict,
        ] satisfies SaveStateValue[]
      ).map((value) => (
        <SaveState key={value.kind} {...args} value={value} />
      ))}
    </div>
  ),
};

export const HeldLocally: Story = {
  args: { value: { kind: 'local', at: fixture.localAt } },
  render: (args) => (
    <div data-evidence="save-state-local" className="max-w-2xl">
      <SaveState {...args} />
    </div>
  ),
};

export const SaveFailure: Story = {
  args: { value: failed },
  render: (args) => (
    <div data-evidence="save-state-failure" className="max-w-2xl">
      <SaveState {...args} />
    </div>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  args: { value: failed },
  render: (args) => (
    <div data-evidence="save-state-narrow" className="w-full max-w-full">
      <SaveState {...args} />
      <div className="mt-3">
        <SaveState {...args} value={{ kind: 'local', at: fixture.localAt }} />
      </div>
    </div>
  ),
};

/**
 * Beside the editor that produced the work, which is where the contract puts it. Typing moves the
 * state back to unsaved and never takes the cursor out of the note.
 */
export const InEditor: Story = {
  render: () => {
    function Editor() {
      const [value, setValue] = useState<string>(fixture.noteValue);
      const [state, setState] = useState<SaveStateValue>({
        kind: 'saved',
        at: fixture.savedAt,
      });

      return (
        <div className="grid max-w-2xl gap-2">
          <Field label={fixture.label}>
            {(controlProps) => (
              <Textarea
                {...controlProps}
                rows={5}
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  setState({ kind: 'unsaved' });
                }}
              />
            )}
          </Field>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SaveState value={state} timeZone={fixture.timeZone} label={fixture.label} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setState({ kind: 'saved', at: fixture.savedAt })}
            >
              Save note
            </Button>
          </div>
        </div>
      );
    }
    return <Editor />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const note = canvas.getByRole('textbox', { name: fixture.label });

    await expect(canvas.getByText(/^Saved/)).toBeVisible();
    await userEvent.click(note);
    await userEvent.type(note, ' Plan discussed.');

    await expect(canvas.getByText('Unsaved changes')).toBeVisible();
    // The status must never pull the cursor out of a clinical note.
    await expect(note).toHaveFocus();
  },
};
