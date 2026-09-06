import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const fixture = storybookAtomStates.avatar;

const meta = {
  title: 'Atoms/Data display/Avatar',
  component: Avatar,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.avatar),
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The avatar is decorative next to a written name. The name is always present as text, so an
 * initials circle never becomes the only way to tell two practitioners apart.
 */
function NamedAvatar({
  name,
  initials,
  src,
}: {
  name: string;
  initials: string;
  src?: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <Avatar>
        {src && <AvatarImage src={src} alt="" />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{name}</span>
    </span>
  );
}

export const Image: Story = {
  render: () => <NamedAvatar name={fixture.name} initials={fixture.initials} src={fixture.imageSrc} />,
};

export const Fallback: Story = {
  render: () => (
    <section data-evidence="avatar-fallback" aria-label="Avatar fallback" className="grid gap-3">
      <NamedAvatar name={fixture.name} initials={fixture.initials} src={fixture.imageSrc} />
      <NamedAvatar name={fixture.longName} initials={fixture.longInitials} />
    </section>
  ),
};

/**
 * A portrait that fails to load falls back to initials rather than a broken image icon, and the
 * written name is unaffected.
 */
export const BrokenImage: Story = {
  render: () => (
    <NamedAvatar name={fixture.name} initials={fixture.initials} src={fixture.brokenSrc} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      await expect(canvas.getByText(fixture.initials)).toBeVisible();
    });
    await expect(canvas.getByText(fixture.name)).toBeVisible();
  },
};

export const WithLongName: Story = {
  render: () => (
    <div className="w-56">
      <NamedAvatar name={fixture.longName} initials={fixture.longInitials} />
    </div>
  ),
};
