# My Calculator

A simple calculator built using HTML, CSS and JavaScript.

## Features

- Addition
- Subtraction
- Multiplication
- Division
- Clear the display
- Dark mode
- Light mode
- Keyboard shortcuts


## Advanced Features

- History log
- Decimal
- Negatives
- **Scientific Operations:**
    - **Percentage Calculation:** Easily convert values to percentages or calculate percentage-based results.
    - **Negation Toggle:** Quickly switch the sign of a number (positive to negative or vice versa) with a single button press.
    - **Square Root Functionality:** Instantly compute the square root of non-negative numbers.
    - **Squaring Operation:** Effortlessly calculate the square of a number.
- Error handling
    -Prevent division by zero.
    Reject invalid mathematical operations.
    Prevent square root calculations on negative numbers in a real-number calculator.
    Handle invalid or incomplete input gracefully.
    Prevent memory operations from using invalid display values.
    Avoid unexpected NaN or Infinity results.

### Memory Operations:

- **MC (Memory Clear):** Clears the stored memory value (sets to 0).
- **MR (Memory Recall):** Retrieves and displays the stored memory value.
- **M+ (Memory Add):** Adds the current display value to the memory value.
- **M- (Memory Subtract):** Subtracts the current display value from the memory value.

## Requirement: Basic Operations, Scientific Operations, and Memory Operations must work correctly with the Calculation History feature.


## Expected Behavior

- Users can select a previous calculation from the history panel.
- The selected calculation's result must be restored to the calculator display.
- The restored result must be available for further basic and scientific calculations.

## Memory operations (M+ and M-) must use the restored displayed result.
- MR must retrieve the correct accumulated memory value.
- MC must reset the memory value to zero.
- Selecting a historical calculation must not unexpectedly change the stored memory value.
- New calculations must not overwrite or corrupt existing history entries.
- Negative and decimal values must be handled correctly.
-Memory operations must not use stale or unrelated calculator values.

## Example: History and Memory Integration

Scenario 1 — Restore a negative result from history and use M+

Previous calculation:

-1 - 3 = -4

User actions:

Select -1 - 3 = -4 from history.

Calculator displays -4.

Assume memory is initially 0.

Click M+.

Expected result:

Display: -4

Memory: -4

Pressing MR displays -4.

###Scenario 2 — Restore a result from history and use M-

Previous calculation:

-1 - 4 = -5

User actions:

Select -1 - 4 = -5 from history.

Calculator displays -5.

Assume memory is initially 10 if not previously set by user.

Click M-.

Expected result:

10 - (-5) = 15

Memory becomes 15.

Pressing MR displays 15.

## Error Handling

-Prevent division by zero.
-Reject invalid mathematical operations.
-Prevent square root calculations on negative numbers in a real-number calculator.
-Handle invalid or incomplete input gracefully.
Prevent memory operations from using invalid display values.
Avoid unexpected NaN or Infinity results.

## Testing and Acceptance Criteria

-All basic arithmetic functions work correctly.
-Scientific operations return the expected results.
-Memory operations correctly store, add, subtract, recall, and clear values.
-Historical results can be reused in new calculations.
-M+ and M- work correctly with restored historical values.
-Negative and decimal results are handled correctly.
-Calculation history remains accurate.
-Unit tests and regression tests pass.
-Existing calculator functionality remains unchanged after updates.

## Development Constraints

-Do not change unrelated existing functionality.
- Preserve existing calculator behavior.
- Identify the root cause before fixing bugs.
- Make the smallest necessary code changes.
- Ensure memory operations use the current displayed numeric value.
- Verify correct state synchronization between calculation history, display, and memory.
- Run regression tests after every modification.

## Technologies Used

- HTML
- CSS
- JavaScript

## How to Run

Open the index.html file in a web browser.