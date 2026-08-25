import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

/**
 * Query keys are hierarchical so invalidating a practice invalidates everything
 * beneath it.
 */
export const keys = {
  practice: (id: string) => ['practice', id] as const,
  registrations: (id: string) => ['practice', id, 'registrations'] as const,
  billingSettings: (id: string) => ['practice', id, 'billing-settings'] as const,
  onboarding: (id: string) => ['practice', id, 'onboarding'] as const,
  locations: (id: string) => ['practice', id, 'locations'] as const,
  businessHours: (id: string, locationId: string) =>
    ['practice', id, 'locations', locationId, 'hours'] as const,
  practitioners: (id: string) => ['practice', id, 'practitioners'] as const,
  members: (id: string) => ['practice', id, 'members'] as const,
  invitations: (id: string) => ['practice', id, 'invitations'] as const,
  appointmentTypes: (id: string) => ['practice', id, 'appointment-types'] as const,
  sessionTemplates: (id: string) => ['practice', id, 'session-templates'] as const,
  feeSchedules: (id: string) => ['practice', id, 'fee-schedules'] as const,
  feeScheduleItems: (id: string, scheduleId: string, search?: string) =>
    ['practice', id, 'fee-schedules', scheduleId, 'items', search ?? ''] as const,
  mbsItems: (search?: string, group?: string) =>
    ['mbs-items', search ?? '', group ?? ''] as const,
};

export const usePractice = (id: string) =>
  useQuery({ queryKey: keys.practice(id), queryFn: () => api.getPractice(id) });

export const useRegistrations = (id: string) =>
  useQuery({ queryKey: keys.registrations(id), queryFn: () => api.getPracticeRegistrations(id) });

export const useBillingSettings = (id: string) =>
  useQuery({ queryKey: keys.billingSettings(id), queryFn: () => api.getBillingSettings(id) });

export const useOnboarding = (id: string) =>
  useQuery({ queryKey: keys.onboarding(id), queryFn: () => api.getOnboardingStatus(id) });

export const useLocations = (id: string) =>
  useQuery({ queryKey: keys.locations(id), queryFn: () => api.listLocations(id) });

export const useBusinessHours = (id: string, locationId: string | undefined) =>
  useQuery({
    queryKey: keys.businessHours(id, locationId ?? ''),
    queryFn: () => api.getBusinessHours(id, locationId!),
    enabled: Boolean(locationId),
  });

export const usePractitioners = (id: string) =>
  useQuery({ queryKey: keys.practitioners(id), queryFn: () => api.listPractitioners(id) });

export const useMembers = (id: string) =>
  useQuery({ queryKey: keys.members(id), queryFn: () => api.listMembers(id) });

export const useInvitations = (id: string) =>
  useQuery({ queryKey: keys.invitations(id), queryFn: () => api.listInvitations(id) });

export const useAppointmentTypes = (id: string) =>
  useQuery({ queryKey: keys.appointmentTypes(id), queryFn: () => api.listAppointmentTypes(id) });

export const useSessionTemplates = (id: string) =>
  useQuery({ queryKey: keys.sessionTemplates(id), queryFn: () => api.listSessionTemplates(id) });

export const useFeeSchedules = (id: string) =>
  useQuery({ queryKey: keys.feeSchedules(id), queryFn: () => api.listFeeSchedules(id) });

export const useFeeScheduleItems = (
  id: string,
  scheduleId: string | undefined,
  search?: string,
) =>
  useQuery({
    queryKey: keys.feeScheduleItems(id, scheduleId ?? '', search),
    queryFn: () => api.listFeeScheduleItems(id, scheduleId!, { search }),
    enabled: Boolean(scheduleId),
  });

export const useMbsItems = (search?: string, group?: string) =>
  useQuery({
    queryKey: keys.mbsItems(search, group),
    queryFn: () => api.listMbsItems({ search, group }),
  });

/**
 * Any mutation that changes practice setup invalidates the onboarding checklist,
 * because the checklist is derived from the practice's actual state.
 */
export function usePracticeMutation<TInput, TResult>(
  practiceId: string,
  mutationFn: (input: TInput) => Promise<TResult>,
  extraKeys: readonly unknown[][] = [],
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.onboarding(practiceId) });
      for (const key of extraKeys) {
        void queryClient.invalidateQueries({ queryKey: key });
      }
    },
  });
}
