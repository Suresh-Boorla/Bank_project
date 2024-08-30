'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// MY BANK APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
    owner: "Suresh Boorla",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2,
    pin: 2222,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2024-07-10T12:01:20.894Z',
        '2024-07-09T12:01:20.894Z',
    ],
    currency: 'EUR',
    locale: 'en-US',
};
const account2 = {
    owner: "Raina Rajender",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2024-07-09T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};
// const account3 = {
//     owner: "Rahim pasha",
//     movements: [340, -2300, 500, -500, 800, 1220],
//     interestRate: 1,
//     pin: 3333
// }
// const account4 = {
//     owner: "Pavan kumar",
//     movements: [4200, -400, 500, -3400, 800, 720],
//     interestRate: 1.8,
//     pin: 4444
// }

const accounts = [account1, account2];



const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movemnts');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn-transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input__loan--amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//format a currency function
const formatCurrency = function(value,locale,currency){
    return new Intl.NumberFormat(locale,{
        style:"currency",
        currency:currency
    }).format(value)    
}

const formatMovementDate = function(date){
    const calcDaysPassed = (date1 , date2) =>
        Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcDaysPassed(new Date(), date);

    if(daysPassed === 0) return "Today";
    if(daysPassed === 1) return "Yesterday";
    if(daysPassed <= 7) return `${daysPassed} days ago`;
    else{
        const day = `${date.getDate()}`.padStart(2, 0);
        const month = `${date.getMonth() + 1}`.padStart(2, 0);
        const year = `${date.getFullYear()}`.padStart(2, 0);

        return `${day}/${month}/${year}`;
    }
};

const displayMovements = function (acc) {
    containerMovements.innerHTML = '';

    const movs = acc.movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[i]);

        const labelDate = formatMovementDate(date);

        const html = `<div class="movment__row">
                <div class="movemnet__type movemnet__type--${type}">${i + 1} ${type}</div>
                <div class="movment__date">${labelDate}</div>
                <div class="movment__value">${new Intl.NumberFormat(acc.locale,{
                    style:"currency",
                    currency:acc.currency
                }).format(mov)}</div>
            </div>`
        containerMovements.insertAdjacentHTML('afterbegin', html)

    })
}


// Display total Current balance
const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((ac, mov) => {
        return ac + mov;
    }, 0)

    labelBalance.textContent = formatCurrency(acc.balance,acc.locale,acc.currency)
}
calcDisplayBalance(account1);

//DisplaySummary
const calcDisplaySummary = function (acc) {
    const income = acc.movements
        .filter(val => val > 0)
        .reduce((acc, val) => acc + val, 0);
    labelSumIn.textContent = formatCurrency(income.toFixed(2),acc.locale,acc.currency);

    const out = acc.movements
        .filter(val => val < 0)
        .reduce((acc, val) => acc + val, 0);
    labelSumOut.textContent = formatCurrency(Math.abs(out.toFixed(2)),acc.locale,acc.currency);
    // `${Math.abs(out.toFixed(2))} EUR`

    const interest = acc.movements
        .filter(val => val > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter((int, i, arr) => int > 1)
        .reduce((acc, val) => acc + val, 0);
    labelSumInterest.textContent = formatCurrency(income.toFixed(2),acc.locale,acc.currency)
    // `INTEREST ${interest.toFixed(2)} EUR`
}


// dynamically creating username
const createUsername = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase().split(' ').
            map(name => name[0]).join('')
    })
}
createUsername(accounts);

// Create function will be logged out in 05:00 minutes
const startLogOutTime = function(){
    const tick = function(){
        const min = String(Math.trunc(time/60)).padStart(2,0);
        const seconds = String(time%60).padStart(2,0);

        labelTimer.textContent = `${min} : ${seconds}`;

        time--;
        if(time === 0){
            clearInterval(timer);
            labelWelcome.textContent = "Login to get started";
            containerApp.style.opacity = 0;
        }
    }
    let time = 300  ;
    tick();
    const timer = setInterval(tick,1000)
}


const updateUI = function (acc) {
    // Display movements
    displayMovements(acc);

    // Display balance
    calcDisplayBalance(acc);

    // Display summary
    calcDisplaySummary(acc);
}

let currentAccount;

// //Fake Login for development
// currentAccount = account1;
// containerApp.style.opacity = 1;
// updateUI(currentAccount);

//User Login Event handlers
btnLogin.addEventListener('click', function (e) {
    e.preventDefault(); // To stop the page refreshing
    console.log("Login btn clicked");

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)

        // validate username and password
    if (currentAccount?.pin !== Number(inputLoginPin.value)
        || currentAccount.username !== inputLoginUsername.value) {
        alert("Please enter a valid username or password");
        inputLoginUsername.style.borderColor = "red";
        inputLoginPin.style.borderColor = "red";
        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = "";
    } 

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        // Display UI and message
        labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 1;

        //Current Date and Time
        const dateNow = new Date();

        const options = {
            hour: "numeric",
            minutes: "numeric",
            day: "numeric",
            month: "long",
            year: "numeric",
        }

        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(dateNow);

        //call the timer function
        startLogOutTime();

        //update UI
        updateUI(currentAccount);

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = "";

    }
})

//Transfer money
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    console.log("Transfer btn clicked");
    const amount = Number(inputTransferAmount.value);
    const recieverAmount = accounts.find(acc => acc.username === inputTransferTo.value);
    inputTransferAmount.value = inputTransferTo.value = "";

    //write a lagics to Transfer money
    if (amount > 0 && recieverAmount && currentAccount.balance > amount
        && recieverAmount.username !== currentAccount.username) {
        currentAccount.movements.push(-amount);
        recieverAmount.movements.push(amount);

        //Current Date
        currentAccount.movementsDates.push(new Date().toISOString());
        recieverAmount.movementsDates.push(new Date().toISOString());


        //update UI
        updateUI(currentAccount);
    }
})

//Close Account
btnClose.addEventListener("click", function (e) {
    e.preventDefault();
    if (inputCloseUsername.value === currentAccount.username &&
        Number(inputClosePin.value) === currentAccount.pin
    ) {
        const index = accounts.findIndex(
            acc => acc.username === currentAccount.username
        )
        // Delete account
        accounts.splice(index, 1);

        // Hide UI
        containerApp.style.opacity = 0;
        labelWelcome.textContent = "Log in to get started";
    }
    inputCloseUsername.value = inputClosePin.value = "";
});

//Loan Account
btnLoan.addEventListener("click", function (e) {
    e.preventDefault();
    console.log('loan reaquested');

    const amount = Math.floor(inputLoanAmount.value);
    if (amount > 0 && currentAccount.movements.some(val => val >= amount * 0.1)) {
        // The setTimeout() method calls a function after a number of milliseconds.
      setTimeout(() =>{
        currentAccount.movements.push(amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        updateUI(currentAccount);
      },5000)
    }
    inputLoanAmount.value = "";
});












// withdrows
// movements = [250,-400,1200,-300,840,720];
// const withdrows = movements.filter((mov) =>{
//     return mov < 0;
// })
// console.log(withdrows);

// deposit
// movements = [250,-400,1200,-300,840,720];
// const deposit = movements.filter((mov) =>{
//     return mov > 0;
// })
// console.log(deposit);



// const movements = [250,-400,1200,-300,840,720];
// const eurToUSD = 1.1;

// const totalDepositsUsd = movements
// .filter((val) =>{
//     return val > 0;
// })
// .map((val) =>{
//     return val * eurToUSD;
// })
// .reduce((acc,val) => {
//     return acc + val;
// },0)

// short code for top
// const totalDepositsUsd = movements
// .filter(val => val > 0)
// .map(val => val*eurToUSD)
// .reduce((acc,val) => acc+val,0)

// console.log("USD:" +totalDepositsUsd);