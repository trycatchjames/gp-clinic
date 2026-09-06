import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Skeleton } from './skeleton';

const fixture = storybookAtomStates.skeleton;

const meta = {
  title: 'Atoms/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.skeleton),
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The skeleton itself is decorative. The container carries the accessible loading name and
 * `aria-busy`, so a screen-reader user is told the region is loading rather than being read a
 * handful of empty boxes.
 */
function LoadingRegion({ children }: { children: ReactNode }) {
  return (
    <div role="status" aria-busy="true" aria-label={fixture.label} className="max-w-2xl">
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

export const Text: Story = {
  render: () => (
    <LoadingRegion>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </LoadingRegion>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('status', { name: fixture.label });
    await expect(region).toHaveAttribute('aria-busy', 'true');
  },
};

export const Card: Story = {
  render: () => (
    <LoadingRegion>
      <div className="grid gap-4 rounded-xl border p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <div className="grid flex-1 gap-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </LoadingRegion>
  ),
};

/**
 * The placeholder rows keep the column widths and row height of the table that replaces them, so
 * arriving data does not shift the page under the pointer.
 */
export const TableGeometry: Story = {
  render: () => (
    <section data-evidence="skeleton-geometry" aria-label="Skeleton geometry" className="max-w-3xl">
      <LoadingRegion>
        <div className="overflow-hidden rounded-lg border">
          <div className="bg-muted/65 grid grid-cols-[1fr_1fr_6rem] gap-4 border-b px-4 py-2.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12 justify-self-end" />
          </div>
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className="grid grid-cols-[1fr_1fr_6rem] items-center gap-4 border-b px-4 py-2.5 last:border-b-0"
            >
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3.5 w-14 justify-self-end" />
            </div>
          ))}
        </div>
      </LoadingRegion>
    </section>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <LoadingRegion>
      <div className="grid gap-3">
        {[0, 1, 2].map((row) => (
          <div key={row} className="grid gap-1.5 rounded-lg border p-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </LoadingRegion>
  ),
};

/**
 * Under `prefers-reduced-motion` the pulse stops. Nothing is lost: the loading state is carried by
 * the container's name and busy state, never by the animation.
 */
export const ReducedMotion: Story = {
  ...Text,
};
