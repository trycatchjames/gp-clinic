import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const foundationSpec =
  'https://github.com/trycatchjames/gp-clinic/blob/main/spec/product/design-system/principles-and-foundations.md';

const meta = {
  title: 'Foundations/Theme',
  tags: ['autodocs', 'test', 'foundation'],
  parameters: {
    docs: {
      description: {
        component: `[Principles and visual foundations](${foundationSpec}) · Approved light-only Compact Clinical colour foundation.`,
      },
    },
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Colour = {
  name: string;
  token: string;
  role: string;
  hex: `#${string}`;
};

const foundationColours: readonly Colour[] = [
  { name: 'Warm canvas', token: 'background', role: 'Application background', hex: '#f8f7f3' },
  { name: 'Clear surface', token: 'surface', role: 'Work and overlay surfaces', hex: '#ffffff' },
  { name: 'Clinical ink', token: 'foreground', role: 'Primary text and icons', hex: '#182523' },
  {
    name: 'Quiet text',
    token: 'muted-foreground',
    role: 'Metadata and supporting detail',
    hex: '#687370',
  },
  { name: 'Soft rule', token: 'border', role: 'Dividers and row separation', hex: '#dde3df' },
  { name: 'Muted wash', token: 'muted', role: 'Subtle grouping and hover', hex: '#f0f2ef' },
] as const;

const brandColours: readonly Colour[] = [
  { name: 'Deep teal', token: 'primary', role: 'Primary action and selection', hex: '#176b68' },
  {
    name: 'Deep teal hover',
    token: 'primary-hover',
    role: 'Hover and pressed emphasis',
    hex: '#125754',
  },
  {
    name: 'On primary',
    token: 'primary-foreground',
    role: 'Text and icon on teal',
    hex: '#ffffff',
  },
] as const;

const semanticColours: readonly Colour[] = [
  {
    name: 'Normal / success',
    token: 'success',
    role: 'Normal, complete, successful',
    hex: '#2f7d4a',
  },
  { name: 'Attention', token: 'warning', role: 'Recall, borderline, caution', hex: '#b97818' },
  { name: 'Danger', token: 'danger', role: 'Allergy, dangerous, destructive', hex: '#c94444' },
  { name: 'Information', token: 'info', role: 'Neutral clinical information', hex: '#3f6f9f' },
] as const;

function ColourCell({ colour }: { colour: Colour }) {
  return (
    <div className="grid min-w-0 grid-cols-[52px_minmax(0,1fr)] items-center gap-3 py-3">
      <div
        role="img"
        aria-label={`${colour.name}, ${colour.hex}`}
        className="h-10 w-[52px] rounded-md border border-black/10"
        style={{ backgroundColor: colour.hex }}
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <p className="text-[13px] font-semibold text-foreground">{colour.name}</p>
          <code className="text-[11px] font-medium text-muted-foreground">{colour.hex}</code>
        </div>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{colour.role}</p>
        <code className="mt-0.5 block truncate text-[10px] text-muted-foreground">
          --{colour.token}
        </code>
      </div>
    </div>
  );
}

function SectionHeading({
  id,
  eyebrow,
  children,
}: {
  id: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.14em] text-primary uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-1 text-base font-semibold tracking-[-0.01em] text-foreground">
        {children}
      </h2>
    </div>
  );
}

export const CompactClinical: Story = {
  render: () => (
    <main
      data-evidence="storybook-theme-foundations"
      className="mx-auto w-full max-w-[1040px] text-foreground"
    >
      <header className="border-l-2 border-primary pl-4 sm:pl-5">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">
          GP Clinic · light only
        </p>
        <h1 className="mt-1.5 text-[28px] leading-8 font-semibold tracking-[-0.025em]">
          Compact Clinical
        </h1>
        <p className="mt-2 max-w-2xl text-[13px] leading-5 text-muted-foreground">
          A warm, restrained foundation for high-information clinical work. Teal establishes
          identity and action; semantic colour remains reserved for meaning.
        </p>
        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs">
          <div className="flex gap-1.5">
            <dt className="text-muted-foreground">Canvas</dt>
            <dd className="font-medium">warm off-white</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-muted-foreground">Radius</dt>
            <dd className="font-medium">6–8px</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-muted-foreground">Density</dt>
            <dd className="font-medium">compact</dd>
          </div>
        </dl>
      </header>

      <div className="mt-6 grid border-y border-border lg:grid-cols-[1.15fr_0.85fr]">
        <section aria-labelledby="foundation-heading" className="py-5 lg:pr-8">
          <SectionHeading id="foundation-heading" eyebrow="Foundation">
            Quiet structure does the heavy lifting
          </SectionHeading>
          <div className="mt-3 divide-y divide-border">
            {foundationColours.map((colour) => (
              <ColourCell key={colour.token} colour={colour} />
            ))}
          </div>
        </section>

        <div className="border-t border-border lg:border-t-0 lg:border-l">
          <section aria-labelledby="brand-heading" className="py-5 lg:pl-8">
            <SectionHeading id="brand-heading" eyebrow="Brand">
              Teal is a signal, not wallpaper
            </SectionHeading>
            <div className="mt-3 divide-y divide-border">
              {brandColours.map((colour) => (
                <ColourCell key={colour.token} colour={colour} />
              ))}
            </div>
          </section>

          <section
            aria-labelledby="balance-heading"
            className="border-t border-border py-5 lg:pl-8"
          >
            <SectionHeading id="balance-heading" eyebrow="Balance">
              Keep most of the interface neutral
            </SectionHeading>
            <div
              className="mt-4 overflow-hidden rounded-md border border-border"
            >
              <div
                className="flex h-7"
                role="img"
                aria-label="Suggested visual balance: mostly warm neutral with sparse muted and teal use"
              >
                <span className="w-[76%] bg-background" />
                <span className="w-[16%] bg-muted" />
                <span className="w-[8%] bg-primary" />
              </div>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Approximate composition guide only: neutral canvas and surfaces should dominate;
              teal concentrates attention on selection, links, and the primary action.
            </p>
          </section>
        </div>
      </div>

      <section aria-labelledby="semantic-heading" className="py-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <SectionHeading id="semantic-heading" eyebrow="Clinical meaning">
            Four colours with stable jobs
          </SectionHeading>
          <p className="max-w-sm text-xs leading-5 text-muted-foreground">
            Every state also needs text or structure. Do not badge every field.
          </p>
        </div>
        <div
          className="mt-3 grid divide-y divide-border sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0"
        >
          {semanticColours.map((colour) => (
            <div key={colour.token} className="border-border sm:border-b">
              <ColourCell colour={colour} />
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
        Review for calmness, contrast, greyscale hierarchy, and whether any colour is doing a job
        that alignment, type, or a divider should do instead.
      </footer>
    </main>
  ),
};
