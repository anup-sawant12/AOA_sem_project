/**
 * Longest Common Subsequence (LCS) Dynamic Programming Engine
 * Browser-native computation and animated state generation
 */

/**
 * Solves the LCS problem directly and returns the DP table, LCS length, and LCS string.
 * 
 * @param {string} str1 First sequence (length m)
 * @param {string} str2 Second sequence (length n)
 * @returns {Object} Solution data
 */
export function solveLCS(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build LCS string and indices
  let i = m;
  let j = n;
  const lcsChars = [];
  const str1Indices = [];
  const str2Indices = [];
  const path = [{ row: i, col: j }];

  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcsChars.push(str1[i - 1]);
      str1Indices.push(i - 1);
      str2Indices.push(j - 1);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
    path.push({ row: i, col: j });
  }

  lcsChars.reverse();
  str1Indices.reverse();
  str2Indices.reverse();

  return {
    m,
    n,
    str1,
    str2,
    dp,
    lcsString: lcsChars.join(''),
    length: dp[m][n],
    str1Indices,
    str2Indices,
    backtrackPath: path
  };
}

/**
 * Generates an array of step-by-step states for interactive LCS visualization.
 * 
 * @param {Object} config
 * @param {string} config.str1
 * @param {string} config.str2
 * @returns {Array<Object>} Step sequence
 */
export function generateLCSSteps({ str1, str2 }) {
  const m = str1.length;
  const n = str2.length;
  const steps = [];

  // Table initialized with nulls for uncomputed cells
  const currentTable = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));

  // Base cases: dp[i][0] = 0 and dp[0][j] = 0
  for (let i = 0; i <= m; i++) {
    currentTable[i][0] = 0;
  }
  for (let j = 0; j <= n; j++) {
    currentTable[0][j] = 0;
  }

  // Step 0: Base Case Initialization
  steps.push({
    stepIndex: 0,
    id: 'step-init',
    phase: 'init',
    str1,
    str2,
    row: null,
    col: null,
    table: currentTable.map(r => [...r]),
    activeChars: null,
    matchedIndices: { str1: [], str2: [] },
    activeCodeLine: 2,
    description: {
      title: 'Base Case Initialization',
      detail: `Initialized DP table of size (${m} + 1) × (${n} + 1). Row 0 (empty string vs str2) and Column 0 (str1 vs empty string) are filled with 0.`,
      formula: 'DP[i][0] = 0 and DP[0][j] = 0'
    }
  });

  // Table filling row by row
  for (let i = 1; i <= m; i++) {
    const char1 = str1[i - 1];

    for (let j = 1; j <= n; j++) {
      const char2 = str2[j - 1];
      const isMatch = char1 === char2;

      let calculatedValue = 0;
      let decisionType = '';
      let diagonalCell = null;
      let topCell = null;
      let leftCell = null;

      if (isMatch) {
        calculatedValue = currentTable[i - 1][j - 1] + 1;
        decisionType = 'match';
        diagonalCell = {
          row: i - 1,
          col: j - 1,
          value: currentTable[i - 1][j - 1]
        };
      } else {
        const topVal = currentTable[i - 1][j];
        const leftVal = currentTable[i][j - 1];
        calculatedValue = Math.max(topVal, leftVal);
        decisionType = 'mismatch';
        topCell = { row: i - 1, col: j, value: topVal };
        leftCell = { row: i, col: j - 1, value: leftVal };
      }

      currentTable[i][j] = calculatedValue;

      steps.push({
        stepIndex: steps.length,
        id: `compute-${i}-${j}`,
        phase: 'compute',
        str1,
        str2,
        row: i,
        col: j,
        char1,
        char2,
        char1Index: i - 1,
        char2Index: j - 1,
        isMatch,
        decisionType,
        diagonalCell,
        topCell,
        leftCell,
        calculatedValue,
        table: currentTable.map(r => [...r]),
        activeCodeLine: isMatch ? 6 : 8,
        description: {
          title: `Computing DP[${i}][${j}] ('${char1}' vs '${char2}')`,
          detail: isMatch
            ? `Characters MATCH ('${char1}' == '${char2}')! Take diagonal value + 1: DP[${i - 1}][${j - 1}] + 1 = ${currentTable[i - 1][j - 1]} + 1 = ${calculatedValue}.`
            : `Characters DO NOT match ('${char1}' != '${char2}'). Take maximum of Top cell DP[${i - 1}][${j}] (${topCell.value}) and Left cell DP[${i}][${j - 1}] (${leftCell.value}) = ${calculatedValue}.`,
          formula: isMatch 
            ? `DP[${i}][${j}] = DP[${i - 1}][${j - 1}] + 1 = ${calculatedValue}`
            : `DP[${i}][${j}] = max(${topCell.value}, ${leftCell.value}) = ${calculatedValue}`
        }
      });
    }
  }

  // Full snapshot of completed table
  const completedTable = currentTable.map(r => [...r]);

  // Backtracking Phase
  let currI = m;
  let currJ = n;
  const backtrackPath = [{ row: currI, col: currJ }];
  const lcsChars = [];
  const matchedStr1Indices = [];
  const matchedStr2Indices = [];

  steps.push({
    stepIndex: steps.length,
    id: 'backtrack-start',
    phase: 'backtrack',
    str1,
    str2,
    row: currI,
    col: currJ,
    table: completedTable,
    backtrackPath: [...backtrackPath],
    lcsStringSoFar: '',
    matchedIndices: { str1: [], str2: [] },
    activeCodeLine: 12,
    description: {
      title: 'Backtracking: Extracting the LCS',
      detail: `DP Table complete! Length of Longest Common Subsequence is DP[${m}][${n}] = ${completedTable[m][n]}. Starting at bottom-right cell DP[${m}][${n}] to trace back the exact sequence.`,
      formula: `LCS Length = ${completedTable[m][n]}`
    }
  });

  while (currI > 0 && currJ > 0) {
    const char1 = str1[currI - 1];
    const char2 = str2[currJ - 1];
    const isMatch = char1 === char2;

    let nextI = currI;
    let nextJ = currJ;
    let actionDetail = '';

    if (isMatch) {
      lcsChars.push(char1);
      matchedStr1Indices.push(currI - 1);
      matchedStr2Indices.push(currJ - 1);
      nextI = currI - 1;
      nextJ = currJ - 1;
      actionDetail = `Characters match ('${char1}')! Character '${char1}' is part of the LCS. Move diagonally to DP[${nextI}][${nextJ}].`;
    } else if (completedTable[currI - 1][currJ] >= completedTable[currI][currJ - 1]) {
      nextI = currI - 1;
      actionDetail = `Top value DP[${currI - 1}][${currJ}] (${completedTable[currI - 1][currJ]}) >= Left value DP[${currI}][${currJ - 1}] (${completedTable[currI][currJ - 1]}). Move UP to DP[${nextI}][${currJ}].`;
    } else {
      nextJ = currJ - 1;
      actionDetail = `Left value DP[${currI}][${currJ - 1}] (${completedTable[currI][currJ - 1]}) > Top value DP[${currI - 1}][${currJ}] (${completedTable[currI - 1][currJ]}). Move LEFT to DP[${currI}][${nextJ}].`;
    }

    steps.push({
      stepIndex: steps.length,
      id: `backtrack-${currI}-${currJ}`,
      phase: 'backtrack',
      str1,
      str2,
      row: currI,
      col: currJ,
      nextRow: nextI,
      nextCol: nextJ,
      isMatch,
      char: isMatch ? char1 : null,
      table: completedTable,
      backtrackPath: [...backtrackPath],
      lcsStringSoFar: [...lcsChars].reverse().join(''),
      matchedIndices: {
        str1: [...matchedStr1Indices],
        str2: [...matchedStr2Indices]
      },
      activeCodeLine: isMatch ? 14 : 16,
      description: {
        title: `Backtracking at DP[${currI}][${currJ}]`,
        detail: actionDetail,
        formula: isMatch ? `Found character '${char1}'` : `Continue traversal`
      }
    });

    currI = nextI;
    currJ = nextJ;
    backtrackPath.push({ row: currI, col: currJ });
  }

  const finalLCS = [...lcsChars].reverse().join('');

  // Final Complete Step
  steps.push({
    stepIndex: steps.length,
    id: 'complete',
    phase: 'complete',
    str1,
    str2,
    row: 0,
    col: 0,
    table: completedTable,
    backtrackPath: [...backtrackPath],
    lcsString: finalLCS,
    length: finalLCS.length,
    matchedIndices: {
      str1: [...matchedStr1Indices],
      str2: [...matchedStr2Indices]
    },
    activeCodeLine: 19,
    description: {
      title: 'LCS Computation Complete!',
      detail: `Found Longest Common Subsequence: "${finalLCS}" with length ${finalLCS.length}.`,
      formula: `LCS("${str1}", "${str2}") = "${finalLCS}" (Length: ${finalLCS.length})`
    }
  });

  return steps;
}
