/**
 * Matrix Chain Multiplication DP Algorithm Engine
 * Browser-native, standalone computation and step-by-step state generation
 */

/**
 * Helper to build parenthesization string recursively from split table s.
 * 
 * @param {Array<Array<number>>} s Split table (1-indexed)
 * @param {number} i Start index
 * @param {number} j End index
 * @returns {string} Parenthesized representation e.g. "((A1 × A2) × A3)"
 */
export function buildParenthesization(s, i, j) {
  if (i === j) {
    return `A${i}`;
  }
  const k = s[i][j];
  return `(${buildParenthesization(s, i, k)} × ${buildParenthesization(s, k + 1, j)})`;
}

/**
 * Solves the Matrix Chain Multiplication problem directly.
 * 
 * @param {Array<number>} dimensions Array of dimensions p0, p1, ..., pn
 * @returns {Object} Solution data
 */
export function solveMatrixChain(dimensions) {
  const n = dimensions.length - 1; // Number of matrices
  const m = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
  const s = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));

  for (let L = 2; L <= n; L++) {
    for (let i = 1; i <= n - L + 1; i++) {
      const j = i + L - 1;
      m[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = m[i][k] + m[k + 1][j] + dimensions[i - 1] * dimensions[k] * dimensions[j];
        if (cost < m[i][j]) {
          m[i][j] = cost;
          s[i][j] = k;
        }
      }
    }
  }

  const optimalParens = buildParenthesization(s, 1, n);

  return {
    n,
    dimensions,
    m,
    s,
    minOperations: m[1][n],
    optimalParens
  };
}

/**
 * Generates an array of step-by-step states for Matrix Chain Multiplication.
 * 
 * @param {Object} config
 * @param {Array<number>} config.dimensions Dimensions array [p0, p1, ..., pn]
 * @returns {Array<Object>} Step sequence
 */
export function generateMatrixChainSteps({ dimensions }) {
  const n = dimensions.length - 1;
  const steps = [];

  // Initialize tables: m = cost, s = split point (both 1-indexed)
  // Fill with null initially so uncomputed cells are empty in visualization
  const currentM = Array.from({ length: n + 1 }, () => Array(n + 1).fill(null));
  const currentS = Array.from({ length: n + 1 }, () => Array(n + 1).fill(null));

  // Base cases: m[i][i] = 0 (single matrix requires 0 multiplications)
  for (let i = 1; i <= n; i++) {
    currentM[i][i] = 0;
  }

  // Step 0: Initialization
  steps.push({
    stepIndex: 0,
    id: 'step-init',
    phase: 'init',
    n,
    dimensions: [...dimensions],
    mTable: currentM.map(row => [...row]),
    sTable: currentS.map(row => [...row]),
    currentChainLength: 1,
    activeCell: null,
    candidateSplits: [],
    optimalParens: '',
    activeCodeLine: 3,
    description: {
      title: 'Base Case Initialization (Chain Length L = 1)',
      detail: `Initialized DP table of size ${n} × ${n}. For each single matrix Aᵢ, the cost to multiply with itself is m[i][i] = 0. Diagonal values set to 0.`,
      formula: 'm[i][i] = 0 for 1 <= i <= n'
    }
  });

  // Diagonal processing by chain length L = 2 to n
  for (let L = 2; L <= n; L++) {
    for (let i = 1; i <= n - L + 1; i++) {
      const j = i + L - 1;
      let minCost = Infinity;
      let bestK = i;
      const candidateSplits = [];

      // Step: Start computing cell (i, j)
      steps.push({
        stepIndex: steps.length,
        id: `start-cell-${i}-${j}`,
        phase: 'compute',
        n,
        dimensions: [...dimensions],
        mTable: currentM.map(row => [...row]),
        sTable: currentS.map(row => [...row]),
        currentChainLength: L,
        activeCell: { row: i, col: j },
        currentK: null,
        candidateSplits: [],
        bestCostSoFar: null,
        bestKSoFar: null,
        activeCodeLine: 6,
        description: {
          title: `Evaluating Subchain A${i} ... A${j} (Length ${L})`,
          detail: `Computing optimal multiplication cost for chain A${i}...A${j} [dimensions: ${dimensions[i - 1]}×${dimensions[j]}]. Testing split points k from ${i} to ${j - 1}.`,
          formula: `m[${i}][${j}] = min (m[${i}][k] + m[k+1][${j}] + p${i-1}×p_k×p${j}) for ${i} <= k < ${j}`
        }
      });

      // Test each split point k
      for (let k = i; k < j; k++) {
        const leftCost = currentM[i][k];
        const rightCost = currentM[k + 1][j];
        const multCost = dimensions[i - 1] * dimensions[k] * dimensions[j];
        const totalCost = leftCost + rightCost + multCost;

        const isNewMin = totalCost < minCost;
        if (isNewMin) {
          minCost = totalCost;
          bestK = k;
        }

        candidateSplits.push({
          k,
          leftCost,
          rightCost,
          multCost,
          totalCost,
          isMin: isNewMin
        });

        steps.push({
          stepIndex: steps.length,
          id: `split-${i}-${j}-k-${k}`,
          phase: 'compute',
          n,
          dimensions: [...dimensions],
          mTable: currentM.map(row => [...row]),
          sTable: currentS.map(row => [...row]),
          currentChainLength: L,
          activeCell: { row: i, col: j },
          currentK: k,
          leftCell: { row: i, col: k },
          rightCell: { row: k + 1, col: j },
          candidateSplits: [...candidateSplits],
          candidateCalculation: {
            leftText: `m[${i}][${k}] = ${leftCost}`,
            rightText: `m[${k + 1}][${j}] = ${rightCost}`,
            multText: `p[${i - 1}] × p[${k}] × p[${j}] = ${dimensions[i - 1]} × ${dimensions[k]} × ${dimensions[j]} = ${multCost}`,
            total: totalCost
          },
          bestCostSoFar: minCost,
          bestKSoFar: bestK,
          activeCodeLine: 8,
          description: {
            title: `Split at k = ${k}: (A${i}..A${k}) × (A${k + 1}..A${j})`,
            detail: `Left chain cost m[${i}][${k}] = ${leftCost}, Right chain cost m[${k + 1}][${j}] = ${rightCost}, Scalar mults = ${dimensions[i - 1]}×${dimensions[k]}×${dimensions[j]} = ${multCost}. Total = ${totalCost}. ${
              isNewMin ? `--> New minimum found (${totalCost})!` : `--> Exceeds current minimum (${minCost}).`
            }`,
            formula: `Total = ${leftCost} + ${rightCost} + ${multCost} = ${totalCost}`
          }
        });
      }

      // Finalize cell (i, j)
      currentM[i][j] = minCost;
      currentS[i][j] = bestK;

      steps.push({
        stepIndex: steps.length,
        id: `final-cell-${i}-${j}`,
        phase: 'compute',
        n,
        dimensions: [...dimensions],
        mTable: currentM.map(row => [...row]),
        sTable: currentS.map(row => [...row]),
        currentChainLength: L,
        activeCell: { row: i, col: j },
        currentK: bestK,
        candidateSplits: [...candidateSplits],
        bestCostSoFar: minCost,
        bestKSoFar: bestK,
        activeCodeLine: 11,
        description: {
          title: `Finalized m[${i}][${j}] = ${minCost}`,
          detail: `Optimal cost for chain A${i}..A${j} is ${minCost} operations with optimal split at k = ${bestK}. Stored in table.`,
          formula: `m[${i}][${j}] = ${minCost}, s[${i}][${j}] = ${bestK}`
        }
      });
    }
  }

  // Backtracking Phase: Optimal Parenthesization
  const optimalParens = buildParenthesization(currentS, 1, n);

  // Reconstruction steps showing how parentheses are formed
  const backtrackStepsList = [];
  function traceParens(i, j, depth = 0) {
    if (i === j) {
      backtrackStepsList.push({
        i,
        j,
        k: null,
        detail: `Matrix A${i} is a single unit.`
      });
      return;
    }
    const k = currentS[i][j];
    backtrackStepsList.push({
      i,
      j,
      k,
      detail: `At s[${i}][${j}] = ${k}: Split product into (A${i}..A${k}) × (A${k + 1}..A${j}).`
    });
    traceParens(i, k, depth + 1);
    traceParens(k + 1, j, depth + 1);
  }
  traceParens(1, n);

  steps.push({
    stepIndex: steps.length,
    id: 'backtrack-start',
    phase: 'backtrack',
    n,
    dimensions: [...dimensions],
    mTable: currentM.map(row => [...row]),
    sTable: currentS.map(row => [...row]),
    currentChainLength: n,
    activeCell: { row: 1, col: n },
    currentK: currentS[1][n],
    minOperations: currentM[1][n],
    optimalParens,
    backtrackDetails: backtrackStepsList,
    candidateSplits: [],
    bestCostSoFar: currentM[1][n],
    bestKSoFar: currentS[1][n],
    activeCodeLine: 14,
    description: {
      title: 'Backtracking Split Table for Parenthesization',
      detail: `Table filled! Minimum scalar multiplications needed is m[1][${n}] = ${currentM[1][n].toLocaleString()}. Now reading the split table s to construct optimal parenthesization.`,
      formula: `Optimal split for full chain: s[1][${n}] = ${currentS[1][n]}`
    }
  });

  // Final Complete Step
  steps.push({
    stepIndex: steps.length,
    id: 'complete',
    phase: 'complete',
    n,
    dimensions: [...dimensions],
    mTable: currentM.map(row => [...row]),
    sTable: currentS.map(row => [...row]),
    currentChainLength: n,
    activeCell: { row: 1, col: n },
    currentK: currentS[1][n],
    minOperations: currentM[1][n],
    optimalParens,
    backtrackDetails: backtrackStepsList,
    candidateSplits: [],
    bestCostSoFar: currentM[1][n],
    bestKSoFar: currentS[1][n],
    activeCodeLine: 16,
    description: {
      title: 'Optimal Parenthesization Found!',
      detail: `The optimal parenthesization order is ${optimalParens}, requiring only ${currentM[1][n].toLocaleString()} scalar multiplications.`,
      formula: optimalParens
    }
  });

  return steps;
}
