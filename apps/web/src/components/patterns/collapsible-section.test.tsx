import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CollapsibleSection } from './collapsible-section';

function Summary({ open, onOpenChange = vi.fn() }: { open: boolean; onOpenChange?: (open: boolean) => void }) {
  return (
    <CollapsibleSection
      title="Health summary"
      summary="9 items"
      open={open}
      onOpenChange={onOpenChange}
      indicators={<span>Anaphylaxis: amoxicillin</span>}
    >
      <p>Metformin 1 g twice daily</p>
    </CollapsibleSection>
  );
}

describe('CollapsibleSection', () => {
  it('keeps its safety indicators and its size on screen while closed', () => {
    render(<Summary open={false} />);

    // The requirement this component exists for: a collapsed summary still exposes safety
    // indicators.
    expect(screen.getByText('Anaphylaxis: amoxicillin')).toBeInTheDocument();
    expect(screen.getByText('9 items')).toBeInTheDocument();
  });

  it('unmounts the body rather than hiding it, so nothing closed stays reachable', () => {
    const { rerender } = render(<Summary open />);
    expect(screen.getByText('Metformin 1 g twice daily')).toBeInTheDocument();

    rerender(<Summary open={false} />);
    expect(screen.queryByText('Metformin 1 g twice daily')).not.toBeInTheDocument();
  });

  it('reports its state on a native button inside the heading', () => {
    render(<Summary open />);

    const heading = screen.getByRole('heading', { level: 3, name: /Health summary/ });
    const toggle = screen.getByRole('button', { name: /Health summary/ });
    expect(heading).toContainElement(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('points at the body only while that body exists', () => {
    const { rerender } = render(<Summary open />);
    const toggle = screen.getByRole('button', { name: /Health summary/ });
    const bodyId = toggle.getAttribute('aria-controls');
    expect(bodyId).toBeTruthy();
    expect(document.getElementById(bodyId as string)).toBeInTheDocument();

    rerender(<Summary open={false} />);
    expect(screen.getByRole('button', { name: /Health summary/ })).not.toHaveAttribute(
      'aria-controls',
    );
  });

  it('asks its caller to change state rather than owning it', () => {
    const onOpenChange = vi.fn();
    render(<Summary open onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByRole('button', { name: /Health summary/ }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
