import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPhoneNumber,
  formatTime,
} from './formatters';

describe('display formatters', () => {
  it('formats integer minor units as Australian dollars', () => {
    expect(formatCurrency(7635)).toBe('$76.35');
    expect(formatCurrency(-1250)).toBe('-$12.50');
    expect(formatCurrency(null)).toBe('—');
  });

  it('preserves the calendar day of an ISO date-only value', () => {
    expect(formatDate('1992-04-12')).toBe('12/04/1992');
    expect(formatDate('2026-09-05', { style: 'long' })).toBe('5 September 2026');
    expect(formatDate('2026-02-31')).toBe('—');
  });

  it('formats instants and times in the explicit timezone', () => {
    const instant = '2026-09-05T04:30:00.000Z';
    expect(formatDateTime(instant, 'Australia/Brisbane')).toMatch(
      /^05\/09\/2026, 2:30 pm (AEST|GMT\+10)$/,
    );
    expect(formatTime(instant, 'Australia/Brisbane')).toBe('2:30 pm');
    expect(formatTime(instant, 'Australia/Brisbane', { hourCycle: 'h23' })).toBe('14:30');
  });

  it.each([
    ['0412345678', '0412 345 678'],
    ['0391234567', '03 9123 4567'],
    ['1300123456', '1300 123 456'],
    ['1800123456', '1800 123 456'],
    ['131234', '13 12 34'],
    ['+61412345678', '+61 412 345 678'],
  ])('groups the recognised phone number %s', (input, expected) => {
    expect(formatPhoneNumber(input)).toBe(expected);
  });

  it('preserves unrecognised phone numbers and formats comparable numbers', () => {
    expect(formatPhoneNumber('555-CLINIC')).toBe('555-CLINIC');
    expect(formatNumber(12480)).toBe('12,480');
  });
});
