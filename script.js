
// MAIN STATE: Track completed results, the display element, and error status.
let resultShown = false;
let display = document.getElementById("display");

// Add near the top of script.js.
let hasError = false;

// ERROR DISPLAY: Show a message and mark the calculator as being in an error state.
function showError(message) {
    display.value = message;
    hasError = true;
}
// Replace addValue().

// INPUT: Accept digits/operators; a digit after a result starts a new calculation.
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

// AC: Reset both display lines and input flags; stored memory and history remain.
function clearDisplay() {
    document.getElementById("expressionDisplay").textContent = "";
    display.value = "0";
    hasError = false;
    resultShown = false;
}

// script.js: Replace calculate() and add these history functions.
// HISTORY STORAGE: Keep completed calculations in this page session, newest first.
const calculationHistory = [];

// Replace calculate().
// CALCULATE: Evaluate the displayed expression, reject non-finite results, and log success.
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

// HISTORY PANEL: Rebuild clickable entries and update the empty-state controls.
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

        // RECALL HISTORY: Restore the expression/result without changing memoryValue.
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

// CLEAR HISTORY: Remove history entries only; the memory register is separate.
function clearHistory() {
    // Remove all stored calculations from memory and refresh the panel.
    calculationHistory.length = 0;
    renderHistory();
}

// SCIENTIFIC OPERATIONS: Percentage, sign toggle, square root, and square.
// Percentage/root/square results are logged; sign toggling returns without logging.
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

// KEYBOARD: Handle calculator input, scientific shortcuts, clear, and backspace.
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

// THEME: Toggle dark mode and update the theme button label.
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
// MEMORY: MC clears memory/display; MR recalls memory; M+ and M- update the total.
// M+ and M- use the existing memory total and displayed number, then log the result.
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

    // Calculate a candidate total before committing it to memory.
    const newMemory = operation === "M+"
        ? memoryValue + value
        : memoryValue - value;

    if (!Number.isFinite(newMemory)) {
        showError("Memory value too large");
        return;
    }

    // Build the history text using the old memory value before storing the new total.
    const expression = `${memoryValue} ${operation === "M+" ? "+" : "-"} ${value}`;
    memoryValue = newMemory;
    document.getElementById("expressionDisplay").textContent = expression;
    display.value = String(memoryValue);
    resultShown = true;

    // Save M+ and M- calculations to history.
    calculationHistory.unshift({ expression, result: memoryValue });
    renderHistory();
}

// MEMORY KEYBOARD: A second listener handles M/C and the conditional + recall.
// Both keydown listeners run for the same event, in registration order.
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