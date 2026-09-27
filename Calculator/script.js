// ========================================
// CALCULATOR STATE
// ========================================

let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldResetDisplay = false;


// ========================================
// GET HTML ELEMENTS
// ========================================

const display = document.getElementById("display");
const expression = document.getElementById("expression");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");

const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const equalsButton = document.querySelector('[data-action="calculate"]');


// ========================================
// UPDATE DISPLAY
// ========================================

function updateDisplay() {

    display.textContent = currentInput;

    if (previousInput && operator) {

        const displayOperator = getDisplayOperator(operator);

        expression.textContent =
            `${formatNumber(previousInput)} ${displayOperator}`;

    } else {

        expression.textContent = "";
    }

}


// ========================================
// OPERATOR SYMBOL
// ========================================

function getDisplayOperator(operator) {

    const operators = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return operators[operator] || operator;
}


// ========================================
// FORMAT LARGE NUMBERS
// ========================================

function formatNumber(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return value;
    }

    return number.toLocaleString("en-US", {
        maximumFractionDigits: 10
    });
}


// ========================================
// ADD NUMBER
// ========================================

function appendNumber(number) {

    if (currentInput === "Error") {
        clearCalculator();
    }

    if (shouldResetDisplay) {

        currentInput = number;

        shouldResetDisplay = false;

    } else if (number === "." && currentInput.includes(".")) {

        return;

    } else if (currentInput === "0" && number !== ".") {

        currentInput = number;

    } else {

        currentInput += number;
    }

    updateDisplay();
}


// ========================================
// CHOOSE OPERATOR
// ========================================

function chooseOperator(selectedOperator) {

    if (currentInput === "Error") {
        return;
    }

    if (operator && !shouldResetDisplay) {

        calculateResult();

    }

    previousInput = currentInput;

    operator = selectedOperator;

    shouldResetDisplay = true;

    updateDisplay();
}


// ========================================
// CALCULATE RESULT
// ========================================

function calculateResult() {

    if (!operator || previousInput === "") {
        return;
    }

    const firstNumber = Number(previousInput);
    const secondNumber = Number(currentInput);

    let result;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {

                showError("Cannot divide by zero");

                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }


    // Check for invalid mathematical result
    if (!Number.isFinite(result)) {

        showError("Invalid result");

        return;
    }


    // Avoid extremely long floating point values
    result = Number(result.toFixed(10));

    expression.textContent =
        `${formatNumber(previousInput)} ${getDisplayOperator(operator)} ${formatNumber(currentInput)} =`;

    currentInput = String(result);

    previousInput = "";

    operator = null;

    shouldResetDisplay = true;

    display.textContent = formatNumber(currentInput);
}


// ========================================
// CLEAR CALCULATOR
// ========================================

function clearCalculator() {

    currentInput = "0";

    previousInput = "";

    operator = null;

    shouldResetDisplay = false;

    expression.textContent = "";

    updateDisplay();
}


// ========================================
// DELETE LAST CHARACTER
// ========================================

function deleteLastCharacter() {

    if (currentInput === "Error") {

        clearCalculator();

        return;
    }

    if (shouldResetDisplay) {
        return;
    }

    if (currentInput.length <= 1) {

        currentInput = "0";

    } else {

        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}


// ========================================
// ERROR HANDLING
// ========================================

function showError(message) {

    currentInput = "Error";

    expression.textContent = message;

    previousInput = "";

    operator = null;

    shouldResetDisplay = true;

    display.textContent = "Error";
}


// ========================================
// BUTTON EVENTS
// ========================================

// Number and decimal buttons
numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        appendNumber(button.dataset.number);

    });

});


// Operator buttons
operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        chooseOperator(button.dataset.operator);

    });

});


// Clear button
clearButton.addEventListener("click", () => {

    clearCalculator();

});


// Delete button
deleteButton.addEventListener("click", () => {

    deleteLastCharacter();

});


// Equals button
equalsButton.addEventListener("click", () => {

    calculateResult();

});


// ========================================
// KEYBOARD SUPPORT
// ========================================

document.addEventListener("keydown", event => {

    const key = event.key;


    // Numbers
    if (/^[0-9]$/.test(key)) {

        appendNumber(key);

        return;
    }


    // Decimal
    if (key === ".") {

        appendNumber(".");

        return;
    }


    // Operators
    if (["+", "-", "*", "/"].includes(key)) {

        chooseOperator(key);

        return;
    }


    // Enter or =
    if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculateResult();

        return;
    }


    // Backspace
    if (key === "Backspace") {

        deleteLastCharacter();

        return;
    }


    // Escape
    if (key === "Escape") {

        clearCalculator();

    }

});


// ========================================
// INITIAL DISPLAY
// ========================================

updateDisplay();