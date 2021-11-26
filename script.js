'use strict';

// BANKER APP

// Data
const account1 = {
  owner: 'Shakir Hussain',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-11-20T09:48:16.867Z',
    '2021-11-21T09:48:16.867Z',
    '2021-11-24T09:48:16.867Z',
    '2021-11-25T09:48:16.867Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Ashwini Chaudhary',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2021-11-20T09:48:16.867Z',
    '2021-11-21T09:48:16.867Z',
    '2021-11-24T09:48:16.867Z',
    '2021-11-25T09:48:16.867Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const accounts = [account1, account2];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
/////////////////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//-----------------------------Bankist Application-------------------------------------------------------//
//Currency formating
const foCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
//Date Functionality of movements
const DateMov = function (date, locale) {
  function calcday(date9, date2) {
    return Math.round((date2 - date9) / (1000 * 3600 * 24));
  }
  const date3 = calcday(date, new Date());
  if (date3 === 0) return 'Today';
  if (date3 === 1) return 'Yesterday';
  if (date3 <= 7) return `${date3} days ago`;
  else {
    date = new Intl.DateTimeFormat(locale).format(date);
    return date;
  }
};
//Movement/Transaction history
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => {
        if (a - b > 0) return -1;
      })
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date1 = new Date(acc.movementsDates[i]);
    const displayDate = DateMov(date1, acc.locale);
    const formatedMov = foCurr(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
     <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
     <div class="movements__value">${formatedMov}</div>
    </div> `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Total Balance
const calcPrintBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const fbal = foCurr(balance, acc.locale, acc.currency);
  labelBalance.textContent = `${fbal}`;
};

//Summary
const displaySummary = function (acc) {
  //Income
  const incomes = acc.movements.filter(V => V > 0).reduce((a, v) => a + v, 0);
  const finc = foCurr(incomes, acc.locale, acc.currency);
  labelSumIn.textContent = `${finc}`;

  //Outcome
  const outcome = acc.movements.filter(V => V < 0).reduce((a, v) => a + v, 0);
  const Ouc = foCurr(outcome, acc.locale, acc.currency);
  labelSumOut.textContent = `${Ouc}`;

  //Interest
  const interest = acc.movements
    .filter(v => v > 0)
    .map(v => v * 0.01 * acc.interestRate)
    .filter(v => v >= 1)
    .reduce((a, v) => a + v, 0);
  const Inter = foCurr(interest, acc.locale, acc.currency);
  labelSumInterest.textContent = `${Inter}`;
};

//UserName function
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

//UI Update function
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);
  //Display balance
  calcPrintBalance(acc);
  //Display summary
  displaySummary(acc);
  //Display Date
  headDate(acc);
};

const startLogOutTimer = function () {
  //Set timeout to 10 mins
  let time = 300;
  //call the timer every second
  const tick = function () {
    //in Each call print the remaining time to UI
    const min = String(Math.floor(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${min}:${sec}`;
    if (time == 0) {
      clearInterval(t);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'You have been logged out!';
    }
    time--;
  };
  const t = setInterval(tick, 1000);
  return t;
};

//Even Handler for Login
let currentAccount, t;

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and Message
    labelWelcome.textContent = `GoodDay! ${currentAccount.owner.split(' ')[0]}`;
    //Manupluting Opacity style
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (t) clearInterval(t);
    t = startLogOutTimer();
    updateUI(currentAccount);
  }
});

//Transfer Amount to another user
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (Number(labelBalance.textContent.slice(0, -1)) > amount && amount > 0) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movements.push(amount);
    recieverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

//Deleting an Account function
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username == currentAccount.username
    );
    //Deleting the account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//Loan Feature
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.floor(Number(inputLoanAmount.value));
  setTimeout(() => {
    if (amount > 0 && currentAccount.movements.some(t => t >= 0.1 * amount)) {
      //add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }
  }, 4000);
  inputLoanAmount.value = '';
});
let sort = false;
//Sort functionality
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount, !sort);
  sort = !sort;
});
//Date Functionality of top
const headDate = function (acc) {
  const date211 = new Date();
  const Option = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: 'numeric',
    month: '2-digit',
    year: 'numeric',
    weekday: 'long',
  };
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    Option
  ).format(date211);
};
setInterval(headDate, 1000);
