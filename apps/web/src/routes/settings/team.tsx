import * as React from 'react';
import { toast } from 'sonner';
import { Mail, ShieldAlert, Trash2 } from 'lucide-react';
import { CLINICAL_ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS, PRACTICE_ROLES, type PracticeRole } from '@gp/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { api, describeError } from '@/lib/api';
import { usePracticeId } from '@/lib/auth';
import { keys, useInvitations, useMembers } from '@/lib/queries';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDate } from '@/lib/utils';

export function TeamSettingsRoute() {
  const practiceId = usePracticeId();
  const members = useMembers(practiceId);
  const invitations = useInvitations(practiceId);
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function changeRole(memberId: string, role: PracticeRole) {
    setBusyId(memberId);
    try {
      await api.updateMemberRole(practiceId, memberId, { role });
      await queryClient.invalidateQueries({ queryKey: keys.members(practiceId) });
      toast.success('Role updated', {
        description: 'Their new permissions apply within 15 minutes.',
      });
    } catch (error) {
      toast.error('Could not change the role', { description: describeError(error) });
    } finally {
      setBusyId(null);
    }
  }

  async function revoke(invitationId: string) {
    try {
      await api.revokeInvitation(practiceId, invitationId);
      await queryClient.invalidateQueries({ queryKey: keys.invitations(practiceId) });
      toast.success('Invitation revoked');
    } catch (error) {
      toast.error('Could not revoke', { description: describeError(error) });
    }
  }

  const pending = (invitations.data ?? []).filter((i) => i.status === 'pending');

  return (
    <>
      <PageHeader
        title="Team and access"
        description="Least privilege by default. Reception never receives clinical notes over the API — the restriction is server-side, not a hidden button."
      />

      <Alert variant="info">
        <ShieldAlert />
        <AlertTitle>Every clinical record view is audit-logged</AlertTitle>
        <AlertDescription>
          Not just edits — views too. That is what makes RACGP C6.3 demonstrable, and it is the
          first thing anyone asks for after a privacy concern.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            A practice must always have at least one active owner.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Clinical access</TableHead>
                  <TableHead>Last signed in</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.data?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <p className="font-medium">
                        {member.givenName} {member.familyName}
                      </p>
                      <p className="text-muted-foreground text-xs">{member.email}</p>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={member.role}
                        disabled={busyId === member.id || member.status !== 'active'}
                        onValueChange={(value) => void changeRole(member.id, value as PracticeRole)}
                      >
                        <SelectTrigger size="sm" className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRACTICE_ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {ROLE_LABELS[role]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {CLINICAL_ROLES.includes(member.role as PracticeRole) ? (
                        <Badge variant="secondary">Full clinical</Badge>
                      ) : member.role === 'practice_manager' ? (
                        <Badge variant="outline">Billing metadata only</Badge>
                      ) : (
                        <Badge variant="outline">Demographics only</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {member.lastSignInAt ? formatDate(member.lastSignInAt) : 'Never'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending invitations</CardTitle>
            <CardDescription>Single use, and they expire after 14 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invitee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>
                      <p className="font-medium">
                        {invitation.givenName} {invitation.familyName}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Mail className="size-3" />
                        {invitation.email}
                      </p>
                    </TableCell>
                    <TableCell>{invitation.roleLabel}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(invitation.expiresAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => void revoke(invitation.id)}
                        aria-label="Revoke invitation"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>What each role can do</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {PRACTICE_ROLES.map((role) => (
            <div key={role} className="space-y-0.5 rounded-md border p-3">
              <p className="text-sm font-medium">{ROLE_LABELS[role]}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {ROLE_DESCRIPTIONS[role]}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
