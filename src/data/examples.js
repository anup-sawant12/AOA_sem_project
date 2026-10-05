/**
 * Standard Presets and Test Cases for AOA Visualizer Algorithms
 */

// 1. 0/1 Knapsack
export const DEFAULT_KNAPSACK = {
  name: "Classroom Standard (Default)",
  capacity: 5,
  items: [
    { id: 1, name: "Item 1", weight: 2, value: 12 },
    { id: 2, name: "Item 2", weight: 1, value: 10 },
    { id: 3, name: "Item 3", weight: 3, value: 20 },
  ]
};

export const DEFAULT_EXAMPLE = DEFAULT_KNAPSACK; // Maintain backwards compatibility

export const PRESET_KNAPSACK_EXAMPLES = [
  DEFAULT_KNAPSACK,
  {
    name: "Classic Cormen/Aho Example",
    capacity: 7,
    items: [
      { id: 1, name: "Item 1", weight: 1, value: 1 },
      { id: 2, name: "Item 2", weight: 3, value: 4 },
      { id: 3, name: "Item 3", weight: 4, value: 5 },
      { id: 4, name: "Item 4", weight: 5, value: 7 },
    ]
  },
  {
    name: "High Value vs High Weight",
    capacity: 6,
    items: [
      { id: 1, name: "Item 1", weight: 2, value: 15 },
      { id: 2, name: "Item 2", weight: 3, value: 25 },
      { id: 3, name: "Item 3", weight: 4, value: 30 },
      { id: 4, name: "Item 4", weight: 2, value: 10 },
    ]
  }
];

export const PRESET_EXAMPLES = PRESET_KNAPSACK_EXAMPLES; // Maintain backwards compatibility

// 2. Fractional Knapsack
export const DEFAULT_FRACTIONAL_KNAPSACK = {
  name: "Standard Greedy Example (Default)",
  capacity: 50,
  items: [
    { id: 1, name: "Item 1", weight: 10, value: 60 },
    { id: 2, name: "Item 2", weight: 20, value: 100 },
    { id: 3, name: "Item 3", weight: 30, value: 120 },
  ]
};

export const PRESET_FRACTIONAL_EXAMPLES = [
  DEFAULT_FRACTIONAL_KNAPSACK,
  {
    name: "Cormen CLRS Example",
    capacity: 50,
    items: [
      { id: 1, name: "Item 1", weight: 10, value: 60 },
      { id: 2, name: "Item 2", weight: 20, value: 100 },
      { id: 3, name: "Item 3", weight: 30, value: 120 },
      { id: 4, name: "Item 4", weight: 15, value: 45 },
    ]
  },
  {
    name: "Small Capacity Greedy Split",
    capacity: 25,
    items: [
      { id: 1, name: "Item A", weight: 15, value: 90 },
      { id: 2, name: "Item B", weight: 10, value: 50 },
      { id: 3, name: "Item C", weight: 20, value: 80 },
    ]
  }
];

// 3. Matrix Chain Multiplication
export const DEFAULT_MATRIX_CHAIN = {
  name: "Default 4-Matrix Chain",
  // Dimensions p = [10, 20, 30, 40, 30] representing:
  // A1: 10x20, A2: 20x30, A3: 30x40, A4: 40x30
  dimensions: [10, 20, 30, 40, 30]
};

export const PRESET_MATRIX_CHAIN_EXAMPLES = [
  DEFAULT_MATRIX_CHAIN,
  {
    name: "CLRS 6-Matrix Benchmark",
    dimensions: [30, 35, 15, 5, 10, 20, 25]
  },
  {
    name: "Small 3-Matrix Example",
    dimensions: [10, 100, 5, 50]
  },
  {
    name: "Homogeneous 4-Matrix",
    dimensions: [10, 20, 25, 15, 30]
  }
];

// 4. Longest Common Subsequence (LCS)
export const DEFAULT_LCS = {
  name: "Classroom Default",
  str1: "ABCD",
  str2: "ACBD"
};

export const PRESET_LCS_EXAMPLES = [
  DEFAULT_LCS,
  {
    name: "Classic Cormen CLRS",
    str1: "ABCBDAB",
    str2: "BDCABA"
  },
  {
    name: "DNA Sequence Matching",
    str1: "AGGTAB",
    str2: "GXTXAYB"
  },
  {
    name: "Simple Word Comparison",
    str1: "LONGEST",
    str2: "STONE"
  }
];

// 5. Floyd-Warshall All-Pairs Shortest Paths
export const DEFAULT_FLOYD_WARSHALL = {
  name: "Classic 4-Vertex Graph (Default)",
  vertices: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 3 },
    { from: 'A', to: 'D', weight: 7 },
    { from: 'B', to: 'A', weight: 8 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'C', to: 'A', weight: 5 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'D', to: 'A', weight: 2 }
  ]
};

export const PRESET_FLOYD_WARSHALL_EXAMPLES = [
  DEFAULT_FLOYD_WARSHALL,
  {
    name: "Graph with Negative Weights (No Negative Cycle)",
    vertices: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'A', to: 'C', weight: -2 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 3 },
      { from: 'C', to: 'D', weight: 4 },
      { from: 'D', to: 'B', weight: -1 }
    ]
  },
  {
    name: "Negative Cycle Demonstration",
    vertices: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: -3 },
      { from: 'C', to: 'A', weight: 1 }
    ]
  }
];

// 6. Bellman-Ford Single-Source Shortest Paths
export const DEFAULT_BELLMAN_FORD = {
  name: "Standard 5-Vertex Graph (Default)",
  vertices: ['A', 'B', 'C', 'D', 'E'],
  source: 'A',
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 3 },
    { from: 'B', to: 'D', weight: 2 },
    { from: 'B', to: 'E', weight: 3 },
    { from: 'C', to: 'B', weight: 1 },
    { from: 'C', to: 'D', weight: 4 },
    { from: 'C', to: 'E', weight: 5 },
    { from: 'E', to: 'D', weight: -5 }
  ]
};

export const PRESET_BELLMAN_FORD_EXAMPLES = [
  DEFAULT_BELLMAN_FORD,
  {
    name: "CLRS Textbook Benchmark",
    vertices: ['s', 't', 'x', 'y', 'z'],
    source: 's',
    edges: [
      { from: 's', to: 't', weight: 6 },
      { from: 's', to: 'y', weight: 7 },
      { from: 't', to: 'x', weight: 5 },
      { from: 't', to: 'y', weight: 8 },
      { from: 't', to: 'z', weight: -4 },
      { from: 'x', to: 't', weight: -2 },
      { from: 'y', to: 'x', weight: -3 },
      { from: 'y', to: 'z', weight: 9 },
      { from: 'z', to: 's', weight: 2 },
      { from: 'z', to: 'x', weight: 7 }
    ]
  },
  {
    name: "Negative Cycle Detection Graph",
    vertices: ['A', 'B', 'C', 'D'],
    source: 'A',
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'B', to: 'C', weight: -2 },
      { from: 'C', to: 'D', weight: 2 },
      { from: 'D', to: 'B', weight: -4 }
    ]
  }
];
