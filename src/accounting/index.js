#!/usr/bin/env node

const readline = require('readline');

// Storage simulating COBOL DataProgram STORAGE-BALANCE
let storageBalance = 1000.0;

function resetBalance(value = 1000.0) {
  storageBalance = Number(value);
}

function readBalance() {
  return storageBalance;
}

function writeBalance(newBalance) {
  storageBalance = Number(newBalance);
}

function formatCurrency(value) {
  return Number(value).toFixed(2).padStart(9, '0');
}

function creditAccount(amount) {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return { success: false, message: 'Invalid amount; enter a positive number.' };
  }

  const current = readBalance();
  const updated = current + amount;
  writeBalance(updated);

  return { success: true, amount, newBalance: updated, message: 'Amount credited.' };
}

function debitAccount(amount) {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return { success: false, message: 'Invalid amount; enter a positive number.' };
  }

  const current = readBalance();
  if (current < amount) {
    return { success: false, message: 'Insufficient funds for this debit.' };
  }

  const updated = current - amount;
  writeBalance(updated);

  return { success: true, amount, newBalance: updated, message: 'Amount debited.' };
}

function showMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

async function prompt(question, rl) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let continueFlag = true;

  while (continueFlag) {
    showMenu();
    const choiceInput = await prompt('Enter your choice (1-4): ', rl);
    const choice = Number(choiceInput.trim());

    switch (choice) {
      case 1: {
        const finalBalance = readBalance();
        console.log(`Current balance: ${formatCurrency(finalBalance)}`);
        break;
      }
      case 2: {
        const amountInput = await prompt('Enter credit amount: ', rl);
        const amount = Number(amountInput.trim());
        const result = creditAccount(amount);
        if (result.success) {
          console.log(`Amount credited. New balance: ${formatCurrency(result.newBalance)}`);
        } else {
          console.log(result.message);
        }
        break;
      }
      case 3: {
        const amountInput = await prompt('Enter debit amount: ', rl);
        const amount = Number(amountInput.trim());
        const result = debitAccount(amount);
        if (result.success) {
          console.log(`Amount debited. New balance: ${formatCurrency(result.newBalance)}`);
        } else {
          console.log(result.message);
        }
        break;
      }
      case 4:
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }

  console.log('Exiting the program. Goodbye!');
  rl.close();
}

module.exports = {
  readBalance,
  writeBalance,
  resetBalance,
  formatCurrency,
  creditAccount,
  debitAccount,
  main,
};

if (require.main === module) {
  main();
}
