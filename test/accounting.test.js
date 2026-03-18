const {
  readBalance,
  writeBalance,
  resetBalance,
  formatCurrency,
  creditAccount,
  debitAccount,
} = require('../src/accounting/index');

describe('Accounting App Business Logic', () => {
  beforeEach(() => {
    resetBalance(1000.0);
  });

  test('TC-002: View initial balance', () => {
    expect(readBalance()).toBe(1000.0);
    expect(formatCurrency(readBalance())).toBe('001000.00');
  });

  test('TC-003: Credit account with 250.00', () => {
    const result = creditAccount(250.0);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(1250.0);
    expect(readBalance()).toBe(1250.0);
  });

  test('TC-004: Debit account with sufficient funds 500.00', () => {
    const result = debitAccount(500.0);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(500.0);
    expect(readBalance()).toBe(500.0);
  });

  test('TC-005: Debit account with insufficient funds', () => {
    const result = debitAccount(2000.0);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Insufficient funds for this debit.');
    expect(readBalance()).toBe(1000.0);
  });

  test('TC-006: Invalid amount credit should fail', () => {
    const result = creditAccount(-10);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid amount; enter a positive number.');
    expect(readBalance()).toBe(1000.0);
  });

  test('TC-006: Invalid amount debit should fail', () => {
    const result = debitAccount(0);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid amount; enter a positive number.');
    expect(readBalance()).toBe(1000.0);
  });

  test('TC-008/TC-009/TC-010: read after write persistence behavior', () => {
    const writeBalanceValue = 1500.0;
    writeBalance(writeBalanceValue);
    expect(readBalance()).toBe(writeBalanceValue);
  });

  test('TC-005 idempotent insufficient debit does not change state', () => {
    const result1 = debitAccount(2000.0);
    const result2 = debitAccount(2000.0);
    expect(result1.success).toBe(false);
    expect(result2.success).toBe(false);
    expect(readBalance()).toBe(1000.0);
  });
});
