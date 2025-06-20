let sizeSlider = document.getElementById('size-slider');
let speedSlider = document.getElementById('speed-slider');
let sizeValue = document.getElementById('size-value');
let speedValue = document.getElementById('speed-value');
let generateBtn = document.getElementById('generate');
let startBtn = document.getElementById('start');
let pauseBtn = document.getElementById('pause');
let resetBtn = document.getElementById('reset');
let useCustomBtn = document.getElementById('use-custom');
let customArrayInput = document.getElementById('custom-array');
let indexRow = document.getElementById('index-row');
let valueRow = document.getElementById('value-row');
let comparisons = 0;
let swaps = 0;
let isPaused = false;
let isSorting = false;
let isCustomArray = false;
let currentArray = [];
let originalArray = [];

// Algorithm descriptions
const algoDescriptions = {
  bubble: 'Bubble Sort is a simple comparison-based algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Time Complexity: O(n²).',
  selection: 'Selection Sort divides the array into a sorted and unsorted region. It repeatedly selects the smallest (or largest) element from the unsorted region and moves it to the end of the sorted region. Time Complexity: O(n²).',
  insertion: 'Insertion Sort builds the sorted array one item at a time by repeatedly picking the next element and inserting it into its correct position. Time Complexity: O(n²).',
  merge: 'Merge Sort is a divide-and-conquer algorithm that divides the array into halves, sorts them recursively, and then merges the sorted halves. Time Complexity: O(n log n).',
  quick: 'Quick Sort is a divide-and-conquer algorithm that picks a pivot, partitions the array around the pivot, and recursively sorts the partitions. Time Complexity: O(n log n) on average.',
  heap: 'Heap Sort builds a heap from the array and repeatedly extracts the maximum element to get a sorted array. Time Complexity: O(n log n).',
  jump: 'Jump Sort is a searching algorithm, not a sorting one. If used for sorting, it is not standard. Here, it is likely a custom or illustrative implementation.',
  count: 'Count Sort (Counting Sort) is a non-comparison-based sorting algorithm suitable for small integer keys. It counts the occurrences of each value and calculates positions. Time Complexity: O(n + k).'
};

// Algorithm code snippets
const algoCodeSnippets = {
  bubble: [
    'for (let i = 0; i < n - 1; i++) {',
    '  for (let j = 0; j < n - i - 1; j++) {',
    '    if (arr[j] > arr[j + 1]) {',
    '      swap(arr, j, j + 1);',
    '    }',
    '  }',
    '}',
  ],
  selection: [
    'for (let i = 0; i < n; i++) {',
    '  let minIdx = i;',
    '  for (let j = i + 1; j < n; j++) {',
    '    if (arr[j] < arr[minIdx]) {',
    '      minIdx = j;',
    '    }',
    '  }',
    '  swap(arr, i, minIdx);',
    '}',
  ],
  insertion: [
    'for (let i = 1; i < n; i++) {',
    '  let key = arr[i];',
    '  let j = i - 1;',
    '  while (j >= 0 && arr[j] > key) {',
    '    arr[j + 1] = arr[j];',
    '    j--;',
    '  }',
    '  arr[j + 1] = key;',
    '}',
  ],
  merge: [
    'function mergeSort(arr) {',
    '  if (arr.length <= 1) return arr;',
    '  let mid = Math.floor(arr.length / 2);',
    '  let left = mergeSort(arr.slice(0, mid));',
    '  let right = mergeSort(arr.slice(mid));',
    '  return merge(left, right);',
    '}',
    'function merge(left, right) {',
    '  // ...',
    '}',
  ],
  quick: [
    'function quickSort(arr, low, high) {',
    '  if (low < high) {',
    '    let pi = partition(arr, low, high);',
    '    quickSort(arr, low, pi - 1);',
    '    quickSort(arr, pi + 1, high);',
    '  }',
    '}',
    'function partition(arr, low, high) {',
    '  // ...',
    '}',
  ],
  heap: [
    'function heapSort(arr) {',
    '  buildMaxHeap(arr);',
    '  for (let i = n - 1; i > 0; i--) {',
    '    swap(arr, 0, i);',
    '    heapify(arr, 0, i);',
    '  }',
    '}',
    'function heapify(arr, i, n) {',
    '  // ...',
    '}',
  ],
  jump: [
    '// Jump Sort is not standard for sorting, so this is illustrative',
    'let step = Math.floor(Math.sqrt(n));',
    'for (let i = 0; i < n; i += step) {',
    '  // ...',
    '}',
  ],
  count: [
    'function countSort(arr) {',
    '  let count = [];',
    '  for (let i = 0; i < arr.length; i++) {',
    '    count[arr[i]]++;',
    '  }',
    '  // ...',
    '}',
  ],
};

const quickSortCode = [
  'function quickSort(arr, low, high) {',
  '  if (low < high) {',
  '    let pi = partition(arr, low, high);',
  '    quickSort(arr, low, pi - 1);',
  '    quickSort(arr, pi + 1, high);',
  '  }',
  '}',
];
const partitionCode = [
  'function partition(arr, low, high) {',
  '  let pivot = arr[high];',
  '  let i = low - 1;',
  '  for (let j = low; j < high; j++) {',
  '    if (arr[j] < pivot) {',
  '      i++;',
  '      swap(arr, i, j);',
  '    }',
  '  }',
  '  swap(arr, i + 1, high);',
  '  return i + 1;',
  '}',
];

const mergeSortCode = [
  'function mergeSort(arr) {',
  '  if (arr.length <= 1) return arr;',
  '  let mid = Math.floor(arr.length / 2);',
  '  let left = mergeSort(arr.slice(0, mid));',
  '  let right = mergeSort(arr.slice(mid));',
  '  return merge(left, right);',
  '}',
];
const mergeCode = [
  'function merge(left, right) {',
  '  let result = [];',
  '  let i = 0, j = 0;',
  '  while (i < left.length && j < right.length) {',
  '    if (left[i] <= right[j]) {',
  '      result.push(left[i++]);',
  '    } else {',
  '      result.push(right[j++]);',
  '    }',
  '  }',
  '  return result.concat(left.slice(i)).concat(right.slice(j));',
  '}',
];

const countSortCode = [
  'function countSort(arr) {',
  '  let max = Math.max(...arr);',
  '  let count = new Array(max + 1).fill(0);',
  '  for (let num of arr) count[num]++;',
  '  let idx = 0;',
  '  for (let i = 0; i < count.length; i++) {',
  '    while (count[i]-- > 0) {',
  '      arr[idx++] = i;',
  '    }',
  '  }',
  '}',
];

const heapSortCode = [
  'function heapSort(arr) {',
  '  buildMaxHeap(arr);',
  '  for (let i = n - 1; i > 0; i--) {',
  '    swap(arr, 0, i);',
  '    heapify(arr, 0, i);',
  '  }',
  '}',
];
const heapifyCode = [
  'function heapify(arr, i, n) {',
  '  let largest = i;',
  '  let l = 2 * i + 1;',
  '  let r = 2 * i + 2;',
  '  if (l < n && arr[l] > arr[largest]) largest = l;',
  '  if (r < n && arr[r] > arr[largest]) largest = r;',
  '  if (largest !== i) {',
  '    swap(arr, i, largest);',
  '    heapify(arr, largest, n);',
  '  }',
  '}',
];


const jumpSortCode = [
  'function jumpSort(arr) {',
  '  let n = arr.length;',
  '  let step = Math.floor(Math.sqrt(n));',
  '  for (let i = 0; i < n; i++) {',
  '    let j = i;',
  '    while (j >= step && arr[j] < arr[j - step]) {',
  '      swap(arr, j, j - step);',
  '      j -= step;',
  '    }',
  '  }',
  '}',
];

function updateAlgoDescription(algo) {
  const descDiv = document.getElementById('algo-description');
  descDiv.textContent = algoDescriptions[algo] || '';
}

function renderOriginalArray(arr) {
  let row = document.getElementById("original-array-row");
  row.innerHTML = "";
  arr.forEach((val) => {
    let box = document.createElement("div");
    box.className = "value-box";
    box.innerText = val;
    row.appendChild(box);
  });
}

function renderArray(arr) {
  indexRow.innerHTML = '';
  valueRow.innerHTML = '';
  currentArray = arr;
  originalArray = [...arr];
  renderOriginalArray(originalArray);

  arr.forEach((val, idx) => {
    let indexBox = document.createElement('div');
    indexBox.className = 'index-box';
    indexBox.innerText = idx;

    let valueBox = document.createElement('div');
    valueBox.className = 'value-box';
    valueBox.innerText = val;

    indexRow.appendChild(indexBox);
    valueRow.appendChild(valueBox);
  });
}

function updateStats(c = 0, s = 0) {
  comparisons += c;
  swaps += s;
  document.getElementById('comparisons').innerText = comparisons;
  document.getElementById('swaps').innerText = swaps;
}

function getValues() {
  return Array.from(valueRow.children).map(box => parseInt(box.innerText));
}

function highlight(i, j) {
  valueRow.children[i].classList.add('active');
  valueRow.children[j].classList.add('active');
}

function unhighlight(i, j) {
  valueRow.children[i].classList.remove('active');
  valueRow.children[j].classList.remove('active');
}

function markSorted(i) {
  valueRow.children[i].classList.add('sorted');
}

async function swap(i, j, speed) {
  highlight(i, j);
  await sleep(speed);
  let temp = valueRow.children[i].innerText;
  valueRow.children[i].innerText = valueRow.children[j].innerText;
  valueRow.children[j].innerText = temp;
  updateStats(0, 1);
  await sleep(speed);
  unhighlight(i, j);
}

async function sleep(ms) {
  if (isPaused) {
    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (!isPaused) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createRandomArray(size) {
  let arr = [];
  for (let i = 0; i < size; i++) arr.push(Math.floor(Math.random() * 100));
  return arr;
}

// Bubble Sort
async function bubbleSort(speed) {
  let n = currentArray.length;
  for (let i = 0; i < n - 1; i++) {
    renderAlgoCode(getCurrentAlgo(), 0);
    for (let j = 0; j < n - i - 1; j++) {
      renderAlgoCode(getCurrentAlgo(), 1);
      highlight(j, j + 1);
      renderAlgoCode(getCurrentAlgo(), 2);
      updateStats(1, 0);
      await sleep(speed);
      if (parseInt(valueRow.children[j].innerText) > parseInt(valueRow.children[j + 1].innerText)) {
        renderAlgoCode(getCurrentAlgo(), 3);
        await swap(j, j + 1, speed);
      } else {
        unhighlight(j, j + 1);
      }
      renderAlgoCode(getCurrentAlgo(), 1);
    }
    renderAlgoCode(getCurrentAlgo(), 0);
    markSorted(n - i - 1);
  }
  renderAlgoCode(getCurrentAlgo(), 6);
  markSorted(0);
}

// Selection Sort
async function selectionSort(speed) {
  let n = currentArray.length;
  for (let i = 0; i < n; i++) {
    renderAlgoCode(getCurrentAlgo(), 0);
    let minIdx = i;
    renderAlgoCode(getCurrentAlgo(), 1);
    for (let j = i + 1; j < n; j++) {
      renderAlgoCode(getCurrentAlgo(), 2);
      highlight(minIdx, j);
      renderAlgoCode(getCurrentAlgo(), 3);
      updateStats(1, 0);
      await sleep(speed);
      if (!isSorting) return;
      if (parseInt(valueRow.children[j].innerText) < parseInt(valueRow.children[minIdx].innerText)) {
        renderAlgoCode(getCurrentAlgo(), 4);
        unhighlight(minIdx, j);
        minIdx = j;
        highlight(i, minIdx);
        renderAlgoCode(getCurrentAlgo(), 5);
      }
      unhighlight(minIdx, j);
    }
    if (minIdx !== i) {
      renderAlgoCode(getCurrentAlgo(), 7);
      await swap(i, minIdx, speed);
    }
    markSorted(i);
    renderAlgoCode(getCurrentAlgo(), 8);
    if (!isSorting) return;
  }
}

// Insertion Sort
async function insertionSort(speed) {
  let n = currentArray.length;
  for (let i = 1; i < n; i++) {
    renderAlgoCode(getCurrentAlgo(), 0);
    let key = parseInt(valueRow.children[i].innerText);
    renderAlgoCode(getCurrentAlgo(), 1);
    let j = i - 1;
    renderAlgoCode(getCurrentAlgo(), 2);
    while (j >= 0 && parseInt(valueRow.children[j].innerText) > key) {
      highlight(j, j + 1);
      updateStats(1, 0);
      renderAlgoCode(getCurrentAlgo(), 3);
      valueRow.children[j + 1].innerText = valueRow.children[j].innerText;
      updateStats(0, 1);
      await sleep(speed);
      renderAlgoCode(getCurrentAlgo(), 4);
      j--;
      renderAlgoCode(getCurrentAlgo(), 5);
      unhighlight(j + 1, j + 2);
      if (!isSorting) return;
    }
    if (j >= 0) updateStats(1, 0);
    renderAlgoCode(getCurrentAlgo(), 7);
    valueRow.children[j + 1].innerText = key;
    updateStats(0, 1);
    await sleep(speed / 2);
    markSorted(j + 1);
    if (!isSorting) return;
  }
  for (let i = 0; i < n; i++) markSorted(i);
}

// Merge Sort
async function mergeSort(speed) {
  let arr = getValues();
  await mergeSortHelper(arr, 0, arr.length - 1, speed);
  for (let i = 0; i < arr.length; i++) markSorted(i);
}

async function mergeSortHelper(arr, left, right, speed) {
  renderAlgoCode(getCurrentAlgo(), 0, 'mergeSort');
  if (left >= right) {
    renderAlgoCode(getCurrentAlgo(), 1, 'mergeSort');
    return;
  }
  const mid = Math.floor((left + right) / 2);
  renderAlgoCode(getCurrentAlgo(), 2, 'mergeSort');
  await sleep(speed);
  renderAlgoCode(getCurrentAlgo(), 3, 'mergeSort');
  await mergeSortHelper(arr, left, mid, speed);
  renderAlgoCode(getCurrentAlgo(), 4, 'mergeSort');
  await mergeSortHelper(arr, mid + 1, right, speed);
  renderAlgoCode(getCurrentAlgo(), 5, 'mergeSort');
  await merge(arr, left, mid, right, speed);
  if (!isSorting) return;
}

async function merge(arr, left, mid, right, speed) {
  renderAlgoCode(getCurrentAlgo(), 0, 'merge');
  let n1 = mid - left + 1;
  let n2 = right - mid;
  let L = arr.slice(left, mid + 1);
  let R = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;
  renderAlgoCode(getCurrentAlgo(), 3, 'merge');
  while (i < n1 && j < n2) {
    highlight(k, k);
    updateStats(1, 0);
    renderAlgoCode(getCurrentAlgo(), 4, 'merge');
    await sleep(speed);
    if (!isSorting) return;
    if (L[i] <= R[j]) {
      renderAlgoCode(getCurrentAlgo(), 5, 'merge');
      arr[k] = L[i];
      valueRow.children[k].innerText = L[i];
      updateStats(0, 1);
      i++;
    } else {
      renderAlgoCode(getCurrentAlgo(), 7, 'merge');
      arr[k] = R[j];
      valueRow.children[k].innerText = R[j];
      updateStats(0, 1);
      j++;
    }
    unhighlight(k, k);
    k++;
  }
  while (i < n1) {
    renderAlgoCode(getCurrentAlgo(), 10, 'merge');
    arr[k] = L[i];
    valueRow.children[k].innerText = L[i];
    updateStats(0, 1);
    i++; k++;
    await sleep(speed / 2);
  }
  while (j < n2) {
    renderAlgoCode(getCurrentAlgo(), 10, 'merge');
    arr[k] = R[j];
    valueRow.children[k].innerText = R[j];
    updateStats(0, 1);
    j++; k++;
    await sleep(speed / 2);
  }
}

// Quick Sort
async function quickSort(speed) {
  await quickSortHelper(0, currentArray.length - 1, speed);
}

async function quickSortHelper(low, high, speed) {
  renderAlgoCode(getCurrentAlgo(), 0, 'quick');
  if (low < high) {
    renderAlgoCode(getCurrentAlgo(), 1, 'quick');
    let pi = await partition(low, high, speed);
    renderAlgoCode(getCurrentAlgo(), 2, 'quick');
    await sleep(speed);
    renderAlgoCode(getCurrentAlgo(), 3, 'quick');
    await quickSortHelper(low, pi - 1, speed);
    renderAlgoCode(getCurrentAlgo(), 4, 'quick');
    await quickSortHelper(pi + 1, high, speed);
    if (!isSorting) return;
  } else {
    renderAlgoCode(getCurrentAlgo(), 1, 'quick');
    await sleep(speed / 2);
    if (low === high && low >= 0 && valueRow.children[low]) {
      markSorted(low);
    }
  }
}

async function partition(low, high, speed) {
  renderAlgoCode(getCurrentAlgo(), 0, 'partition');
  let pivot = parseInt(valueRow.children[high].innerText);
  renderAlgoCode(getCurrentAlgo(), 1, 'partition');
  let i = low - 1;
  renderAlgoCode(getCurrentAlgo(), 2, 'partition');
  for (let j = low; j < high; j++) {
    highlight(j, high);
    renderAlgoCode(getCurrentAlgo(), 3, 'partition');
    updateStats(1, 0);
    await sleep(speed);
    if (!isSorting) return;
    if (parseInt(valueRow.children[j].innerText) < pivot) {
      i++;
      renderAlgoCode(getCurrentAlgo(), 4, 'partition');
      renderAlgoCode(getCurrentAlgo(), 5, 'partition');
      renderAlgoCode(getCurrentAlgo(), 6, 'partition');
      await swap(i, j, speed);
    }
    unhighlight(j, high);
  }
  renderAlgoCode(getCurrentAlgo(), 8, 'partition');
  await swap(i + 1, high, speed);
  renderAlgoCode(getCurrentAlgo(), 9, 'partition');
  markSorted(i + 1);
  return i + 1;
}

// Heap Sort
async function heapSort(speed) {
  let n = currentArray.length;
  renderAlgoCode(getCurrentAlgo(), 0, 'heap');
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    renderAlgoCode(getCurrentAlgo(), 1, 'heap');
    await heapify(n, i, speed);
    if (!isSorting) return;
  }
  for (let i = n - 1; i > 0; i--) {
    renderAlgoCode(getCurrentAlgo(), 2, 'heap');
    await swap(0, i, speed);
    renderAlgoCode(getCurrentAlgo(), 3, 'heap');
    await heapify(i, 0, speed);
    if (!isSorting) return;
  }
  for (let i = 0; i < n; i++) markSorted(i);
}

async function heapify(n, i, speed) {
  renderAlgoCode(getCurrentAlgo(), 0, 'heapify');
  let largest = i;
  renderAlgoCode(getCurrentAlgo(), 1, 'heapify');
  let l = 2 * i + 1;
  renderAlgoCode(getCurrentAlgo(), 2, 'heapify');
  let r = 2 * i + 2;
  renderAlgoCode(getCurrentAlgo(), 3, 'heapify');
  if (l < n) {
    highlight(i, l);
    updateStats(1, 0);
    if (parseInt(valueRow.children[l].innerText) > parseInt(valueRow.children[largest].innerText)) {
      renderAlgoCode(getCurrentAlgo(), 4, 'heapify');
      largest = l;
    }
    unhighlight(i, l);
  }
  if (r < n) {
    highlight(i, r);
    updateStats(1, 0);
    if (parseInt(valueRow.children[r].innerText) > parseInt(valueRow.children[largest].innerText)) {
      renderAlgoCode(getCurrentAlgo(), 5, 'heapify');
      largest = r;
    }
    unhighlight(i, r);
  }
  if (largest !== i) {
    renderAlgoCode(getCurrentAlgo(), 6, 'heapify');
    await swap(i, largest, speed);
    renderAlgoCode(getCurrentAlgo(), 7, 'heapify');
    await heapify(n, largest, speed);
    if (!isSorting) return;
  }
}

// Jump Sort
async function jumpSort(speed) {
  renderAlgoCode(getCurrentAlgo(), 0, 'jump');
  let n = currentArray.length;
  renderAlgoCode(getCurrentAlgo(), 1, 'jump');
  let step = Math.floor(Math.sqrt(n));
  renderAlgoCode(getCurrentAlgo(), 2, 'jump');
  for (let i = 0; i < n; i++) {
    renderAlgoCode(getCurrentAlgo(), 3, 'jump');
    let j = i;
    renderAlgoCode(getCurrentAlgo(), 4, 'jump');
    while (j >= step && parseInt(valueRow.children[j].innerText) < parseInt(valueRow.children[j - step].innerText)) {
      highlight(j, j - step);
      updateStats(1, 0);
      renderAlgoCode(getCurrentAlgo(), 5, 'jump');
      await swap(j, j - step, speed);
      renderAlgoCode(getCurrentAlgo(), 6, 'jump');
      j -= step;
      if (!isSorting) return;
      unhighlight(j, j + step);
    }
  }
  for (let i = 0; i < n; i++) markSorted(i);
}

// Count Sort
async function countSort(speed) {
  renderAlgoCode(getCurrentAlgo(), 0, 'count');
  let arr = getValues();
  renderAlgoCode(getCurrentAlgo(), 1, 'count');
  let max = Math.max(...arr);
  renderAlgoCode(getCurrentAlgo(), 2, 'count');
  let count = new Array(max + 1).fill(0);
  renderAlgoCode(getCurrentAlgo(), 3, 'count');
  for (let num of arr) count[num]++;
  renderAlgoCode(getCurrentAlgo(), 4, 'count');
  let idx = 0;
  renderAlgoCode(getCurrentAlgo(), 5, 'count');
  for (let i = 0; i < count.length; i++) {
    renderAlgoCode(getCurrentAlgo(), 6, 'count');
    while (count[i]-- > 0) {
      renderAlgoCode(getCurrentAlgo(), 7, 'count');
      highlight(idx, idx);
      await sleep(speed);
      if (!isSorting) return;
      valueRow.children[idx].innerText = i;
      unhighlight(idx, idx);
      markSorted(idx);
      updateStats(0, 1);
      idx++;
    }
  }
}

// Event Listeners
useCustomBtn.onclick = () => {
  const numbers = customArrayInput.value.split(',')
    .map(num => parseInt(num.trim()))
    .filter(num => !isNaN(num));

  if (numbers.length === 0) {
    alert('Please enter valid numbers separated by commas');
    return;
  }
  if (numbers.length > 100) {
    alert('Maximum array size is 100 elements');
    return;
  }

  isCustomArray = true;
  renderArray(numbers);
  comparisons = 0;
  swaps = 0;
  updateStats(0, 0);
};

pauseBtn.onclick = () => {
  if (!isSorting) return;
  isPaused = !isPaused;
  pauseBtn.innerText = isPaused ? '▶ Resume' : '⏸ Pause';
};

resetBtn.onclick = () => {
  isPaused = false;
  isSorting = false;
  pauseBtn.innerText = '⏸ Pause';
  if (isCustomArray) {
    const numbers = customArrayInput.value.split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));
    renderArray(numbers);
  } else {
    renderArray(createRandomArray(sizeSlider.value));
  }
  comparisons = 0;
  swaps = 0;
  updateStats(0, 0);
  renderAlgoCode(getCurrentAlgo());
};

generateBtn.onclick = () => {
  isCustomArray = false;
  renderArray(createRandomArray(sizeSlider.value));
  comparisons = 0;
  swaps = 0;
  updateStats(0, 0);
};

sizeSlider.oninput = () => {
  sizeValue.textContent = sizeSlider.value;
  if (!isCustomArray) {
    renderArray(createRandomArray(sizeSlider.value));
  }
};

speedSlider.oninput = () => {
  speedValue.textContent = (speedSlider.value / 100).toFixed(1) + 'x';
};

startBtn.onclick = async () => {
  if (isSorting) return;
  isSorting = true;
  isPaused = false;
  pauseBtn.innerText = '⏸ Pause';

  let algo = document.getElementById('algo-select').value;
  let rawSpeed = parseInt(speedSlider.value);
  let normalized = rawSpeed / 100;
  let inverse = 1 / Math.max(normalized, 0.01);
  let speed = inverse * 200; 
  comparisons = 0;
  swaps = 0;
  updateStats(0, 0);
  showComplexity(algo);

  if (algo === 'bubble') await bubbleSort(speed);
  else if (algo === 'selection') await selectionSort(speed);
  else if (algo === 'insertion') await insertionSort(speed);
  else if (algo === 'merge') await mergeSort(speed);
  else if (algo === 'quick') await quickSort(speed);
  else if (algo === 'heap') await heapSort(speed);
  else if (algo === 'jump') await jumpSort(speed);
  else if (algo === 'count') await countSort(speed);
  else alert("This sorting algorithm is not implemented.");

  isSorting = false;
  isPaused = false;
  pauseBtn.innerText = '⏸ Pause';
};

function showComplexity(algo) {
  const time = document.getElementById('time');
  const space = document.getElementById('space');
  const complexities = {
    bubble: ['O(n²)', 'O(1)'],
    selection: ['O(n²)', 'O(1)'],
    insertion: ['O(n²)', 'O(1)'],
    merge: ['O(n log n)', 'O(n)'],
    quick: ['O(n log n)', 'O(log n)'],
    heap: ['O(n log n)', 'O(1)'],
    jump: ['O(n√n)', 'O(1)'],
    count: ['O(n + k)', 'O(k)']
  };
  time.innerText = complexities[algo][0];
  space.innerText = complexities[algo][1];
}

window.onload = () => {
  sizeValue.textContent = sizeSlider.value;
  speedValue.textContent = (speedSlider.value / 100).toFixed(1) + 'x';
  renderArray(createRandomArray(sizeSlider.value));
};

window.addEventListener('DOMContentLoaded', () => {
  const algoSelect = document.getElementById('algo-select');
  updateAlgoDescription(algoSelect.value);
  algoSelect.addEventListener('change', (e) => {
    updateAlgoDescription(e.target.value);
  });
});

function renderAlgoCode(algo, highlightLine = -1, codeType = null) {
  const codeDiv = document.getElementById('algo-code');
  let codeLines = [];
  if (algo === 'quick' && codeType === 'partition') {
    codeLines = partitionCode;
  } else if (algo === 'quick') {
    codeLines = quickSortCode;
  } else if (algo === 'merge' && codeType === 'merge') {
    codeLines = mergeCode;
  } else if (algo === 'merge') {
    codeLines = mergeSortCode;
  } else if (algo === 'count') {
    codeLines = countSortCode;
  } else if (algo === 'heap' && codeType === 'heapify') {
    codeLines = heapifyCode;
  } else if (algo === 'heap') {
    codeLines = heapSortCode;
  } else if (algo === 'jump') {
    codeLines = jumpSortCode;
  } else {
    codeLines = algoCodeSnippets[algo] || [];
  }
  codeDiv.innerHTML = codeLines
    .map((line, idx) => `<span class="code-line${idx === highlightLine ? ' highlight' : ''}">${line}</span>`)
    .join('');
}

// Update code display on algorithm change
window.addEventListener('DOMContentLoaded', () => {
  const algoSelect = document.getElementById('algo-select');
  renderAlgoCode(algoSelect.value);
  algoSelect.addEventListener('change', (e) => {
    renderAlgoCode(e.target.value);
  });
});

// Helper to get current algorithm
function getCurrentAlgo() {
  return document.getElementById('algo-select').value;
}
