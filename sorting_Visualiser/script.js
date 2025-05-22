
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
    for (let j = 0; j < n - i - 1; j++) {
      highlight(j, j + 1);
      updateStats(1, 0);
      await sleep(speed);
      if (parseInt(valueRow.children[j].innerText) > parseInt(valueRow.children[j + 1].innerText)) {
        await swap(j, j + 1, speed);
      } else {
        unhighlight(j, j + 1);
      }
    }
    markSorted(n - i - 1);
  }
  markSorted(0);
}

// Selection Sort
async function selectionSort(speed) {
  let n = currentArray.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      highlight(minIdx, j);
      updateStats(1, 0);
      await sleep(speed);
      if (parseInt(valueRow.children[j].innerText) < parseInt(valueRow.children[minIdx].innerText)) {
        unhighlight(minIdx, j);
        minIdx = j;
        highlight(i, minIdx);
      }
      unhighlight(minIdx, j);
    }
    if (minIdx !== i) await swap(i, minIdx, speed);
    markSorted(i);
  }
}

// Insertion Sort
async function insertionSort(speed) {
  let n = currentArray.length;
  for (let i = 1; i < n; i++) {
    let key = parseInt(valueRow.children[i].innerText);
    let j = i - 1;
    while (j >= 0 && parseInt(valueRow.children[j].innerText) > key) {
      await swap(j, j + 1, speed);
      updateStats(1, 1);
      j--;
    }
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
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSortHelper(arr, left, mid, speed);
  await mergeSortHelper(arr, mid + 1, right, speed);
  await merge(arr, left, mid, right, speed);
}

async function merge(arr, left, mid, right, speed) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;

  while (i < leftArr.length && j < rightArr.length) {
    highlight(k, k);
    updateStats(1, 0);
    await sleep(speed);
    if (leftArr[i] <= rightArr[j]) {
      valueRow.children[k].innerText = leftArr[i++];
    } else {
      valueRow.children[k].innerText = rightArr[j++];
    }
    unhighlight(k, k);
    k++;
  }
  while (i < leftArr.length) valueRow.children[k++].innerText = leftArr[i++];
  while (j < rightArr.length) valueRow.children[k++].innerText = rightArr[j++];
}

// Quick Sort
async function quickSort(speed) {
  await quickSortHelper(0, currentArray.length - 1, speed);
  for (let i = 0; i < currentArray.length; i++) markSorted(i);
}

async function quickSortHelper(low, high, speed) {
  if (low < high) {
    let pi = await partition(low, high, speed);
    await quickSortHelper(low, pi - 1, speed);
    await quickSortHelper(pi + 1, high, speed);
  }
}

async function partition(low, high, speed) {
  let pivot = parseInt(valueRow.children[high].innerText);
  let i = low - 1;
  for (let j = low; j < high; j++) {
    highlight(j, high);
    updateStats(1, 0);
    await sleep(speed);
    if (parseInt(valueRow.children[j].innerText) < pivot) {
      i++;
      await swap(i, j, speed);
    }
    unhighlight(j, high);
  }
  await swap(i + 1, high, speed);
  return i + 1;
}

// Heap Sort
async function heapSort(speed) {
  let n = currentArray.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i, speed);
  for (let i = n - 1; i > 0; i--) {
    await swap(0, i, speed);
    await heapify(i, 0, speed);
  }
  for (let i = 0; i < n; i++) markSorted(i);
}

async function heapify(n, i, speed) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;

  if (l < n && parseInt(valueRow.children[l].innerText) > parseInt(valueRow.children[largest].innerText)) largest = l;
  if (r < n && parseInt(valueRow.children[r].innerText) > parseInt(valueRow.children[largest].innerText)) largest = r;

  if (largest !== i) {
    await swap(i, largest, speed);
    await heapify(n, largest, speed);
  }
}

// Jump Sort
async function jumpSort(speed) {
  let n = currentArray.length;
  let step = Math.floor(Math.sqrt(n));

  for (let i = 0; i < n; i++) {
    let j = i;
    while (j >= step && parseInt(valueRow.children[j].innerText) < parseInt(valueRow.children[j - step].innerText)) {
      await swap(j, j - step, speed);
      updateStats(1, 1);
      j -= step;
    }
  }
  for (let i = 0; i < n; i++) markSorted(i);
}

// Count Sort
async function countSort(speed) {
  let arr = getValues();
  let max = Math.max(...arr);
  let count = new Array(max + 1).fill(0);

  for (let num of arr) count[num]++;
  let idx = 0;

  for (let i = 0; i < count.length; i++) {
    while (count[i]-- > 0) {
      highlight(idx, idx);
      await sleep(speed);
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
    bucket: ['O(n + k)', 'O(n + k)'],
    radix: ['O(nk)', 'O(n + k)'],
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
