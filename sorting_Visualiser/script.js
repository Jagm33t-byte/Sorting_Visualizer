let container = document.getElementById('bars-container')
let sizeSlider = document.getElementById('size-slider')
let speedSlider = document.getElementById('speed-slider')
let sizeValue = document.getElementById('size-value')
let speedValue = document.getElementById('speed-value')
let generateBtn = document.getElementById('generate')
let rawSpeed = parseInt(document.getElementById('speed-slider').value)
let speed = Math.floor(600 / rawSpeed) // Higher slider → slower animation
let comparisons = 0
let swaps = 0


function updateStats(c = 0, s = 0) {
    comparisons += c
    swaps += s
    document.getElementById('comparisons').innerText = comparisons
    document.getElementById('swaps').innerText = swaps
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
  
    updateStats(0, 1) // only increment swap count
  }
  
  
  

  function createBars(num) {
    container.innerHTML = ''
  
    // Adjust width dynamically based on number of elements
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
  
  
  

sizeSlider.oninput = () => sizeValue.textContent = sizeSlider.value
speedSlider.oninput = () => speedValue.textContent = speedSlider.value
generateBtn.onclick = () => createBars(sizeSlider.value)
window.onload = () => {
  sizeValue.textContent = sizeSlider.value
  speedValue.textContent = speedSlider.value
  createBars(sizeSlider.value)
}

async function heapify(bars, n, i, speed) {
  let largest = i
  let left = 2 * i + 1
  let right = 2 * i + 2

  if (left < n && parseInt(bars[left].style.height) > parseInt(bars[largest].style.height)) largest = left
  if (right < n && parseInt(bars[right].style.height) > parseInt(bars[largest].style.height)) largest = right

  if (largest != i) {
    bars[i].style.background = 'red'
    bars[largest].style.background = 'red'
    await sleep(speed)
    swapBars(bars[i], bars[largest])
    bars[i].style.background = '#00c6ff'
    bars[largest].style.background = '#00c6ff'
    await heapify(bars, n, largest, speed)
    
  }
}

async function heapSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let n = bars.length
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(bars, n, i, speed)
  for (let i = n - 1; i > 0; i--) {
    bars[0].style.background = 'green'
    bars[i].style.background = 'green'
    await sleep(speed)
    swapBars(bars[0], bars[i])
    bars[i].style.background = '#00c6ff'
    await heapify(bars, i, 0, speed)
  }
  bars[0].style.background = '#00c6ff'
  if (left < n && parseInt(bars[left].style.height) > parseInt(bars[largest].style.height)) {
    largest = left
    updateStats(1, 0)
  }
  if (right < n && parseInt(bars[right].style.height) > parseInt(bars[largest].style.height)) {
    largest = right
    updateStats(1, 0)
  }
  
}

async function bucketSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let n = bars.length
  let buckets = Array.from({ length: 10 }, () => [])

  for (let i = 0; i < n; i++) {
    let val = parseInt(bars[i].style.height)
    let bucketIndex = Math.floor(val / 40)
    buckets[bucketIndex].push(val)
    bars[i].style.background = 'orange'
    await sleep(speed)
      
  }

  for (let b of buckets) b.sort((a, b) => a - b)

  let idx = 0
  for (let b of buckets) {
    for (let val of b) {
      bars[idx].style.height = val + 'px'
      bars[idx].style.background = 'lime'
      idx++
      await sleep(speed)
    }
  }
}

async function countingSortForRadix(bars, exp, speed) {
  let output = new Array(bars.length)
  let count = Array(10).fill(0)

  for (let i = 0; i < bars.length; i++) {
    let num = parseInt(bars[i].style.height)
    let index = Math.floor(num / exp) % 10
    count[index]++
    bars[i].style.background = 'orange'
    await sleep(speed)
  }

  for (let i = 1; i < 10; i++) count[i] += count[i - 1]

  for (let i = bars.length - 1; i >= 0; i--) {
    let num = parseInt(bars[i].style.height)
    let index = Math.floor(num / exp) % 10
    output[count[index] - 1] = num
    count[index]--
  }

  for (let i = 0; i < bars.length; i++) {
    bars[i].style.height = output[i] + 'px'
    bars[i].style.background = 'lime'
    await sleep(speed)
  }
}

async function radixSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let max = Math.max(...[...bars].map(b => parseInt(b.style.height)))
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countingSortForRadix(bars, exp, speed)
  }
}

async function jumpSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let n = bars.length
  let step = Math.floor(Math.sqrt(n))

  for (let i = 0; i < n - 1; i++) {
    for (let j = i; j < Math.min(i + step, n); j++) {
      for (let k = j + 1; k < Math.min(i + step, n); k++) {
        let h1 = parseInt(bars[j].style.height)
        let h2 = parseInt(bars[k].style.height)
        if (h1 > h2) {
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

async function countSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let n = bars.length
  let max = Math.max(...[...bars].map(b => parseInt(b.style.height)))
  let count = new Array(max + 1).fill(0)

  for (let i = 0; i < n; i++) {
    let val = parseInt(bars[i].style.height)
    count[val]++
    bars[i].style.background = 'orange'
    await sleep(speed / 2)
  }

  let index = 0
  for (let i = 0; i <= max; i++) {
    while (count[i] > 0) {
      bars[index].style.height = i + 'px'
      bars[index].style.background = 'lime'
      index++
      count[i]--
      await sleep(speed)
    }
  }
  }

  async function bubbleSort(speed) {
    let bars = document.querySelectorAll('.bar')
    let n = bars.length
  
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        bars[j].style.background = 'red'
        bars[j + 1].style.background = 'red'
  
        updateStats(1, 0) // comparison
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
  
async function selectionSort(speed) {
  let bars = document.querySelectorAll('.bar')
  let n = bars.length

  for (let i = 0; i < n; i++) {
    let minIdx = i
    bars[minIdx].style.background = 'yellow'

    for (let j = i + 1; j < n; j++) {
      bars[j].style.background = 'red'
      updateStats(1, 0) // comparison
      await sleep(speed)

      if (parseInt(bars[j].style.height) < parseInt(bars[minIdx].style.height)) {
        bars[minIdx].style.background = '#00c6ff'
        minIdx = j
        bars[minIdx].style.background = 'yellow'
      } else {
        bars[j].style.background = '#00c6ff'
      }
    }

    if (minIdx !== i) {
      swapBars(bars[i], bars[minIdx])
    }

    bars[minIdx].style.background = '#00c6ff'
    bars[i].style.background = 'green'
  }
}

async function insertionSort(speed) {
    let bars = document.querySelectorAll('.bar')
    let n = bars.length
  
    for (let i = 1; i < n; i++) {
      let keyHeight = parseInt(bars[i].style.height)
      let keyLabel = bars[i].querySelector('.bar-label').innerText
      let j = i - 1
  
      while (j >= 0 && parseInt(bars[j].style.height) > keyHeight) {
        updateStats(1, 0) // comparison
        bars[j + 1].style.height = bars[j].style.height
        bars[j + 1].querySelector('.bar-label').innerText = bars[j].querySelector('.bar-label').innerText
        bars[j].style.background = 'red'
        bars[j + 1].style.background = 'red'
        await sleep(speed)
        bars[j].style.background = '#00c6ff'
        bars[j + 1].style.background = '#00c6ff'
        j--
        updateStats(0, 1) // swap
      }
  
      bars[j + 1].style.height = keyHeight + 'px'
      bars[j + 1].querySelector('.bar-label').innerText = keyLabel
      updateStats(0, 1) // final placement
    }
  
    for (let k = 0; k < n; k++) bars[k].style.background = 'green'
  }

  async function partition(bars, low, high, speed) {
    let pivot = parseInt(bars[high].style.height)
    bars[high].style.background = 'purple'
    let i = low - 1
  
    for (let j = low; j < high; j++) {
      bars[j].style.background = 'red'
      updateStats(1, 0) // comparison
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
  
  async function quickSortRecursive(bars, low, high, speed) {
    if (low < high) {
      let pi = await partition(bars, low, high, speed)
      await quickSortRecursive(bars, low, pi - 1, speed)
      await quickSortRecursive(bars, pi + 1, high, speed)
    }
  }
  
  async function quickSort(speed) {
    let bars = document.querySelectorAll('.bar')
    await quickSortRecursive(bars, 0, bars.length - 1, speed)
    bars.forEach(bar => bar.style.background = 'green')
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
      updateStats(1, 0)
      bars[k].style.height = left[i] + 'px'
      bars[k].querySelector('.bar-label').innerText = left[i]
      i++
      k++
      updateStats(0, 1)
      await sleep(speed)
    }
  
    while (j < n2) {
      updateStats(1, 0)
      bars[k].style.height = right[j] + 'px'
      bars[k].querySelector('.bar-label').innerText = right[j]
      j++
      k++
      updateStats(0, 1)
      await sleep(speed)
    }
  }
  
  async function mergeSortRecursive(bars, l, r, speed) {
    if (l < r) {
      let m = Math.floor((l + r) / 2)
      await mergeSortRecursive(bars, l, m, speed)
      await mergeSortRecursive(bars, m + 1, r, speed)
      await merge(bars, l, m, r, speed)
    }
  }
  
  async function mergeSort(speed) {
    let bars = document.querySelectorAll('.bar')
    await mergeSortRecursive(bars, 0, bars.length - 1, speed)
    bars.forEach(bar => bar.style.background = 'green')
  }

  
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
  
    let bars = document.querySelectorAll('.bar')
  
    if (algo === 'heap') await heapSort(speed)
    else if (algo === 'bucket') await bucketSort(speed)
    else if (algo === 'radix') await radixSort(speed)
    else if (algo === 'jump') await jumpSort(speed)
    else if (algo === 'count') await countSort(speed)
    else if (algo === 'bubble') await bubbleSort(speed)
    else if (algo === 'selection') await selectionSort(speed)
    else if (algo === 'insertion') await insertionSort(speed)
    else if (algo === 'merge') await mergeSort(speed)
    else if (algo === 'quick') await quickSort(speed)
  }
  
  document.querySelectorAll('.algo-btn').forEach(btn => {
    btn.onclick = () => {
      document.getElementById('algo-select').value = btn.dataset.value
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
  
  
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
  