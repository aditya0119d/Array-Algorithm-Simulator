# Array Algorithm Simulator

A vanilla HTML, CSS and JavaScript DSA assignment project.

## Features

### Array operations
- Array creation and display
- Array address calculation
- Insertion and deletion
- Linear search and binary search

### Sorting lab
- Selection Sort
- Bubble Sort
- Insertion Sort
- Quick Sort
- Merge Sort
- Shell Sort (halving gap sequence)
- Radix Sort (signed safe integers)

Each sorting algorithm is implemented manually (no `Array.prototype.sort()` in the sorting implementations) and supports step-by-step playback, automatic playback, reset, comparison/movement counters, and complexity details.

## Run locally

1. Keep `index.html`, `style.css`, and `script.js` in the same folder.
2. Open `index.html` in a browser, or use VS Code Live Server.
3. Enter comma-separated numeric values (maximum 12 elements).
4. Select **Sorting Lab**, choose an algorithm, then use **Run** or **Next Step**.

Radix Sort requires safe integers. Other algorithms accept finite JavaScript numbers.

## Notes
- Sorting is performed on a working copy and the main array is updated when the animation reaches its final step.
- Binary Search still requires a sorted array. Its helper sort uses a manual insertion-sort implementation.
- Quick Sort has O(n log n) average time and O(n²) worst-case time.
- Shell Sort complexity depends on its gap sequence; this version uses halving gaps.
