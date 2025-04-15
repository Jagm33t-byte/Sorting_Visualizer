let container = document.getElementById('bars-container')
let sizeSlider = document.getElementById('size-slider')
let speedSlider = document.getElementById('speed-slider')
let sizeValue = document.getElementById('size-value')
let speedValue = document.getElementById('speed-value')
let generateBtn = document.getElementById('generate')
let comparisons = 0
let swaps = 0

function updateStats(c = 0, s = 0) {
  comparisons += c
  swaps += s
  document.getElementById('comparisons').innerText = comparisons
  document.getElementById('swaps').innerText = swaps
}

async function highlightCompare(bar1, bar2, speed) {
  bar1.style.background = 'red'
  bar2.style.background = 'red'
  updateStats(1, 0)
  await sleep(speed)
  bar1.style.background = '#00c6ff'
  bar2.style.background = '#00c6ff'
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function swapBars(bar1, bar2) {
  let tempHeight = bar1.style.height
  bar1.style.height = bar2.style.height
  bar2.style.height = tempHeight

  let newVal1 = parseInt(bar1.style.height)
  let newVal2 = parseInt(bar2.style.height)
  bar1.querySelector('.bar-label').innerText = newVal1
  bar2.querySelector('.bar-label').innerText = newVal2

  updateStats(0, 1)
}

function createBars(num) {
  container.innerHTML = ''
  const containerWidth = container.clientWidth
  const maxBarWidth = 40
  const spacing = 4
  let barWidth = Math.min(maxBarWidth, Math.floor((containerWidth - spacing * num) / num))

  for (let i = 0; i < num; i++) {
    let height = Math.floor(Math.random() * 280) + 20
    let bar = document.createElement('div')
    bar.classList.add('bar')
    bar.style.height = height + 'px'
    bar.style.width = `${barWidth}px`
    bar.style.margin = `0 ${spacing / 2}px`

    let label = document.createElement('div')
    label.classList.add('bar-label')
    label.innerText = height

    bar.appendChild(label)
    container.appendChild(bar)
  }
}

generateBtn.onclick = () => {
  createBars(sizeSlider.value)
  comparisons = 0
  swaps = 0
  updateStats(0, 0)
}

sizeSlider.oninput = () => sizeValue.textContent = sizeSlider.value
speedSlider.oninput = () => speedValue.textContent = (speedSlider.value / 100).toFixed(1) + 'x'

window.onload = () => {
  sizeValue.textContent = sizeSlider.value
  speedValue.textContent = (speedSlider.value / 100).toFixed(1) + 'x'
  createBars(sizeSlider.value)
}

// All sorting algorithms below

// ✅ Bubble Sort
async function bubbleSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let n = bars.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      bars[j].style.background = 'red'
      bars[j + 1].style.background = 'red'
      updateStats(1, 0)
      await sleep(speed)
      if (parseInt(bars[j].style.height) > parseInt(bars[j + 1].style.height)) {
        swapBars(bars[j], bars[j + 1])
      }
      bars[j].style.background = '#00c6ff'
      bars[j + 1].style.background = '#00c6ff'
    }
    bars[n - i - 1].style.background = 'green'
  }
  bars[0].style.background = 'green'
}

// ✅ Selection Sort
async function selectionSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let n = bars.length
  for (let i = 0; i < n; i++) {
    let minIdx = i
    bars[minIdx].style.background = 'yellow'
    for (let j = i + 1; j < n; j++) {
      bars[j].style.background = 'red'
      updateStats(1, 0)
      await sleep(speed)
      if (parseInt(bars[j].style.height) < parseInt(bars[minIdx].style.height)) {
        bars[minIdx].style.background = '#00c6ff'
        minIdx = j
        bars[minIdx].style.background = 'yellow'
      } else {
        bars[j].style.background = '#00c6ff'
      }
    }
    if (minIdx !== i) swapBars(bars[i], bars[minIdx])
    bars[minIdx].style.background = '#00c6ff'
    bars[i].style.background = 'green'
  }
}

// ✅ Insertion Sort
async function insertionSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let n = bars.length
  for (let i = 1; i < n; i++) {
    let keyHeight = parseInt(bars[i].style.height)
    let keyLabel = bars[i].querySelector('.bar-label').innerText
    let j = i - 1
    while (j >= 0 && parseInt(bars[j].style.height) > keyHeight) {
      updateStats(1, 0)
      bars[j + 1].style.height = bars[j].style.height
      bars[j + 1].querySelector('.bar-label').innerText = bars[j].querySelector('.bar-label').innerText
      bars[j].style.background = 'red'
      bars[j + 1].style.background = 'red'
      await sleep(speed)
      bars[j].style.background = '#00c6ff'
      bars[j + 1].style.background = '#00c6ff'
      j--
      updateStats(0, 1)
    }
    bars[j + 1].style.height = keyHeight + 'px'
    bars[j + 1].querySelector('.bar-label').innerText = keyLabel
    updateStats(0, 1)
  }
  bars.forEach(bar => bar.style.background = 'green')
}

// ✅ Merge Sort
async function mergeSort(speed) {
  let bars = document.querySelectorAll('.bar')
  await mergeSortHelper(bars, 0, bars.length - 1, speed)
  bars.forEach(bar => bar.style.background = 'green')
}

async function mergeSortHelper(bars, l, r, speed) {
  if (l < r) {
    let m = Math.floor((l + r) / 2)
    await mergeSortHelper(bars, l, m, speed)
    await mergeSortHelper(bars, m + 1, r, speed)
    await merge(bars, l, m, r, speed)
  }
}

async function merge(bars, l, m, r, speed) {
  let n1 = m - l + 1
  let n2 = r - m
  let left = [], right = []
  for (let i = 0; i < n1; i++) {
    left.push(parseInt(bars[l + i].style.height))
    updateStats(1, 0)
  }
  for (let i = 0; i < n2; i++) {
    right.push(parseInt(bars[m + 1 + i].style.height))
    updateStats(1, 0)
  }
  let i = 0, j = 0, k = l
  while (i < n1 && j < n2) {
    updateStats(1, 0)
    await sleep(speed)
    if (left[i] <= right[j]) {
      bars[k].style.height = left[i] + 'px'
      bars[k].querySelector('.bar-label').innerText = left[i]
      i++
    } else {
      bars[k].style.height = right[j] + 'px'
      bars[k].querySelector('.bar-label').innerText = right[j]
      j++
    }
    updateStats(0, 1)
    bars[k].style.background = 'red'
    await sleep(speed)
    bars[k].style.background = '#00c6ff'
    k++
  }
  while (i < n1) {
    bars[k].style.height = left[i] + 'px'
    bars[k].querySelector('.bar-label').innerText = left[i]
    i++
    k++
    updateStats(0, 1)
    await sleep(speed)
  }
  while (j < n2) {
    bars[k].style.height = right[j] + 'px'
    bars[k].querySelector('.bar-label').innerText = right[j]
    j++
    k++
    updateStats(0, 1)
    await sleep(speed)
  }
}

// ✅ Quick Sort
async function quickSort(speed) {
  let bars = document.querySelectorAll('.bar')
  await quickSortHelper(bars, 0, bars.length - 1, speed)
  bars.forEach(bar => bar.style.background = 'green')
}

async function quickSortHelper(bars, low, high, speed) {
  if (low < high) {
    let pi = await partition(bars, low, high, speed)
    await quickSortHelper(bars, low, pi - 1, speed)
    await quickSortHelper(bars, pi + 1, high, speed)
  }
}

async function partition(bars, low, high, speed) {
  let pivot = parseInt(bars[high].style.height)
  bars[high].style.background = 'purple'
  let i = low - 1
  for (let j = low; j < high; j++) {
    bars[j].style.background = 'red'
    updateStats(1, 0)
    await sleep(speed)
    if (parseInt(bars[j].style.height) < pivot) {
      i++
      swapBars(bars[i], bars[j])
    }
    bars[j].style.background = '#00c6ff'
  }
  swapBars(bars[i + 1], bars[high])
  bars[high].style.background = '#00c6ff'
  return i + 1
}

// ✅ Heap Sort
async function heapSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let n = bars.length
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(bars, n, i, speed)
  for (let i = n - 1; i > 0; i--) {
    swapBars(bars[0], bars[i])
    bars[i].style.background = 'green'
    await heapify(bars, i, 0, speed)
  }
  bars[0].style.background = 'green'
}

async function heapify(bars, n, i, speed) {
  let largest = i
  let left = 2 * i + 1
  let right = 2 * i + 2
  if (left < n) {
    updateStats(1, 0)
    if (parseInt(bars[left].style.height) > parseInt(bars[largest].style.height)) largest = left
  }
  if (right < n) {
    updateStats(1, 0)
    if (parseInt(bars[right].style.height) > parseInt(bars[largest].style.height)) largest = right
  }
  if (largest != i) {
    swapBars(bars[i], bars[largest])
    await sleep(speed)
    await heapify(bars, n, largest, speed)
  }
}

// ✅ Bucket Sort
async function bucketSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let buckets = Array.from({ length: 10 }, () => [])
  for (let i = 0; i < bars.length; i++) {
    let val = parseInt(bars[i].style.height)
    buckets[Math.floor(val / 40)].push(val)
    bars[i].style.background = 'orange'
    updateStats(1, 0)
    await sleep(speed)
  }
  for (let b of buckets) b.sort((a, b) => a - b)
  let idx = 0
  for (let b of buckets) {
    for (let val of b) {
      bars[idx].style.height = val + 'px'
      bars[idx].querySelector('.bar-label').innerText = val
      bars[idx].style.background = 'lime'
      updateStats(0, 1)
      await sleep(speed)
      idx++
    }
  }
}

// ✅ Radix Sort
async function radixSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let max = Math.max(...[...bars].map(b => parseInt(b.style.height)))
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countingSortForRadix(bars, exp, speed)
  }
}

async function countingSortForRadix(bars, exp, speed) {
  let output = new Array(bars.length)
  let count = Array(10).fill(0)
  for (let i = 0; i < bars.length; i++) {
    let val = parseInt(bars[i].style.height)
    let index = Math.floor(val / exp) % 10
    count[index]++
    bars[i].style.background = 'orange'
    await sleep(speed)
  }
  for (let i = 1; i < 10; i++) count[i] += count[i - 1]
  for (let i = bars.length - 1; i >= 0; i--) {
    let val = parseInt(bars[i].style.height)
    let index = Math.floor(val / exp) % 10
    output[count[index] - 1] = val
    count[index]--
  }
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.height = output[i] + 'px'
    bars[i].querySelector('.bar-label').innerText = output[i]
    bars[i].style.background = 'lime'
    updateStats(0, 1)
    await sleep(speed)
  }
}

// ✅ Jump Sort
async function jumpSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let n = bars.length
  let step = Math.floor(Math.sqrt(n))
  for (let i = 0; i < n; i += step) {
    for (let j = i; j < Math.min(i + step, n); j++) {
      for (let k = j + 1; k < Math.min(i + step, n); k++) {
        updateStats(1, 0)
        if (parseInt(bars[j].style.height) > parseInt(bars[k].style.height)) {
          bars[j].style.background = 'red'
          bars[k].style.background = 'red'
          await sleep(speed)
          swapBars(bars[j], bars[k])
          bars[j].style.background = '#00c6ff'
          bars[k].style.background = '#00c6ff'
        }
      }
    }
  }
}

// ✅ Count Sort
async function countSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let n = bars.length
  let max = Math.max(...[...bars].map(b => parseInt(b.style.height)))
  let count = Array(max + 1).fill(0)
  for (let i = 0; i < n; i++) {
    let val = parseInt(bars[i].style.height)
    count[val]++
    updateStats(1, 0)
    bars[i].style.background = 'orange'
    await sleep(speed / 2)
  }
  let idx = 0
  for (let i = 0; i <= max; i++) {
    while (count[i] > 0) {
      bars[idx].style.height = i + 'px'
      bars[idx].querySelector('.bar-label').innerText = i
      bars[idx].style.background = 'lime'
      idx++
      count[i]--
      updateStats(0, 1)
      await sleep(speed)
    }
  }
}

// 🌟 Selection from Span Buttons
document.querySelectorAll('.algo-btn').forEach(btn => {
  btn.onclick = () => {
    document.getElementById('algo-select').value = btn.dataset.value
    btn.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
})

// ▶ Start Button
document.getElementById('start').onclick = async () => {
  let algo = document.getElementById('algo-select').value
  let rawSpeed = parseInt(document.getElementById('speed-slider').value)
  let normalized = rawSpeed / 100
  let inverse = 1 / Math.max(normalized, 0.01)
  let speed = inverse * 100

  comparisons = 0
  swaps = 0
  updateStats(0, 0)
  showComplexity(algo)

  if (algo === 'bubble') await bubbleSort(speed)
  else if (algo === 'selection') await selectionSort(speed)
  else if (algo === 'insertion') await insertionSort(speed)
  else if (algo === 'merge') await mergeSort(speed)
  else if (algo === 'quick') await quickSort(speed)
  else if (algo === 'heap') await heapSort(speed)
  else if (algo === 'bucket') await bucketSort(speed)
  else if (algo === 'radix') await radixSort(speed)
  else if (algo === 'jump') await jumpSort(speed)
  else if (algo === 'count') await countSort(speed)
}

function showComplexity(algo) {
  const time = document.getElementById('time')
  const space = document.getElementById('space')
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
  }
  time.innerText = complexities[algo][0]
  space.innerText = complexities[algo][1]
}
