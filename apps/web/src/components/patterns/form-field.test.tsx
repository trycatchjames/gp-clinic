import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '@/components/ui/input';
import { Field } from './form-field';

describe('Field', () => {
  it('associates its label, description and error with the control', () => {
    render(
      <Field
        label="Notification email"
        htmlFor="notification-email"
        required
        hint="Receives workspace notices."
        error="Enter a valid email address."
      >
        <Input />
      </Field>,
    );

    const input = screen.getByRole('textbox', { name: /Notification email/ });
    const description = screen.getByText('Receives workspace notices.');
    const error = screen.getByRole('alert');

    expect(input).toHaveAttribute('id', 'notification-email');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-errormessage', error.id);
    expect(input).toHaveAttribute('aria-describedby', `${description.id} ${error.id}`);
    expect(error).toHaveTextContent('Error: Enter a valid email address.');
  });

  it('passes accessibility props to a nested primitive through the render prop', () => {
    render(
      <Field label="Default view" htmlFor="default-view" hint="Shown when the workspace opens.">
        {(controlProps) => <button type="button" {...controlProps}>Today</button>}
      </Field>,
    );

    const control = screen.getByRole('button', { name: 'Default view' });
    expect(control).toHaveAttribute('aria-describedby', 'default-view-description');
  });
});
