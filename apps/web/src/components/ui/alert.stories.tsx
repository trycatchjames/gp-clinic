import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { CircleAlert, Info, TriangleAlert } from 'lucide-react';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Button } from './button';
import { Alert, AlertDescription, AlertTitle } from './alert';

const fixture = storybookAtomStates.alert;

const meta = {
  title: 'Atoms/Feedback/Alert',
  component: Alert,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.alert),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="max-w-2xl">
      <AlertTitle>{fixture.default.title}</AlertTitle>
      <AlertDescription>{fixture.default.description}</AlertDescription>
    </Alert>
  ),
};

export const Information: Story = {
  render: () => (
    <Alert variant="info" className="max-w-2xl">
      <Info aria-hidden="true" />
      <AlertTitle>{fixture.information.title}</AlertTitle>
      <AlertDescription>{fixture.information.description}</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="max-w-2xl">
      <TriangleAlert aria-hidden="true" />
      <AlertTitle>{fixture.warning.title}</AlertTitle>
      <AlertDescription>{fixture.warning.description}</AlertDescription>
    </Alert>
  ),
};

export const Failure: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-2xl">
      <CircleAlert aria-hidden="true" />
      <AlertTitle>{fixture.failure.title}</AlertTitle>
      <AlertDescription>{fixture.failure.description}</AlertDescription>
    </Alert>
  ),
};

/**
 * Every variant side by side. Meaning is carried by the title text and the icon, so the set stays
 * readable in greyscale.
 */
export const Semantics: Story = {
  render: () => (
    <section
      data-evidence="alert-semantics"
      aria-label="Alert semantic variants"
      className="grid max-w-2xl gap-3"
    >
      <Alert>
        <AlertTitle>{fixture.default.title}</AlertTitle>
        <AlertDescription>{fixture.default.description}</AlertDescription>
      </Alert>
      <Alert variant="info">
        <Info aria-hidden="true" />
        <AlertTitle>{fixture.information.title}</AlertTitle>
        <AlertDescription>{fixture.information.description}</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert aria-hidden="true" />
        <AlertTitle>{fixture.warning.title}</AlertTitle>
        <AlertDescription>{fixture.warning.description}</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlert aria-hidden="true" />
        <AlertTitle>{fixture.failure.title}</AlertTitle>
        <AlertDescription>{fixture.failure.description}</AlertDescription>
      </Alert>
    </section>
  ),
};

export const WithRecovery: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-2xl">
      <CircleAlert aria-hidden="true" />
      <AlertTitle>{fixture.failure.title}</AlertTitle>
      <AlertDescription>
        <p>{fixture.failure.description}</p>
        <Button size="sm" variant="outline" className="mt-2">
          {fixture.failure.recovery}
        </Button>
      </AlertDescription>
    </Alert>
  ),
};

/**
 * An alert inserted after load is announced. Focus stays where the operator left it — the alert
 * reports the outcome, it does not take over the task.
 */
export const DynamicAnnouncement: Story = {
  render: function DynamicAnnouncementStory() {
    const [announced, setAnnounced] = React.useState(false);
    return (
      <div data-evidence="alert-announcement" className="grid max-w-2xl gap-3 justify-items-start">
        <Button onClick={() => setAnnounced(true)}>Save draft</Button>
        {announced && (
          <Alert variant="info">
            <Info aria-hidden="true" />
            <AlertTitle>Draft saved locally</AlertTitle>
            <AlertDescription>{fixture.announcement}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Save draft' });

    await userEvent.click(trigger);

    const alert = await canvas.findByRole('alert');
    await expect(alert).toHaveTextContent('Draft saved locally');
    await expect(trigger).toHaveFocus();
  },
};

export const ContentStress: Story = {
  render: () => (
    <Alert variant="warning" className="max-w-2xl">
      <TriangleAlert aria-hidden="true" />
      <AlertTitle className="line-clamp-none">{fixture.contentStress.title}</AlertTitle>
      <AlertDescription>{fixture.contentStress.description}</AlertDescription>
    </Alert>
  ),
};
