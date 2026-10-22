
let resultShown = false;
let display = document.getElementById("display");

// Add near the top of script.js.
let hasError = false;

function showError(message) {
    display.value = message;
    hasError = true;
}
// Replace addValue().

function addValue(value) {
    document.getElementById("expressionDisplay").textContent = "";

    const isNumber = /^[0-9.]$/.test(value);

    // Start fresh after an error or when typing a number after a result.
    if (hasError || (resultShown && isNumber)) {
        clearDisplay();
    }

    resultShown = false;

    // Replace the initial zero only with a number, keeping it for operators.
    if (display.value === "0" && isNumber) {
        display.value = value === "." ? "0." : value;
    } else {
        display.value += value;
    }
}


// Replace clearDisplay().

function clearDisplay() {
    document.getElementById("expressionDisplay").textContent = "";
    display.value = "0";
    hasError = false;
    resultShown = false;
}


/*function calculate() {
    try {
        display.value = Function(
            '"use strict"; return (' + display.value + ')'
        )();
    } catch {
        display.value = "Error";
    }
}*/

// script.js: Replace calculate() and add these history functions.
const calculationHistory = [];

// Replace calculate().
function calculate() {
    if (hasError) {
        return;
    }

    const expression = display.value;

    try {
        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        // Reject Infinity and NaN without adding them to history.
        if (!Number.isFinite(result)) {
            showError(
                expression.includes("/")
                    ? "Cannot divide by 0"
                    : "Result is undefined or too large"
            );
            return;
        }
        document.getElementById("expressionDisplay").textContent = expression;
        display.value = String(result);
        resultShown = true;
        calculationHistory.unshift({ expression, result });
        renderHistory();
    } catch {
        showError("Invalid calculation");
    }
}

function renderHistory() {
    const historyList = document.getElementById("historyList");
    historyList.replaceChildren();

    calculationHistory.forEach(function (entry) {
        const item = document.createElement("li");
        const button = document.createElement("button");
        const expression = entry.expression
            .replace(/\*/g, " × ")
            .replace(/\//g, " ÷ ")
            .replace(/\+/g, " + ")
            .replace(/-/g, " − ");

        button.type = "button";
        button.className = "history-entry";
        button.textContent = `${expression} = ${entry.result}`;

        button.addEventListener("click", function () {
            hasError = false;
            // Show the calculation above and its result below.
            document.getElementById("expressionDisplay").textContent =
                entry.expression;
            display.value = String(entry.result);
            resultShown = true;

            display.focus();
        });

        item.appendChild(button);
        historyList.appendChild(item);
    });

    const isEmpty = calculationHistory.length === 0;
    document.getElementById("historyEmpty").hidden = !isEmpty;
    document.getElementById("clearHistory").disabled = isEmpty;
}

function clearHistory() {
    // Remove all stored calculations from memory and refresh the panel.
    calculationHistory.length = 0;
    renderHistory();
}

function scientificOperation(operation) {

    if (hasError) {
        clearDisplay();
        return;
    }

    const value = Number(display.value);

    if (display.value.trim() === "" || !Number.isFinite(value)) {
        showError("Enter a valid number");
        return;
    }

    let result;
    let expression;

    switch (operation) {
        case "%":
            result = value / 100;
            expression = `${value}%`;
            break;

        case "+/-":
            display.value = String(-value);
            return;

        case "√":
            if (value < 0) {
                showError("Invalid square root input");
                return;
            }
            result = Math.sqrt(value);
            expression = `√(${value})`;
            break;

        case "x²":
            result = value ** 2;
            expression = `(${value})²`;
            break;

        default:
            return;
    }

    if (!Number.isFinite(result)) {
        showError("Result is undefined or too large");
        return;
    }
    document.getElementById("expressionDisplay").textContent = expression;
    display.value = String(result);
    resultShown = true;
    calculationHistory.unshift({ expression, result });
    renderHistory();
}




document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (key.length === 1 && "0123456789+-*/.%^".includes(key)) {
        document.getElementById("expressionDisplay").textContent = "";
    }

    if (hasError) {
        clearDisplay();
    }
    // script.js: Add inside the existing keydown listener,
    // immediately after: const key = event.key;

    // Allow Enter and Space to activate focused buttons and the history toggle.
    if (
        (key === "Enter" || key === " ") &&
        event.target.matches("button, summary")
    ) {
        return;
    }
    if ("0123456789+-*/.".includes(key)) {
        addValue(key);
    }
    else if (key === "%") {
        event.preventDefault();
        scientificOperation("%");
    } else if (key === "^") {
        event.preventDefault();
        scientificOperation("x²");
    }
    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Escape") {
        clearDisplay();
    } else if (key === "Backspace") {
        display.value = display.value.slice(0, -1) || "0";
    }


});

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "Switch to Light Mode";
    } else {
        themeToggle.textContent = "Switch to Dark Mode";
    }
});

// Store memory until MC is pressed or the page reloads.
let memoryValue = 0;

/*function memoryOperation(operation) {

    if (operation === "MC") {
        memoryValue = 0;
        clearDisplay();
        return;
    }

    if (operation === "MR") {
        clearDisplay();
        display.value = String(memoryValue);

        // A number starts fresh; an operator continues from recalled memory.
        resultShown = true;
        return;
    }

    if (operation !== "M+" && operation !== "M-") {
        return;
    }

    if (hasError) {
        return;
    }

    const value = Number(display.value);

    // Require a number; unfinished expressions must be calculated first.
    if (display.value.trim() === "" || !Number.isFinite(value)) {
        showError("Enter a valid number");
        return;
    }

    const newMemory = operation === "M+"
        ? memoryValue + value
        : memoryValue - value;

    // Preserve existing memory if the new value is too large.
    if (!Number.isFinite(newMemory)) {
        showError("Memory value too large");
        return;
    }

    memoryValue = newMemory;
    // Show the updated memory total immediately.
    document.getElementById("expressionDisplay").textContent = "";
    display.value = String(memoryValue);
    resultShown = true;
}
*/
function memoryOperation(operation) {
    if (operation === "MC") {
        memoryValue = 0;
        clearDisplay();
        return;
    }

    if (operation === "MR") {
        clearDisplay();
        display.value = String(memoryValue);
        resultShown = true;
        return;
    }

    if (operation !== "M+" && operation !== "M-") {
        return;
    }

    if (hasError) {
        return;
    }

    const value = Number(display.value);

    if (display.value.trim() === "" || !Number.isFinite(value)) {
        showError("Enter a valid number");
        return;
    }

    const newMemory = operation === "M+"
        ? memoryValue + value
        : memoryValue - value;

    if (!Number.isFinite(newMemory)) {
        showError("Memory value too large");
        return;
    }

    const expression = `${memoryValue} ${operation === "M+" ? "+" : "-"} ${value}`;
    memoryValue = newMemory;
    document.getElementById("expressionDisplay").textContent = expression;
    display.value = String(memoryValue);
    resultShown = true;

    // Save M+ and M- calculations to history.
    calculationHistory.unshift({ expression, result: memoryValue });
    renderHistory();
}

document.addEventListener("keydown", function (event) {
    const key = event.key;
    // script.js: Add these memory-related keydown handlers.

    if (key === "m" || key === "M") {
        event.preventDefault();
        memoryOperation("MR");
        return;
    }

    if (key === "c" || key === "C") {
        // "C" alone now clears memory (MC) only when nothing else is displayed.
        if (display.value === "0" && !hasError) {
            event.preventDefault();
            memoryOperation("MC");
        }
        return;
    }

    if (key === "+") {
        // "+" alone now recalls memory (MR) before adding.
        if (display.value === "0" && !hasError) {
            event.preventDefault();
            memoryOperation("MR");
        }
    }
});
// Then fall through to the normal number/operator logic.
// ... existing keydown logic (addValue, scientificOperation, etc.)