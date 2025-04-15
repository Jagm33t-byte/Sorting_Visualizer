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
    for (let i = 0; i < num; i++) {
      let height = Math.floor(Math.random() * 280) + 20
      let bar = document.createElement('div')
      bar.classList.add('bar')
      bar.style.height = height + 'px'
  
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
    if (left < n && parseInt(bars[left].style.height) > parseInt(bars[largest].style.height)) {
        largest = left
        updateStats(1, 0)
      }
      if (right < n && parseInt(bars[right].style.height) > parseInt(bars[largest].style.height)) {
        largest = right
        updateStats(1, 0)
      }
      
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
    if (left < n && parseInt(bars[left].style.height) > parseInt(bars[largest].style.height)) {
        largest = left
        updateStats(1, 0)
      }
      if (right < n && parseInt(bars[right].style.height) > parseInt(bars[largest].style.height)) {
        largest = right
        updateStats(1, 0)
      }
      
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
        if (left < n && parseInt(bars[left].style.height) > parseInt(bars[largest].style.height)) {
            largest = left
            updateStats(1, 0)
          }
          if (right < n && parseInt(bars[right].style.height) > parseInt(bars[largest].style.height)) {
            largest = right
            updateStats(1, 0)
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

  document.getElementById('start').onclick = async () => {
    let algo = document.getElementById('algo-select').value
    let speed = 101 - parseInt(document.getElementById('speed-slider').value)
  
    // RESET counters
    comparisons = 0
    swaps = 0
    updateStats(0, 0)
  
    showComplexity(algo)
  
    // Call selected sorting algorithm
    if (algo === 'heap') await heapSort(speed)
    else if (algo === 'bucket') await bucketSort(speed)
    else if (algo === 'radix') await radixSort(speed)
    else if (algo === 'jump') await jumpSort(speed)
    else if (algo === 'count') await countSort(speed)
    // (add others here too)
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
  