import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('preserves native activation and the accessible name', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save changes</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('prevents activation while disabled or busy', () => {
    const onClick = vi.fn();
    render(
      <Button disabled aria-busy="true" onClick={onClick}>
        Saving changes
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Saving changes' });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(onClick).not.toHaveBeenCalled();
  });
});
