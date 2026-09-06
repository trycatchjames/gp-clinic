import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { FileInputField, type FileInputItem } from './file-input-field';

const fixture = storybookMoleculeStates.fileInput;

const items = {
  selected: { ...fixture.items.selected, state: 'selected' },
  uploading: { ...fixture.items.uploading, state: 'uploading' },
  failed: { ...fixture.items.failed, state: 'failed' },
  complete: { ...fixture.items.complete, state: 'complete' },
  rejected: { ...fixture.items.rejected, state: 'rejected' },
  longFilename: { ...fixture.items.longFilename, state: 'rejected' },
} satisfies Record<string, FileInputItem>;

const meta = {
  title: 'Molecules/Forms/File Input Field',
  component: FileInputField,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.fileInputField),
  args: {
    label: fixture.label,
    hint: fixture.hint,
    items: [],
    onFilesSelected: fn(),
    onRemove: fn(),
    onRetry: fn(),
    className: 'max-w-xl',
  },
} satisfies Meta<typeof FileInputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: (args) => (
    <div data-evidence="storybook-file-input-field">
      <FileInputField {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Choose file' })).toBeVisible();
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument();
  },
};

/**
 * Chosen on this device is not uploaded. The status text says so in words, because a filename
 * sitting in a list is otherwise indistinguishable from one that reached the practice.
 */
export const Selected: Story = {
  args: { items: [items.selected] },
  play: async ({ canvasElement }) => {
    const item = within(canvasElement).getByRole('listitem');
    await expect(item).toHaveAttribute('data-state', 'selected');
    await expect(item).toHaveTextContent('Not uploaded yet');
  },
};

export const Uploading: Story = {
  args: { items: [items.uploading] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('listitem')).toHaveAttribute('aria-busy', 'true');
  },
};

/**
 * A failure keeps the file, the reason and a retry. Removing the row on failure would leave the
 * operator believing the document went through.
 */
export const Failed: Story = {
  args: { items: [items.failed] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('listitem')).toHaveTextContent('Nothing was filed to the record');

    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await expect(args.onRetry).toHaveBeenCalledWith(items.failed.id);
  },
};

/**
 * Complete means the upload and scan finished — nothing more. The status text deliberately stops
 * short of filing or clinical review, which the pattern cannot know about.
 */
export const Complete: Story = {
  args: { items: [items.complete] },
};

export const Rejected: Story = {
  args: { items: [items.rejected] },
};

export const States: Story = {
  args: {
    multiple: true,
    label: fixture.multipleLabel,
    items: [items.selected, items.uploading, items.complete, items.failed, items.rejected],
  },
  render: (args) => (
    <div data-evidence="storybook-file-input-field-states">
      <FileInputField {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = within(canvasElement).getAllByRole('listitem');
    const states = rows.map((row) => row.getAttribute('data-state'));
    await expect(states).toEqual(['selected', 'uploading', 'complete', 'failed', 'rejected']);
  },
};

export const Disabled: Story = {
  args: { disabled: true, items: [items.selected], error: fixture.error },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Choose file' })).toBeDisabled();
  },
};

/**
 * The filename breaks across lines rather than being truncated: the extension and the tail of the
 * name are often the only way to tell two scans of the same document apart.
 */
export const LongFilename: Story = {
  args: { items: [items.longFilename] },
};

export const Multiple: Story = {
  args: {
    multiple: true,
    label: fixture.multipleLabel,
    items: [items.selected, items.complete],
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Choose files' }),
    ).toBeVisible();
  },
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  args: {
    multiple: true,
    label: fixture.multipleLabel,
    items: [items.longFilename, items.uploading],
    className: undefined,
  },
  render: (args) => (
    <div data-evidence="storybook-file-input-field-narrow">
      <FileInputField {...args} />
    </div>
  ),
};

/**
 * Tab reaches the choose button, then each available per-item action. The hidden native input is
 * never a stop of its own, and removing an item is a named action rather than a bare icon.
 */
export const KeyboardFlow: Story = {
  args: { items: [items.failed] },
  render: (args) => (
    <div data-evidence="storybook-file-input-field-keyboard">
      <FileInputField {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const choose = canvas.getByRole('button', { name: 'Choose file' });

    await userEvent.tab();
    await expect(choose).toHaveFocus();

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Retry' })).toHaveFocus();

    await userEvent.tab();
    const remove = canvas.getByRole('button', { name: `Remove ${items.failed.name}` });
    await expect(remove).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(args.onRemove).toHaveBeenCalledWith(items.failed.id);
  },
};
