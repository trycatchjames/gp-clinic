import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPhoneNumber,
  formatTime,
} from '@/lib/formatters';

const examples = [
  { type: 'Calendar date', input: '1992-04-12', output: formatDate('1992-04-12') },
  {
    type: 'Long calendar date',
    input: '2026-09-05',
    output: formatDate('2026-09-05', { style: 'long' }),
  },
  {
    type: 'Local date and time',
    input: '2026-09-05T04:30:00Z · Australia/Brisbane',
    output: formatDateTime('2026-09-05T04:30:00Z', 'Australia/Brisbane'),
  },
  {
    type: 'Local time',
    input: '2026-09-05T04:30:00Z · Australia/Brisbane',
    output: formatTime('2026-09-05T04:30:00Z', 'Australia/Brisbane'),
  },
  { type: 'Australian dollars', input: '7635 cents', output: formatCurrency(7635) },
  { type: 'Comparable number', input: '12480', output: formatNumber(12480) },
  { type: 'Mobile', input: '0412345678', output: formatPhoneNumber('0412345678') },
  { type: 'Practice phone', input: '0391234567', output: formatPhoneNumber('0391234567') },
  { type: 'National service', input: '1300123456', output: formatPhoneNumber('1300123456') },
];

const meta = {
  title: 'Foundations/Display formatters',
  tags: ['autodocs', 'test', 'foundation'],
  parameters: {
    docs: {
      description: {
        component:
          '[Shared display formatters](https://github.com/trycatchjames/gp-clinic/blob/main/spec/product/design-system/responsive-and-content.md#shared-display-formatters) · Source: `apps/web/src/lib/formatters.ts`',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AustralianDisplay: Story = {
  render: () => (
    <section
      data-evidence="storybook-display-formatters"
      aria-labelledby="display-formatters-title"
      className="mx-auto max-w-4xl"
    >
      <header className="border-primary mb-6 border-l-2 pl-4">
        <p className="text-primary text-xs font-semibold tracking-[0.12em] uppercase">
          Display foundation
        </p>
        <h1 id="display-formatters-title" className="mt-1 text-2xl font-semibold tracking-tight">
          Australian formats, one system
        </h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          Display-only formatting keeps repeated values predictable. Validation, masking and
          missing-value meaning remain with the owning workflow.
        </p>
      </header>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <caption className="sr-only">Canonical Australian display-format examples</caption>
          <thead className="border-b bg-muted/70">
            <tr>
              <th scope="col" className="h-9 px-3 text-left text-xs font-medium text-muted-foreground">
                Value type
              </th>
              <th scope="col" className="h-9 px-3 text-left text-xs font-medium text-muted-foreground">
                Stored or supplied value
              </th>
              <th scope="col" className="h-9 px-3 text-left text-xs font-medium text-muted-foreground">
                Display
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {examples.map((example) => (
              <tr key={example.type}>
                <th scope="row" className="px-3 py-2 text-left font-medium">
                  {example.type}
                </th>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{example.input}</td>
                <td className="px-3 py-2 tabular-nums">{example.output}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Missing value</p>
          <p className="mt-1 text-sm">{formatDate(null)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Unrecognised phone input</p>
          <p className="mt-1 text-sm">{formatPhoneNumber('555-CLINIC')}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Preserved rather than guessed</p>
        </div>
      </div>
    </section>
  ),
};
