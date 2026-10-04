/* =========================================================
   ARRAY ALGORITHM SIMULATOR
   Vanilla JavaScript
========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

let array = [10, 20, 30, 40, 50, 60, 70];

let currentOperation = "address";

let steps = [];
let currentStep = 0;

let isRunning = false;
let animationTimer = null;


/* =========================================================
   OPERATION INFORMATION
========================================================= */

const operationData = {

    address: {
        eyebrow: "OPERATION 01",
        title: "Array Address Calculation",
        description:
            "Calculate the memory address of an array element using the base address, index and element size.",
        complexity: "O(1)",

        explanation:
            "An array stores elements in consecutive memory locations. Because every element has the same size, the address of any element can be calculated directly from the base address and its index.",

        formula:
            "Address(A[i]) = Base Address + (i × Element Size)"
    },

    insert: {
        eyebrow: "OPERATION 02",
        title: "Array Insertion",
        description:
            "Insert a new value at a selected position and shift existing elements to the right.",

        complexity: "O(n)",

        explanation:
            "When inserting into the middle of an array, elements after the insertion position must move one position to the right to make space for the new value.",

        formula:
            "Worst Case: O(n) because elements may need to shift."
    },

    delete: {
        eyebrow: "OPERATION 03",
        title: "Array Deletion",
        description:
            "Delete an element from a selected position and shift remaining elements to the left.",

        complexity: "O(n)",

        explanation:
            "After removing an element from the middle of an array, the elements to its right must shift one position to the left to fill the empty location.",

        formula:
            "Worst Case: O(n) because elements may need to shift."
    },

    linear: {
        eyebrow: "OPERATION 04",
        title: "Linear Search",
        description:
            "Search for a target value by checking array elements sequentially from left to right.",

        complexity: "O(n)",

        explanation:
            "Linear search starts at the first element and compares each element with the target until the value is found or the array ends.",

        formula:
            "Worst Case: n comparisons → O(n)"
    },

    binary: {
        eyebrow: "OPERATION 05",
        title: "Binary Search",
        description:
            "Search a sorted array by repeatedly eliminating half of the remaining search space.",

        complexity: "O(log n)",

        explanation:
            "Binary search requires a sorted array. It checks the middle element and eliminates either the left or right half depending on the comparison.",

        formula:
            "Worst Case: O(log₂ n)"
    }

};


/* =========================================================
   DOM REFERENCES
========================================================= */

const arrayInput = document.getElementById("arrayInput");
const createArrayBtn = document.getElementById("createArrayBtn");
const resetArrayBtn = document.getElementById("resetArrayBtn");

const arrayContainer = document.getElementById("arrayContainer");
const arrayError = document.getElementById("arrayError");

const operationTabs =
    document.querySelectorAll(".operation-tab");

const operationEyebrow =
    document.getElementById("operationEyebrow");

const operationTitle =
    document.getElementById("operationTitle");

const operationDescription =
    document.getElementById("operationDescription");

const complexityBadge =
    document.getElementById("complexityBadge");

const operationPanel =
    document.getElementById("operationPanel");

const visualizationArea =
    document.getElementById("visualizationArea");

const executionStatus =
    document.getElementById("executionStatus");

const explanationText =
    document.getElementById("explanationText");

const formulaBox =
    document.getElementById("formulaBox");

const stepLog =
    document.getElementById("stepLog");

const stepCounter =
    document.getElementById("stepCounter");

const runBtn =
    document.getElementById("runBtn");

const nextBtn =
    document.getElementById("nextBtn");

const resetOperationBtn =
    document.getElementById("resetOperationBtn");

const speedSlider =
    document.getElementById("speedSlider");

const speedValue =
    document.getElementById("speedValue");

const resultCard =
    document.getElementById("resultCard");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", initialize);


/**
 * Initializes the simulator.
 */
function initialize() {

    renderArray();

    setupOperationTabs();

    updateOperationUI();

    setupEventListeners();

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

/**
 * Registers all button and input events.
 */
function setupEventListeners() {

    createArrayBtn.addEventListener(
        "click",
        createArrayFromInput
    );

    resetArrayBtn.addEventListener(
        "click",
        resetArray
    );

    runBtn.addEventListener(
        "click",
        runSimulation
    );

    nextBtn.addEventListener(
        "click",
        nextStep
    );

    resetOperationBtn.addEventListener(
        "click",
        resetOperation
    );

    speedSlider.addEventListener(
        "input",
        updateSpeed
    );

}


/**
 * Creates the operation tab listeners.
 */
function setupOperationTabs() {

    operationTabs.forEach(tab => {

        tab.addEventListener("click", () => {

            currentOperation =
                tab.dataset.operation;

            operationTabs.forEach(item => {
                item.classList.remove("active");
            });

            tab.classList.add("active");

            stopSimulation();

            updateOperationUI();

        });

    });

}


/* =========================================================
   ARRAY MANAGEMENT
========================================================= */

/**
 * Reads the user's comma-separated array input
 * and creates a new array.
 */
function createArrayFromInput() {

    const raw = arrayInput.value.trim();

    clearArrayError();

    if (!raw) {

        showArrayError(
            "Please enter at least one number."
        );

        return;
    }

    const parts = raw.split(",");

    if (parts.length > 12) {

        showArrayError(
            "Maximum array size is 12 elements."
        );

        return;
    }

    const parsed = [];

    for (const part of parts) {

        const value = Number(part.trim());

        if (!Number.isFinite(value)) {

            showArrayError(
                `"${part.trim()}" is not a valid number.`
            );

            return;
        }

        parsed.push(value);
    }

    if (parsed.length === 0) {

        showArrayError(
            "The array cannot be empty."
        );

        return;
    }

    array = parsed;

    resetOperation();

    renderArray();

    setStatus(
        "success",
        "Array created"
    );

}


/**
 * Resets the array to the default example.
 */
function resetArray() {

    array = [10, 20, 30, 40, 50, 60, 70];

    arrayInput.value =
        array.join(",");

    clearArrayError();

    stopSimulation();

    resetOperation();

    renderArray();

}


/**
 * Displays the current array visually.
 *
 * @param {Object} options - Highlighting options.
 */
function renderArray(options = {}) {

    const {
        active = [],
        found = [],
        low = null,
        mid = null,
        high = null,
        eliminated = []
    } = options;

    arrayContainer.innerHTML = "";

    if (array.length === 0) {

        arrayContainer.innerHTML = `
            <div class="empty-visualization">
                <h3>Array is empty</h3>
                <p>Create an array to continue.</p>
            </div>
        `;

        return;
    }

    array.forEach((value, index) => {

        const item =
            document.createElement("div");

        item.className = "array-item";

        if (active.includes(index)) {
            item.classList.add("active");
        }

        if (found.includes(index)) {
            item.classList.add("found");
        }

        if (index === low) {
            item.classList.add("low");
        }

        if (index === mid) {
            item.classList.add("mid");
        }

        if (index === high) {
            item.classList.add("high");
        }

        if (eliminated.includes(index)) {
            item.classList.add("eliminated");
        }

        item.innerHTML = `
            <div class="array-value">
                ${escapeHTML(String(value))}
            </div>

            <div class="array-index">
                index ${index}
            </div>
        `;

        arrayContainer.appendChild(item);

    });

}


/* =========================================================
   OPERATION UI
========================================================= */

/**
 * Updates the page according to the selected operation.
 */
function updateOperationUI() {

    const data =
        operationData[currentOperation];

    operationEyebrow.textContent =
        data.eyebrow;

    operationTitle.textContent =
        data.title;

    operationDescription.textContent =
        data.description;

    complexityBadge.textContent =
        data.complexity;

    explanationText.textContent =
        data.explanation;

    formulaBox.textContent =
        data.formula;

    renderOperationForm();

    resetOperation();

}


/**
 * Creates the input form for the selected operation.
 */
function renderOperationForm() {

    if (currentOperation === "address") {

        operationPanel.innerHTML = `

            <div class="operation-form">

                <div class="input-group">
                    <label for="baseAddress">
                        Base Address
                    </label>

                    <input
                        id="baseAddress"
                        type="number"
                        value="1000"
                        min="0"
                    >
                </div>

                <div class="input-group">
                    <label for="elementSize">
                        Element Size (bytes)
                    </label>

                    <input
                        id="elementSize"
                        type="number"
                        value="4"
                        min="1"
                    >
                </div>

                <div class="input-group">
                    <label for="addressIndex">
                        Array Index
                    </label>

                    <input
                        id="addressIndex"
                        type="number"
                        value="3"
                        min="0"
                    >
                </div>

            </div>

            <div class="info-note">
                Formula: Address(A[i]) =
                Base Address + (i × Element Size)
            </div>
        `;

        return;
    }


    if (currentOperation === "insert") {

        operationPanel.innerHTML = `

            <div class="operation-form">

                <div class="input-group">
                    <label for="insertValue">
                        Value
                    </label>

                    <input
                        id="insertValue"
                        type="number"
                        placeholder="Example: 25"
                    >
                </div>

                <div class="input-group">
                    <label for="insertIndex">
                        Position / Index
                    </label>

                    <input
                        id="insertIndex"
                        type="number"
                        min="0"
                        max="${array.length}"
                        placeholder="0 - ${array.length}"
                    >
                </div>

            </div>

            <div class="info-note">
                Elements at and after the selected position
                will shift one position to the right.
            </div>
        `;

        return;
    }


    if (currentOperation === "delete") {

        operationPanel.innerHTML = `

            <div class="operation-form">

                <div class="input-group">
                    <label for="deleteIndex">
                        Index to Delete
                    </label>

                    <input
                        id="deleteIndex"
                        type="number"
                        min="0"
                        max="${array.length - 1}"
                        placeholder="0 - ${array.length - 1}"
                    >
                </div>

            </div>

            <div class="info-note">
                Elements after the selected position
                will shift one position to the left.
            </div>
        `;

        return;
    }


    if (currentOperation === "linear") {

        operationPanel.innerHTML = `

            <div class="operation-form">

                <div class="input-group">
                    <label for="linearTarget">
                        Target Value
                    </label>

                    <input
                        id="linearTarget"
                        type="number"
                        placeholder="Example: 40"
                    >
                </div>

            </div>

            <div class="info-note">
                Linear search checks every element sequentially
                until the target is found.
            </div>
        `;

        return;
    }


    if (currentOperation === "binary") {

        operationPanel.innerHTML = `

            <div class="operation-form">

                <div class="input-group">
                    <label for="binaryTarget">
                        Target Value
                    </label>

                    <input
                        id="binaryTarget"
                        type="number"
                        placeholder="Example: 50"
                    >
                </div>

            </div>

            <div id="binaryArrayStatus"></div>
        `;

        updateBinaryArrayStatus();

    }

}


/**
 * Shows whether the current array is sorted.
 */
function updateBinaryArrayStatus() {

    const status =
        document.getElementById(
            "binaryArrayStatus"
        );

    if (!status) {
        return;
    }

    if (isSorted()) {

        status.innerHTML = `
            <div class="info-note success-note">
                ✓ Array is sorted. Binary search can be performed.
            </div>
        `;

    } else {

        status.innerHTML = `
            <div class="info-note warning-note">
                ⚠ Binary search requires a sorted array.
                <button
                    id="sortArrayBtn"
                    class="secondary-btn"
                    style="margin-left:8px;"
                >
                    Sort Array
                </button>
            </div>
        `;

        document
            .getElementById("sortArrayBtn")
            .addEventListener("click", sortArray);
    }

}


/**
 * Sorts the current array in ascending order.
 */
function sortArray() {

    array.sort((a, b) => a - b);

    arrayInput.value =
        array.join(",");

    renderArray();

    updateBinaryArrayStatus();

    addLog(
        "Array sorted in ascending order."
    );

}


/**
 * Checks whether the array is sorted.
 *
 * @returns {boolean}
 */
function isSorted() {

    for (let i = 1; i < array.length; i++) {

        if (array[i] < array[i - 1]) {
            return false;
        }

    }

    return true;
}


/* =========================================================
   SIMULATION CONTROL
========================================================= */

/**
 * Creates the steps for the selected operation
 * and begins playback.
 */
function runSimulation() {

    stopSimulation();

    clearLogs();

    hideResult();

    steps = createSteps();

    if (!steps.length) {
        return;
    }

    currentStep = 0;

    isRunning = true;

    setStatus(
        "running",
        "Running"
    );

    playCurrentStep();

}


/**
 * Executes the next simulation step.
 */
function nextStep() {

    if (!steps.length) {

        steps = createSteps();

        if (!steps.length) {
            return;
        }

        currentStep = 0;
    }

    stopSimulation();

    playCurrentStep();

}


/**
 * Automatically plays all remaining steps.
 */
function playCurrentStep() {

    if (currentStep >= steps.length) {

        finishSimulation();

        return;
    }

    const step =
        steps[currentStep];

    applyStep(step);

    currentStep++;

    if (isRunning) {

        animationTimer =
            setTimeout(
                playCurrentStep,
                Number(speedSlider.value)
            );
    }

}


/**
 * Stops automatic playback.
 */
function stopSimulation() {

    isRunning = false;

    if (animationTimer) {

        clearTimeout(animationTimer);

        animationTimer = null;
    }

}


/**
 * Completes the current simulation.
 */
function finishSimulation() {

    stopSimulation();

    setStatus(
        "success",
        "Completed"
    );

    showFinalResult();

}


/**
 * Resets only the selected operation.
 */
function resetOperation() {

    stopSimulation();

    steps = [];
    currentStep = 0;

    clearLogs();

    hideResult();

    setStatus(
        "idle",
        "Ready"
    );

    renderArray();

    updateOperationFormAfterReset();

    visualizationArea.innerHTML = `
        <div class="empty-visualization">
            <div class="empty-icon">▶</div>

            <h3>Ready to visualize</h3>

            <p>
                Configure an operation and start the simulation.
            </p>
        </div>
    `;

}


/**
 * Refreshes dynamic operation controls after reset.
 */
function updateOperationFormAfterReset() {

    if (currentOperation === "binary") {
        updateBinaryArrayStatus();
    }

}


/**
 * Updates the speed label.
 */
function updateSpeed() {

    speedValue.textContent =
        `${speedSlider.value}ms`;

}


/* =========================================================
   STEP GENERATION
========================================================= */

/**
 * Generates simulation steps for the current operation.
 *
 * @returns {Array}
 */
function createSteps() {

    switch (currentOperation) {

        case "address":
            return createAddressSteps();

        case "insert":
            return createInsertSteps();

        case "delete":
            return createDeleteSteps();

        case "linear":
            return createLinearSearchSteps();

        case "binary":
            return createBinarySearchSteps();

        default:
            return [];
    }

}


/**
 * Generates address calculation steps.
 *
 * @returns {Array}
 */
function createAddressSteps() {

    const base =
        Number(
            document.getElementById(
                "baseAddress"
            )?.value
        );

    const size =
        Number(
            document.getElementById(
                "elementSize"
            )?.value
        );

    const index =
        Number(
            document.getElementById(
                "addressIndex"
            )?.value
        );

    if (
        !Number.isFinite(base) ||
        !Number.isFinite(size) ||
        !Number.isFinite(index) ||
        size <= 0 ||
        index < 0 ||
        index >= array.length
    ) {

        showResult(
            "Invalid input",
            "Enter a valid base address, positive element size and a valid array index."
        );

        setStatus(
            "error",
            "Invalid input"
        );

        return [];
    }

    const offset =
        index * size;

    const address =
        base + offset;

    return [

        {
            type: "address",
            active: [index],
            base,
            size,
            index,
            offset,
            address,

            log:
                `Selected A[${index}] with value ${array[index]}.`
        },

        {
            type: "address",
            active: [index],
            base,
            size,
            index,
            offset,
            address,

            log:
                `Calculate offset: ${index} × ${size} = ${offset} bytes.`
        },

        {
            type: "address",
            active: [index],
            base,
            size,
            index,
            offset,
            address,

            log:
                `Final address: ${base} + ${offset} = ${address}.`,
            final: true
        }

    ];

}


/**
 * Generates insertion steps.
 *
 * @returns {Array}
 */
function createInsertSteps() {

    const value =
        Number(
            document.getElementById(
                "insertValue"
            )?.value
        );

    const index =
        Number(
            document.getElementById(
                "insertIndex"
            )?.value
        );

    if (!Number.isFinite(value)) {

        showResult(
            "Invalid value",
            "Enter a numeric value to insert."
        );

        return [];
    }

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index > array.length
    ) {

        showResult(
            "Invalid position",
            `Enter an index from 0 to ${array.length}.`
        );

        return [];
    }

    if (array.length >= 12) {

        showResult(
            "Array is full",
            "The maximum supported array size is 12."
        );

        return [];
    }

    const original =
        [...array];

    const newArray =
        [...array];

    const generatedSteps = [];

    generatedSteps.push({
        type: "insert",
        phase: "before",
        original,
        index,
        value,

        log:
            `Preparing to insert ${value} at index ${index}.`
    });

    for (
        let i = newArray.length;
        i > index;
        i--
    ) {

        newArray[i] =
            newArray[i - 1];

        generatedSteps.push({
            type: "insert",
            phase: "shift",
            displayArray: [...newArray],
            active: [i, i - 1],
            index,
            value,

            log:
                `Shift element from index ${i - 1} to index ${i}.`
        });
    }

    newArray[index] = value;

    generatedSteps.push({
        type: "insert",
        phase: "complete",
        displayArray: [...newArray],
        active: [index],
        index,
        value,

        log:
            `Insert ${value} at index ${index}.`,
        final: true,

        newArray
    });

    return generatedSteps;

}


/**
 * Generates deletion steps.
 *
 * @returns {Array}
 */
function createDeleteSteps() {

    const index =
        Number(
            document.getElementById(
                "deleteIndex"
            )?.value
        );

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= array.length
    ) {

        showResult(
            "Invalid index",
            `Enter an index from 0 to ${array.length - 1}.`
        );

        return [];
    }

    const original =
        [...array];

    const newArray =
        [...array];

    const deletedValue =
        newArray[index];

    const generatedSteps = [];

    generatedSteps.push({
        type: "delete",
        phase: "before",
        displayArray: [...newArray],
        active: [index],

        log:
            `Selected value ${deletedValue} at index ${index}.`
    });

    for (
        let i = index;
        i < newArray.length - 1;
        i++
    ) {

        newArray[i] =
            newArray[i + 1];

        generatedSteps.push({
            type: "delete",
            phase: "shift",
            displayArray: [...newArray],
            active: [i, i + 1],

            log:
                `Shift element from index ${i + 1} to index ${i}.`
        });
    }

    newArray.pop();

    generatedSteps.push({
        type: "delete",
        phase: "complete",
        displayArray: [...newArray],
        active: [],

        log:
            `Deleted ${deletedValue} from index ${index}.`,
        final: true,

        newArray
    });

    return generatedSteps;

}


/**
 * Generates linear search steps.
 *
 * @returns {Array}
 */
function createLinearSearchSteps() {

    const target =
        Number(
            document.getElementById(
                "linearTarget"
            )?.value
        );

    if (!Number.isFinite(target)) {

        showResult(
            "Invalid target",
            "Enter a numeric target value."
        );

        return [];
    }

    const generatedSteps = [];

    let comparisons = 0;

    let foundIndex = -1;

    for (
        let i = 0;
        i < array.length;
        i++
    ) {

        comparisons++;

        const found =
            array[i] === target;

        if (found) {
            foundIndex = i;
        }

        generatedSteps.push({

            type: "linear",

            active: [i],

            target,

            comparisons,

            foundIndex,

            found,

            log:
                found
                    ? `Compare A[${i}] = ${array[i]} with ${target}: MATCH.`
                    : `Compare A[${i}] = ${array[i]} with ${target}: not equal.`,

            final: found

        });

        if (found) {
            break;
        }

    }

    if (foundIndex === -1) {

        generatedSteps.push({

            type: "linear",

            active: [],

            target,

            comparisons,

            foundIndex: -1,

            found: false,

            log:
                `${target} was not found after ${comparisons} comparisons.`,

            final: true
        });

    }

    return generatedSteps;

}


/**
 * Generates binary search steps.
 *
 * @returns {Array}
 */
function createBinarySearchSteps() {

    const target =
        Number(
            document.getElementById(
                "binaryTarget"
            )?.value
        );

    if (!Number.isFinite(target)) {

        showResult(
            "Invalid target",
            "Enter a numeric target value."
        );

        return [];
    }

    if (!isSorted()) {

        showResult(
            "Array is not sorted",
            "Binary search requires a sorted array. Sort the array first."
        );

        setStatus(
            "warning",
            "Sort required"
        );

        return [];
    }

    const generatedSteps = [];

    let low = 0;
    let high = array.length - 1;

    let comparisons = 0;

    while (low <= high) {

        const mid =
            Math.floor(
                (low + high) / 2
            );

        comparisons++;

        const eliminated = [];

        for (let i = 0; i < low; i++) {
            eliminated.push(i);
        }

        for (
            let i = high + 1;
            i < array.length;
            i++
        ) {
            eliminated.push(i);
        }

        if (array[mid] === target) {

            generatedSteps.push({

                type: "binary",

                low,
                mid,
                high,

                target,

                comparisons,

                foundIndex: mid,

                eliminated,

                found: true,

                log:
                    `A[${mid}] = ${array[mid]} matches ${target}.`,

                final: true

            });

            return generatedSteps;
        }


        if (array[mid] < target) {

            generatedSteps.push({

                type: "binary",

                low,
                mid,
                high,

                target,

                comparisons,

                foundIndex: -1,

                eliminated,

                found: false,

                direction: "right",

                log:
                    `${array[mid]} < ${target}. Eliminate the left half.`

            });

            low = mid + 1;

        } else {

            generatedSteps.push({

                type: "binary",

                low,
                mid,
                high,

                target,

                comparisons,

                foundIndex: -1,

                eliminated,

                found: false,

                direction: "left",

                log:
                    `${array[mid]} > ${target}. Eliminate the right half.`

            });

            high = mid - 1;
        }

    }

    generatedSteps.push({

        type: "binary",

        low,
        mid: null,
        high,

        target,

        comparisons,

        foundIndex: -1,

        found: false,

        log:
            `${target} is not present in the array.`,

        final: true

    });

    return generatedSteps;

}


/* =========================================================
   STEP APPLICATION
========================================================= */

/**
 * Applies one visualization step.
 *
 * @param {Object} step - Current simulation step.
 */
function applyStep(step) {

    addLog(step.log);

    if (step.type === "address") {

        renderArray({
            active: step.active
        });

        renderAddressVisualization(step);

    }


    if (step.type === "insert") {

        const displayArray =
            step.displayArray ||
            step.original;

        renderTemporaryArray(
            displayArray,
            step.active
        );

        renderInsertVisualization(step);

    }


    if (step.type === "delete") {

        const displayArray =
            step.displayArray;

        renderTemporaryArray(
            displayArray,
            step.active
        );

        renderDeleteVisualization(step);

    }


    if (step.type === "linear") {

        renderArray({
            active: step.active,
            found:
                step.found
                    ? [step.foundIndex]
                    : []
        });

        renderSearchVisualization(
            step,
            "linear"
        );

    }


    if (step.type === "binary") {

        renderArray({
            low: step.low,
            mid: step.mid,
            high: step.high,
            found:
                step.found
                    ? [step.foundIndex]
                    : [],
            eliminated:
                step.eliminated
        });

        renderSearchVisualization(
            step,
            "binary"
        );

    }


    if (step.final) {

        if (step.newArray) {

            array =
                [...step.newArray];

            arrayInput.value =
                array.join(",");

            renderArray();

        }

        if (
            step.type === "linear" &&
            step.found
        ) {

            renderArray({
                found: [step.foundIndex]
            });

        }

        if (
            step.type === "binary" &&
            step.found
        ) {

            renderArray({
                found: [step.foundIndex]
            });

        }

    }

}


/* =========================================================
   VISUALIZATION RENDERING
========================================================= */

/**
 * Renders an address calculation.
 *
 * @param {Object} step - Address step.
 */
function renderAddressVisualization(step) {

    visualizationArea.innerHTML = `

        <div class="address-result">

            <div class="address-equation">

                Address(A[
                    <span class="highlight">
                        ${step.index}
                    </span>
                ])

                =

                <span class="highlight">
                    ${step.base}
                </span>

                +

                (

                <span class="highlight">
                    ${step.index}
                </span>

                ×

                <span class="highlight">
                    ${step.size}
                </span>

                )

            </div>

            <div class="address-final">
                ${step.base} +
                (${step.index} × ${step.size})
                =
                ${step.address}
            </div>

        </div>

    `;

}


/**
 * Renders insertion visualization.
 *
 * @param {Object} step - Insertion step.
 */
function renderInsertVisualization(step) {

    visualizationArea.innerHTML = `

        <div class="address-result">

            <div class="address-equation">

                ${
                    step.phase === "shift"
                        ? `Moving elements →`
                        : step.phase === "complete"
                            ? `Inserted ${step.value} ✓`
                            : `Preparing insertion`
                }

            </div>

            <div class="address-final">
                ${
                    step.phase === "shift"
                        ? `Making space at index ${step.index}`
                        : `Insertion position: ${step.index}`
                }
            </div>

        </div>

    `;

}


/**
 * Renders deletion visualization.
 *
 * @param {Object} step - Deletion step.
 */
function renderDeleteVisualization(step) {

    visualizationArea.innerHTML = `

        <div class="address-result">

            <div class="address-equation">

                ${
                    step.phase === "shift"
                        ? `Moving elements ←`
                        : step.phase === "complete"
                            ? `Deletion complete ✓`
                            : `Preparing deletion`
                }

            </div>

            <div class="address-final">
                ${
                    step.phase === "shift"
                        ? "Shifting elements left to fill the gap."
                        : "Selected element will be removed."
                }
            </div>

        </div>

    `;

}


/**
 * Displays search-specific information.
 *
 * @param {Object} step - Search step.
 * @param {string} algorithm - Search algorithm.
 */
function renderSearchVisualization(
    step,
    algorithm
) {

    const label =
        algorithm === "linear"
            ? "Linear Search"
            : "Binary Search";

    let extra = "";

    if (algorithm === "binary") {

        extra = `

            <div class="search-info">

                <div class="search-stat">
                    <span>Low</span>
                    <strong>
                        ${step.low ?? "—"}
                    </strong>
                </div>

                <div class="search-stat">
                    <span>Mid</span>
                    <strong>
                        ${step.mid ?? "—"}
                    </strong>
                </div>

                <div class="search-stat">
                    <span>High</span>
                    <strong>
                        ${step.high ?? "—"}
                    </strong>
                </div>

                <div class="search-stat">
                    <span>Comparisons</span>
                    <strong>
                        ${step.comparisons}
                    </strong>
                </div>

            </div>
        `;

    } else {

        extra = `

            <div class="search-info">

                <div class="search-stat">
                    <span>Target</span>
                    <strong>
                        ${step.target}
                    </strong>
                </div>

                <div class="search-stat">
                    <span>Comparisons</span>
                    <strong>
                        ${step.comparisons}
                    </strong>
                </div>

                <div class="search-stat">
                    <span>Index</span>
                    <strong>
                        ${
                            step.foundIndex >= 0
                                ? step.foundIndex
                                : "—"
                        }
                    </strong>
                </div>

            </div>
        `;
    }

    visualizationArea.innerHTML = `

        <div class="binary-info">

            <div class="address-result">

                <div class="address-equation">

                    ${label}

                </div>

                <div class="address-final">

                    ${
                        step.found
                            ? `✓ Target ${step.target} found.`
                            : step.log
                    }

                </div>

            </div>

            ${extra}

        </div>
    `;

}


/**
 * Temporarily renders an array used by an operation.
 *
 * @param {Array} values - Values to display.
 * @param {Array} active - Active indices.
 */
function renderTemporaryArray(
    values,
    active = []
) {

    arrayContainer.innerHTML = "";

    values.forEach((value, index) => {

        const item =
            document.createElement("div");

        item.className =
            "array-item";

        if (active.includes(index)) {
            item.classList.add("active");
        }

        item.innerHTML = `
            <div class="array-value">
                ${escapeHTML(String(value))}
            </div>

            <div class="array-index">
                index ${index}
            </div>
        `;

        arrayContainer.appendChild(item);

    });

}


/* =========================================================
   LOGGING
========================================================= */

/**
 * Adds an item to the step log.
 *
 * @param {string} message - Log message.
 */
function addLog(message) {

    if (!message) {
        return;
    }

    const empty =
        stepLog.querySelector(".log-empty");

    if (empty) {
        empty.remove();
    }

    const number =
        stepLog.children.length + 1;

    const item =
        document.createElement("div");

    item.className =
        "log-item";

    item.innerHTML = `

        <div class="log-number">
            ${number}
        </div>

        <div>
            ${escapeHTML(message)}
        </div>
    `;

    stepLog.appendChild(item);

    stepLog.scrollTop =
        stepLog.scrollHeight;

    stepCounter.textContent =
        `${number} step${number === 1 ? "" : "s"}`;

}


/**
 * Clears the execution log.
 */
function clearLogs() {

    stepLog.innerHTML = `
        <div class="log-empty">
            No steps executed yet.
        </div>
    `;

    stepCounter.textContent =
        "0 steps";

}


/* =========================================================
   RESULT HANDLING
========================================================= */

/**
 * Displays an operation result.
 *
 * @param {string} title - Result title.
 * @param {string} text - Result description.
 */
function showResult(title, text) {

    resultCard.classList.remove("hidden");

    resultTitle.textContent =
        title;

    resultText.textContent =
        text;

}


/**
 * Hides the result card.
 */
function hideResult() {

    resultCard.classList.add("hidden");

}


/**
 * Creates a final result based on the
 * completed simulation.
 */
function showFinalResult() {

    if (!steps.length) {
        return;
    }

    const lastStep =
        steps[steps.length - 1];

    if (currentOperation === "address") {

        showResult(
            "Address calculated",
            `A[${lastStep.index}] is stored at memory address ${lastStep.address}.`
        );

        return;
    }


    if (currentOperation === "insert") {

        showResult(
            "Insertion completed",
            `Value ${lastStep.value} was inserted at index ${lastStep.index}.`
        );

        return;
    }


    if (currentOperation === "delete") {

        showResult(
            "Deletion completed",
            "The selected element was removed and remaining elements shifted left."
        );

        return;
    }


    if (
        currentOperation === "linear" ||
        currentOperation === "binary"
    ) {

        if (lastStep.found) {

            showResult(
                "Value found",
                `Target ${lastStep.target} was found at index ${lastStep.foundIndex} after ${lastStep.comparisons} comparison${lastStep.comparisons === 1 ? "" : "s"}.`
            );

        } else {

            showResult(
                "Value not found",
                `Target ${lastStep.target} was not found after ${lastStep.comparisons} comparison${lastStep.comparisons === 1 ? "" : "s"}.`
            );

        }

    }

}


/* =========================================================
   STATUS
========================================================= */

/**
 * Updates the execution status pill.
 *
 * @param {string} type - Status class.
 * @param {string} text - Status text.
 */
function setStatus(type, text) {

    executionStatus.className =
        `status-pill ${type}`;

    executionStatus.textContent =
        text;

}


/* =========================================================
   ERROR HANDLING
========================================================= */

/**
 * Shows an array input error.
 *
 * @param {string} message - Error message.
 */
function showArrayError(message) {

    arrayError.textContent =
        message;

    arrayError.classList.add("show");

}


/**
 * Clears the array input error.
 */
function clearArrayError() {

    arrayError.textContent = "";

    arrayError.classList.remove("show");

}


/* =========================================================
   SECURITY / TEXT SAFETY
========================================================= */

/**
 * Escapes text before inserting it into HTML.
 *
 * @param {string} value - Text to escape.
 * @returns {string}
 */
function escapeHTML(value) {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}