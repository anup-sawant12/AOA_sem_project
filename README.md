# 🧠 AOA Algorithm Visualizer

An interactive, browser-native educational suite designed to visualize and teach core algorithms in **Analysis of Algorithms (AOA)**. Built with **React 19**, **Vite**, **Tailwind CSS**, and **Framer Motion**, each algorithm module provides mathematical step-by-step reasoning, dynamic animations, customized inputs, and theoretical breakdowns.

---

## 🚀 Live Demo & Features

- **100% Browser-Native Execution:** Zero backend or database required; all algorithm logic executes directly in client JavaScript.
- **True Algorithmic Animation:** Every visual state is generated strictly from the algorithm's actual execution and recurrence relations (no mock/fake animations).
- **Universal Interactive Controls:** 
  - ▶️ **Play / Pause:** Automatic progression through algorithm execution states.
  - ⏭️ **Step-by-Step Navigation:** Step forward and backward manually.
  - 🔄 **Restart & Reset:** Restart current state or reset to classic classroom presets.
  - ⏱️ **Variable Speeds:** Slow (1200ms), Normal (600ms), and Fast (200ms).
  - 🎚️ **Scrubber Slider:** Jump directly to any execution step.
- **Educational Explanations:** Real-time breakdown showing decision criteria, candidate comparisons, formulas, and complexity metrics.
- **Expandable Theory Guides:** "How It Works" accordions covering theoretical foundations, recurrence relations, and complexities.

---

## 📚 6 Core Algorithm Modules

### 1. 0/1 Knapsack Problem (`Dynamic Programming`)
- **Recurrence:** `DP[i][w] = max(DP[i-1][w], value[i] + DP[i-1][w - weight[i]])`
- **Visualization:** Interactive 2D Dynamic Programming table updating cell-by-cell.
- **Backtracking:** Traces the optimal subset backwards from `DP[n][W]` to identify exact items included in the knapsack.
- **Complexity:** Time: $\mathcal{O}(n \cdot W)$, Space: $\mathcal{O}(n \cdot W)$.

### 2. Fractional Knapsack (`Greedy Method`)
- **Strategy:** Density ratio calculation (`ratio = value / weight`), descending sort, and greedy packing.
- **Visualization:** 
  - Dynamic density ratio table with animated sorting.
  - Physical knapsack container tank displaying items packing progressively.
  - Fractional stripe pattern with exact percentage breakdown (e.g. `20/30 = 66.67%`).
- **Complexity:** Time: $\mathcal{O}(n \log n)$, Space: $\mathcal{O}(n)$.

### 3. Matrix Chain Multiplication (`Dynamic Programming`)
- **Recurrence:** `m[i][j] = min_{i ≤ k < j} (m[i][k] + m[k+1][j] + p_{i-1} · p_k · p_j)`
- **Visualization:**
  - Triangular DP cost table evaluated diagonally by chain length ($L = 2 \dots n$).
  - Simultaneous subproblem highlighting ($m[i][k]$ and $m[k+1][j]$).
  - Testing candidate split points $k$ with real-time minimum calculation.
- **Parenthesization:** Backtracks split matrix $s[i][j]$ to produce the optimal parenthesized expression e.g. `((A1 × (A2 × A3)) × A4)`.
- **Complexity:** Time: $\mathcal{O}(n^3)$, Space: $\mathcal{O}(n^2)$.

### 4. Longest Common Subsequence - LCS (`Dynamic Programming`)
- **Recurrence:** `DP[i][j] = DP[i-1][j-1] + 1` if match, else `max(DP[i-1][j], DP[i][j-1])`.
- **Visualization:** 
  - DP table with sequences $X$ and $Y$ positioned along table boundaries.
  - Character match highlights diagonal cell and both string letters.
  - Mismatch compares top and left cells and selects maximum.
- **Backtracking:** Traces path backwards from $DP[m][n]$ to reconstruct the common subsequence string and highlight matching character indices.
- **Complexity:** Time: $\mathcal{O}(m \cdot n)$, Space: $\mathcal{O}(m \cdot n)$.

### 5. Floyd–Warshall (`All-Pairs Shortest Paths`)
- **Recurrence:** `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])` for all $k, i, j \in V$.
- **Visualization:**
  - SVG-based directed graph topology with curved edges, weights, and arrowheads.
  - Highlights intermediate node $k$, source $i$, destination $j$, and active edges $(i \to k)$ and $(k \to j)$.
  - Distance matrix updating cell-by-cell.
- **Path Reconstruction & Negative Cycle Detection:** Interactive pair selector to query shortest distance and reconstructed path, plus alert banner if $\text{dist}[i][i] < 0$.
- **Complexity:** Time: $\mathcal{O}(V^3)$, Space: $\mathcal{O}(V^2)$.

### 6. Bellman–Ford (`Single-Source Shortest Paths`)
- **Algorithm:** $V - 1$ outer iterations relaxing each directed edge where $\text{dist}[u] + w < \text{dist}[v]$.
- **Visualization:**
  - SVG directed graph showing real-time node distance badges ($d = 0, \infty, 4$).
  - Distance and predecessor table displaying $\text{dist}[v]$ and $\pi[v]$.
  - Outer iteration tracker: $\text{Iteration } 1 \dots V-1$.
- **Negative Cycle Detection Pass:** An extra $V$-th pass testing for negative cycles with clear reporting.
- **Complexity:** Time: $\mathcal{O}(V \cdot E)$, Space: $\mathcal{O}(V)$.

---

## 🏛️ Project Architecture

```
src/
├── algorithms/                 # Standalone, UI-independent algorithm engines
│   ├── knapsack.js             # 0/1 Knapsack DP solver & step state generator
│   ├── fractionalKnapsack.js   # Greedy Fractional Knapsack solver & states
│   ├── matrixChain.js          # Matrix Chain DP solver & parenthesization
│   ├── lcs.js                  # LCS DP solver & backtracking trail
│   ├── floydWarshall.js        # Floyd-Warshall all-pairs solver & cycle check
│   └── bellmanFord.js          # Bellman-Ford single-source solver & relaxation
│
├── components/
│   ├── common/                 # Reusable UI components
│   │   ├── Navbar.jsx          # Academic top navigation & tab routing
│   │   ├── AlgorithmControls.jsx# Play, pause, step, scrubber, speed
│   │   ├── Button.jsx          # Accessible button design system
│   │   └── Card.jsx            # Academic card layout container
│   │
│   ├── knapsack/               # 0/1 Knapsack components
│   ├── fractionalKnapsack/     # Fractional Knapsack visualizer & container
│   ├── matrixChain/            # Matrix Chain triangular DP table & splits
│   ├── lcs/                    # LCS matrix with boundary strings
│   ├── floydWarshall/          # SVG graph visualizer & all-pairs matrix
│   └── bellmanFord/            # SVG graph visualizer & distance table
│
├── pages/                      # Page orchestrators for each algorithm
│   ├── KnapsackPage.jsx
│   ├── FractionalKnapsackPage.jsx
│   ├── MatrixChainPage.jsx
│   ├── LCSPage.jsx
│   ├── FloydWarshallPage.jsx
│   └── BellmanFordPage.jsx
│
├── data/
│   └── examples.js             # Presets and classroom benchmark datasets
│
├── App.jsx                     # Route coordinator & hash synchronization
└── main.jsx                    # React entrypoint
```

---

## 🛠️ Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/AOAProject.git
   cd AOAProject
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready bundle will be output to the `dist/` directory.

---

## 📤 Uploading to GitHub

To push this codebase to a new repository on GitHub:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all files (node_modules and dist are automatically ignored)
git add .

# 3. Commit your changes
git commit -m "feat: complete AOA Algorithm Visualizer with all 6 algorithm modules"

# 4. Set main branch
git branch -M main

# 5. Link your GitHub remote repository
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📜 Technology Stack

- **Framework:** [React 19](https://react.dev/)
- **Bundler:** [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🎓 Academic Context

Developed for **Analysis of Algorithms (AOA)** / **Design and Analysis of Algorithms (DAA)** curricula to demonstrate Greedy Algorithms, Dynamic Programming, and Graph Optimization visually and rigorously.
