import * as React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { describeError, fieldErrors } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';

export function RegisterRoute() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    givenName: '',
    familyName: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      await register({ ...form, mobile: form.mobile || undefined });
      navigate({ to: '/onboarding' });
    } catch (error) {
      setErrors(fieldErrors(error));
      toast.error('Could not create your account', { description: describeError(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-muted/40 flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              You will set up your practice in the next step. It takes about ten minutes and
              you can leave and come back.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="givenName">
                    Given name
                    <span aria-hidden="true" className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="givenName" required value={form.givenName} onChange={set('givenName')} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="familyName">
                    Family name
                    <span aria-hidden="true" className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="familyName" required value={form.familyName} onChange={set('familyName')} />
                </Field>
              </div>
              <Field data-invalid={errors.email ? true : undefined}>
                <FieldLabel htmlFor="email">
                  Email
                  <span aria-hidden="true" className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={form.email}
                  onChange={set('email')}
                />
                <FieldError id="email-error">{errors.email}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="mobile">
                  Mobile
                </FieldLabel>
                <Input aria-describedby="mobile-description" id="mobile" value={form.mobile} onChange={set('mobile')} />
                <FieldDescription id="mobile-description">Optional. Used for account recovery.</FieldDescription>
              </Field>
              <Field data-invalid={errors.password ? true : undefined}>
                <FieldLabel htmlFor="password">
                  Password
                  <span aria-hidden="true" className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={errors.password ? 'password-description password-error' : 'password-description'}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={12}
                  value={form.password}
                  onChange={set('password')}
                />
                <FieldDescription id="password-description">At least 12 characters. A passphrase is easier to remember and harder to guess.</FieldDescription>
                <FieldError id="password-error">{errors.password}</FieldError>
              </Field>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="size-4 animate-spin" />}
                Create account
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-foreground font-medium underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
