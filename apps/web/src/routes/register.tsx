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
import { Field, FieldGroup } from '@/components/field';

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
              <FieldGroup>
                <Field label="Given name" htmlFor="givenName" required>
                  <Input id="givenName" required value={form.givenName} onChange={set('givenName')} />
                </Field>
                <Field label="Family name" htmlFor="familyName" required>
                  <Input id="familyName" required value={form.familyName} onChange={set('familyName')} />
                </Field>
              </FieldGroup>
              <Field label="Email" htmlFor="email" required error={errors.email}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={form.email}
                  onChange={set('email')}
                />
              </Field>
              <Field label="Mobile" htmlFor="mobile" hint="Optional. Used for account recovery.">
                <Input id="mobile" value={form.mobile} onChange={set('mobile')} />
              </Field>
              <Field
                label="Password"
                htmlFor="password"
                required
                error={errors.password}
                hint="At least 12 characters. A passphrase is easier to remember and harder to guess."
              >
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={12}
                  value={form.password}
                  onChange={set('password')}
                />
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
