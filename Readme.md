# Array Algorithm Simulator

An interactive web-based Array Algorithm Simulator created as a college DSA assignment.

The application visually demonstrates:

- Array address calculation
- Array insertion
- Array deletion
- Linear search
- Binary search

The simulator is built using only HTML, CSS and Vanilla JavaScript.

---

## Features

### 1. Array Display

Users can create their own array by entering comma-separated numeric values.

Example:

10,20,30,40,50

The application displays:

[10] [20] [30] [40] [50]

with the corresponding array indices.

The simulator supports a maximum of 12 elements.

---

### 2. Array Address Calculation

The user can enter:

- Base address
- Element size
- Array index

The application calculates the address using:

Address(A[i]) = Base Address + (i × Element Size)

Example:

Base Address = 1000

Element Size = 4 bytes

Index = 3

Address:

1000 + (3 × 4)

1000 + 12

= 1012

The selected element is highlighted during the visualization.

---

### 3. Array Insertion

The user enters:

- Value
- Position/index

The application demonstrates how elements shift to the right before inserting the new element.

Example:

Before:

[10] [20] [30] [40]

Insert 25 at index 2.

After:

[10] [20] [25] [30] [40]

Time complexity:

O(n)

---

### 4. Array Deletion

The user selects an index.

The application demonstrates how elements shift left after the selected element is removed.

Example:

Before:

[10] [20] [30] [40]

Delete index 1.

After:

[10] [30] [40]

Time complexity:

O(n)

---

### 5. Linear Search

The user enters a target value.

The algorithm checks every element sequentially.

Example:

[10] [20] [30] [40] [50]

Target = 40

The simulator checks:

10 → 20 → 30 → 40

Time complexity:

O(n)

---

### 6. Binary Search

Binary search works on a sorted array.

The simulator displays:

- Low
- Mid
- High
- Comparisons
- Eliminated search space

The algorithm repeatedly removes half of the remaining search space.

Time complexity:

O(log n)

---

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript

No external libraries or frameworks are required.

---

## Project Structure

```text
array-algorithm-simulator/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## Running Locally

This is a static HTML/CSS/JavaScript project, so it has no npm dependencies and does not require `npm install`. You can open `index.html` directly in a browser.

To serve it locally with npm, run:

```bash
npx serve .
```

Then open the local URL shown in the terminal. This uses `serve` through `npx` without adding project dependencies.