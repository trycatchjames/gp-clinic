import type { Meta, StoryObj } from '@storybook/react-vite';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

const fixture = storybookAtomStates.card;

const meta = {
  title: 'Atoms/Data display/Card',
  component: Card,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.card),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The title is a real heading. A card groups content; it does not invent a landmark or a heading
 * level, so the caller states where it sits in the outline.
 */
export const Default: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle asChild>
          <h3>{fixture.title}</h3>
        </CardTitle>
        <CardDescription>{fixture.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{fixture.body}</p>
      </CardContent>
    </Card>
  ),
};

export const WithActions: Story = {
  render: () => (
    <section data-evidence="card-hierarchy" aria-label="Card hierarchy" className="max-w-md">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle asChild>
                <h3>{fixture.title}</h3>
              </CardTitle>
              <CardDescription className="mt-1.5">{fixture.description}</CardDescription>
            </div>
            <Badge variant="success">Arrived</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{fixture.body}</p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm">{fixture.primaryAction}</Button>
          <Button size="sm" variant="outline">
            {fixture.secondaryAction}
          </Button>
        </CardFooter>
      </Card>
    </section>
  ),
};

/**
 * Dense facts stay inside the card as a description list rather than becoming a nested table: four
 * short pairs do not need column headers to be read correctly.
 */
export const DenseContent: Story = {
  render: () => (
    <Card className="max-w-md gap-4 py-4">
      <CardHeader className="px-4">
        <CardTitle asChild>
          <h3 className="text-sm">{fixture.title}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          {fixture.denseFacts.map((fact) => (
            <div key={fact.label} className="flex items-baseline justify-between gap-2 text-sm">
              <dt className="text-muted-foreground">{fact.label}</dt>
              <dd className="font-medium tabular">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle asChild>
          <h3>{fixture.title}</h3>
        </CardTitle>
        <CardDescription>{fixture.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{fixture.body}</p>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <Button size="sm">{fixture.primaryAction}</Button>
        <Button size="sm" variant="outline">
          {fixture.secondaryAction}
        </Button>
      </CardFooter>
    </Card>
  ),
};
