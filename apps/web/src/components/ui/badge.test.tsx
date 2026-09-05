import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders supplemental text without adding interactive semantics', () => {
    render(<Badge variant="warning">Similar details</Badge>);

    const badge = screen.getByText('Similar details');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).not.toHaveAttribute('role');
    expect(badge).not.toHaveAttribute('tabindex');
    expect(badge).toHaveClass('bg-warning', 'text-warning-foreground');
  });

  it('transfers its presentation to a compatible child without obscuring its semantics', () => {
    render(
      <Badge asChild variant="outline">
        <a href="/statuses">View status definitions</a>
      </Badge>,
    );

    expect(screen.getByRole('link', { name: 'View status definitions' })).toHaveAttribute(
      'href',
      '/statuses',
    );
  });

  it('allows meaningful long labels to wrap instead of clipping them', () => {
    render(<Badge>Identity detail requires confirmation before continuing</Badge>);

    expect(screen.getByText(/Identity detail requires confirmation/)).toHaveClass(
      'whitespace-normal',
      'break-words',
      'max-w-full',
    );
  });
});
