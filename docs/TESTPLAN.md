# COBOL Account System Test Plan

This test plan covers the existing business logic in the COBOL app (`main.cob`, `operations.cob`, `data.cob`) and is designed for stakeholder validation. Use this to derive unit and integration tests in Node.js.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Start program and display menu | App compiled and executable ready | 1. Run `./accountsystem`
2. Observe menu | Menu shown with options 1-4 | | | |
| TC-002 | View balance from initial state | App started, storage balance initialized to 1000.00 | 1. Select option 1 | Display `Current balance: 001000.00` | | | |
| TC-003 | Credit account with valid amount | Current balance 1000.00 | 1. Select option 2
2. Enter `250.00` | `Amount credited. New balance: 001250.00` and storage updated | | | |
| TC-004 | Debit account with sufficient funds | Current balance 1000.00 (or 1250.00 after credit) | 1. Select option 3
2. Enter `500.00` | `Amount debited. New balance: 000500.00` (or 000750.00 after credit) and storage updated | | | |
| TC-005 | Debit account with insufficient funds | Current balance 1000.00 | 1. Select option 3
2. Enter `2000.00` | Display `Insufficient funds for this debit.`; balance unchanged | | | |
| TC-006 | Menu invalid choice handling | Program running | 1. Enter option 9 | Display `Invalid choice, please select 1-4.` | | | |
| TC-007 | Exit loop from menu | Program running | 1. Select option 4 | Display `Exiting the program. Goodbye!` and program terminates | | | |
| TC-008 | Persistence read/write behavior | operation flow uses `DataProgram` subroutine | 1. From option 2 credit amount 100.00
2. Use option 1 to view balance | Balance reflects the updated value (1000.00 + 100.00) | | | |
| TC-009 | DataProgram READ always returns current storage | where storage initial 1000.00 or updated | 1. Call via option 1, 2, or 3 that triggers read | Balance loaded from internal storage into `FINAL-BALANCE` | | | |
| TC-010 | DataProgram WRITE updates storage correctly | After credit/debit | 1. Perform credit or debit via operations
2. Call read path to confirm | Storage balance updated to match operation result | | | |

## Notes for Stakeholders
- Balance arithmetic is performed in `operations.cob`; debit requires sufficient funds.
- The `data.cob` store is in-memory (`STORAGE-BALANCE`) and reset each run.
- No account-level status (active/hold/inactive) currently in code; these are documented as intended business rules but not currently enforced.

## How to use for Node.js tests
- Map each COBOL command path (TOTAL/CREDIT/DEBIT) to a service function.
- Maintain a central state variable for balance and implement same version of insufficient funds restriction.
- Create tests that assert exact textual output messages and final balance values.
