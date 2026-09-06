import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FileInputItem } from './file-input-field';
import { FileInputField } from './file-input-field';

const items: FileInputItem[] = [
  {
    id: 'selected',
    name: 'referral-letter.pdf',
    sizeLabel: '240 KB',
    state: 'selected',
    statusText: 'Selected locally. Not uploaded.',
    removable: true,
  },
  {
    id: 'failed',
    name: 'scan.pdf',
    state: 'failed',
    statusText: 'Upload failed. The local selection is retained.',
    retryable: true,
    removable: true,
  },
];

const commonProps = {
  label: 'Incoming documents',
  hint: 'PDF or image, up to the configured limit.',
  items,
  onFilesSelected: vi.fn(),
  onRemove: vi.fn(),
};

describe('FileInputField', () => {
  it('uses the keyboard-operable choose button to activate the native file input', () => {
    render(<FileInputField {...commonProps} />);
    const input = screen.getByLabelText('Incoming documents');
    const click = vi.spyOn(input, 'click');

    fireEvent.click(screen.getByRole('button', { name: 'Choose file' }));
    expect(click).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Choose file' })).toHaveAccessibleDescription(
      /configured limit/,
    );
  });

  it('emits browser-selected and dropped files through the same callback', () => {
    const onFilesSelected = vi.fn();
    render(<FileInputField {...commonProps} multiple onFilesSelected={onFilesSelected} />);
    const first = new File(['one'], 'one.pdf', { type: 'application/pdf' });
    const second = new File(['two'], 'two.png', { type: 'image/png' });

    fireEvent.change(screen.getByLabelText('Incoming documents'), {
      target: { files: [first] },
    });
    fireEvent.drop(screen.getByRole('group', { name: 'Drop files for Incoming documents' }), {
      dataTransfer: { files: [second] },
    });

    expect(onFilesSelected).toHaveBeenNthCalledWith(1, [first]);
    expect(onFilesSelected).toHaveBeenNthCalledWith(2, [second]);
  });

  it('renders caller-confirmed item states without implying a completed workflow', () => {
    render(
      <FileInputField
        {...commonProps}
        items={[
          ...items,
          {
            id: 'uploading',
            name: 'uploading.pdf',
            state: 'uploading',
            statusText: 'Uploading 45%.',
          },
          {
            id: 'complete',
            name: 'complete.pdf',
            state: 'complete',
            statusText: 'Upload complete. Awaiting malware scan.',
          },
          {
            id: 'rejected',
            name: 'archive.zip',
            state: 'rejected',
            statusText: 'Rejected: file type is not accepted.',
            removable: true,
          },
        ]}
      />,
    );
    expect(screen.getByText('Uploading 45%.').closest('li')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText(/Awaiting malware scan/)).toBeInTheDocument();
    expect(screen.getByText(/Rejected: file type/).closest('li')).toHaveAttribute(
      'data-state',
      'rejected',
    );
  });

  it('exposes retry and removal as separately named item actions', () => {
    const onRetry = vi.fn();
    const onRemove = vi.fn();
    render(<FileInputField {...commonProps} onRetry={onRetry} onRemove={onRemove} />);

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove scan.pdf' }));
    expect(onRetry).toHaveBeenCalledWith('failed');
    expect(onRemove).toHaveBeenCalledWith('failed');
  });

  it('prevents choose and drop interaction when disabled while preserving item state', () => {
    const onFilesSelected = vi.fn();
    render(<FileInputField {...commonProps} disabled onFilesSelected={onFilesSelected} />);
    expect(screen.getByRole('button', { name: 'Choose file' })).toBeDisabled();
    expect(screen.getByText('referral-letter.pdf')).toBeInTheDocument();

    fireEvent.drop(screen.getByRole('group'), {
      dataTransfer: { files: [new File(['x'], 'ignored.pdf')] },
    });
    expect(onFilesSelected).not.toHaveBeenCalled();
  });
});
