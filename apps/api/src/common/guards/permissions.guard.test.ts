import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';
import { PermissionsGuard } from './permissions.guard';

function contextWith(user: { role: string | null } | undefined, required: string[] | undefined) {
  const reflector = { getAllAndOverride: vi.fn().mockReturnValue(required) } as unknown as Reflector;
  const context = {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as any;
  return { reflector, context };
}

describe('PermissionsGuard', () => {
  it('allows a handler with no declared permission requirement', () => {
    const { reflector, context } = contextWith({ role: 'receptionist' }, undefined);
    expect(new PermissionsGuard(reflector).canActivate(context)).toBe(true);
  });

  it('allows a role that holds the required permission', () => {
    const { reflector, context } = contextWith({ role: 'receptionist' }, ['patient.search']);
    expect(new PermissionsGuard(reflector).canActivate(context)).toBe(true);
  });

  it('denies a role that does not hold the required permission', () => {
    // No shipped role currently lacks patient.search, so this proves the guard
    // itself denies correctly rather than always allowing through.
    const { reflector, context } = contextWith({ role: 'receptionist' }, ['patient.merge' as never]);
    expect(() => new PermissionsGuard(reflector).canActivate(context)).toThrow(ForbiddenException);
  });

  it('denies a caller with no role at all', () => {
    const { reflector, context } = contextWith(undefined, ['patient.search']);
    expect(() => new PermissionsGuard(reflector).canActivate(context)).toThrow(ForbiddenException);
  });
});
