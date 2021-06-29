'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};



const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Vadim L',
  movements: [2030, 3450, -400, 3000, -620, -530, 7440, 133],
  interestRate: 7, // %
  pin: 7777,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = (movements, sort = false) => {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);


const calcAndDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, value, i, arr) => {
    return acc += value
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// calcAndDisplayBalance(account1.movements);

const calcDisplaySummary = (acc) => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc += mov);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter((interest, index, array) => {
      return interest > 1
    })
    .reduce((acc, current, i, arr) => {
      return acc += current;
    }, 0);
  labelSumInterest.textContent = `${Math.abs(interest)}€`;
}
// calcDisplaySummary(account1.movements);

const createUserNames = (accs) => {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLocaleLowerCase()
      .split(" ")
      .map((item, indx, array) => item[0])
      .join("");
  });
}
createUserNames(accounts);

const updateUI = (acc) => {
  // Dipslay movements
  displayMovements(acc.movements);
  //Display balance,
  calcAndDisplayBalance(acc)
  // summary balance
  calcDisplaySummary(acc);
}

let currentAccount;
//Event handlers
btnLogin.addEventListener("click", (event) => {
  event.preventDefault(); // to prevent page from reloading
  currentAccount = accounts.find(acc => {
    return inputLoginUsername.value === acc.userName;
  });
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    console.log("LOGGED IN");
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur()
    updateUI(currentAccount);
  }
});


btnTransfer.addEventListener("click", (event) => {
  event.preventDefault(); // to prevent page from reloading
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts
    .find(acc => acc.userName === inputTransferTo.value);
  // clearing fields after submitting the request
  inputTransferAmount.value = inputTransferTo.value = "";

  if (amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAcc &&
    receiverAcc.userName !== currentAccount.userName) {
    // Doing transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", (event) => {
  event.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);

  if (loanAmount > 0 && currentAccount.movements.some((mov) => {
    return loanAmount * 0.1 <= mov
  })) {
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", (event) => {
  event.preventDefault();

  if (inputCloseUsername.value === currentAccount.userName &&
    currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex((acc) => acc.userName = currentAccount.userName);
    accounts.splice(index, 1);

    // hide UI

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";

});


let sorted = false;
btnSort.addEventListener("click", event => {
  event.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});