/**
 * 0/1 Knapsack Dynamic Programming Algorithm Engine
 * Reusable and independent of React UI
 */

/**
 * Solves the 0/1 Knapsack problem and returns the full DP table,
 * maximum value, and list of selected item indices.
 * 
 * @param {Array<{id: number, weight: number, value: number}>} items 
 * @param {number} capacity 
 * @returns {Object} Solution data
 */
export function solveKnapsack(items, capacity) {
  const n = items.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { weight, value } = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (weight > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(dp[i - 1][w], value + dp[i - 1][w - weight]);
      }
    }
  }

  // Backtracking
  const selectedItemIds = [];
  let w = capacity;
  let totalWeight = 0;

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const item = items[i - 1];
      selectedItemIds.push(item.id);
      totalWeight += item.weight;
      w -= item.weight;
    }
  }

  selectedItemIds.reverse();

  return {
    dp,
    maxValue: dp[n][capacity],
    selectedItemIds,
    totalWeight,
    capacity
  };
}

/**
 * Generates an array of step-by-step states for interactive animation.
 * 
 * @param {Object} config
 * @param {Array<{id: number, weight: number, value: number}>} config.items
 * @param {number} config.capacity
 * @returns {Array<Object>} Sequence of steps
 */
export function generateKnapsackSteps({ items, capacity }) {
  const n = items.length;
  const steps = [];

  // Create initial empty table filled with nulls (except base cases)
  const currentTable = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(null));

  // Base cases: dp[0][w] = 0 and dp[i][0] = 0
  for (let w = 0; w <= capacity; w++) {
    currentTable[0][w] = 0;
  }
  for (let i = 0; i <= n; i++) {
    currentTable[i][0] = 0;
  }

  // Step 0: Base Case Initialization
  steps.push({
    stepIndex: 0,
    id: 'step-init',
    phase: 'init',
    row: null,
    col: null,
    currentItem: null,
    capacity: 0,
    table: currentTable.map(row => [...row]),
    activeCodeLine: 3,
    description: {
      title: 'Base Case Initialization',
      detail: `Initialized DP table of size (${n} + 1) × (${capacity} + 1). Row 0 (no items available) and Column 0 (capacity = 0) are set to 0.`,
      formula: 'DP[0][w] = 0 and DP[i][0] = 0 for all i, w'
    }
  });

  // Table Construction Phase
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    const { weight, value } = item;

    for (let w = 1; w <= capacity; w++) {
      const canInclude = weight <= w;
      const excludeValue = currentTable[i - 1][w];
      let includeValue = null;
      let selectedValue = excludeValue;
      let decision = 'exclude_exceeds';

      if (canInclude) {
        const prevRemainingVal = currentTable[i - 1][w - weight];
        includeValue = value + prevRemainingVal;

        if (includeValue > excludeValue) {
          selectedValue = includeValue;
          decision = 'include';
        } else if (includeValue === excludeValue) {
          selectedValue = includeValue;
          decision = 'equal';
        } else {
          selectedValue = excludeValue;
          decision = 'exclude';
        }
      }

      currentTable[i][w] = selectedValue;

      steps.push({
        stepIndex: steps.length,
        id: `compute-${i}-${w}`,
        phase: 'compute',
        row: i,
        col: w,
        currentItem: { ...item, index: i },
        capacity: w,
        canInclude,
        excludeCell: {
          row: i - 1,
          col: w,
          value: excludeValue
        },
        includeCell: canInclude ? {
          row: i - 1,
          col: w - weight,
          value: currentTable[i - 1][w - weight],
          itemValue: value,
          total: includeValue
        } : null,
        selectedValue,
        decision,
        table: currentTable.map(row => [...row]),
        activeCodeLine: canInclude ? (selectedValue === includeValue ? 8 : 9) : 6,
        description: {
          title: `Computing DP[${i}][${w}]`,
          itemText: `Item ${i} (w = ${weight}, v = ${value})`,
          capacityText: `Capacity w = ${w}`,
          excludeCalculation: `Don't Take: DP[${i - 1}][${w}] = ${excludeValue}`,
          includeCalculation: canInclude
            ? `Take: value[${i}] + DP[${i - 1}][${w} - ${weight}] = ${value} + ${currentTable[i - 1][w - weight]} = ${includeValue}`
            : `Weight (${weight}) > Capacity (${w}) → Cannot take Item ${i}`,
          finalDecision: canInclude
            ? `DP[${i}][${w}] = max(${excludeValue}, ${includeValue}) = ${selectedValue}`
            : `DP[${i}][${w}] = DP[${i - 1}][${w}] = ${selectedValue}`
        }
      });
    }
  }

  // Full DP table snapshot
  const completedTable = currentTable.map(row => [...row]);

  // Backtracking Phase
  let currRow = n;
  let currCol = capacity;
  const selectedItems = [];
  const backtrackPath = [{ row: currRow, col: currCol }];

  steps.push({
    stepIndex: steps.length,
    id: 'backtrack-start',
    phase: 'backtrack_start',
    row: currRow,
    col: currCol,
    table: completedTable,
    backtrackPath: [...backtrackPath],
    selectedItemIds: [],
    activeCodeLine: 13,
    description: {
      title: 'Backtracking: Finding Selected Items',
      detail: `Table construction complete! Maximum optimal value is DP[${n}][${capacity}] = ${completedTable[n][capacity]}. Starting backtracking from DP[${n}][${capacity}] to determine which items were included in this optimal combination.`,
      formula: 'Start at DP[n][W], compare with DP[n-1][W]'
    }
  });

  while (currRow > 0) {
    const item = items[currRow - 1];
    const currentVal = completedTable[currRow][currCol];
    const aboveVal = completedTable[currRow - 1][currCol];
    const isSelected = currentVal !== aboveVal;
    const nextCol = isSelected ? currCol - item.weight : currCol;
    const nextRow = currRow - 1;

    if (isSelected) {
      selectedItems.push(item.id);
    }

    steps.push({
      stepIndex: steps.length,
      id: `backtrack-${currRow}`,
      phase: 'backtrack',
      row: currRow,
      col: currCol,
      comparedRow: currRow - 1,
      comparedCol: currCol,
      comparedValue: aboveVal,
      currentValue: currentVal,
      currentItem: { ...item, index: currRow },
      item: { ...item, index: currRow },
      isSelected,
      nextRow,
      nextCol,
      backtrackPath: [...backtrackPath],
      selectedItemIds: [...selectedItems],
      table: completedTable,
      activeCodeLine: isSelected ? 16 : 18,
      description: {
        title: `Backtracking: Item ${currRow}`,
        detail: `Comparing DP[${currRow}][${currCol}] (${currentVal}) with DP[${currRow - 1}][${currCol}] (${aboveVal})`,
        itemText: `Item ${currRow} (w = ${item.weight}, v = ${item.value})`,
        decisionText: isSelected
          ? `Values are DIFFERENT (${currentVal} ≠ ${aboveVal})! This means Item ${currRow} WAS included. Subtract item weight ${item.weight}: remaining capacity = ${currCol} - ${item.weight} = ${nextCol}. Move to DP[${nextRow}][${nextCol}].`
          : `Values are EQUAL (${currentVal} = ${aboveVal})! Item ${currRow} was NOT included (value came directly from row above). Capacity stays ${currCol}. Move to DP[${nextRow}][${currCol}].`
      }
    });

    currRow = nextRow;
    currCol = nextCol;
    if (currRow >= 0) {
      backtrackPath.push({ row: currRow, col: currCol });
    }
  }

  // Final Summary Step
  const totalWeight = items
    .filter(it => selectedItems.includes(it.id))
    .reduce((sum, it) => sum + it.weight, 0);

  steps.push({
    stepIndex: steps.length,
    id: 'complete',
    phase: 'complete',
    table: completedTable,
    backtrackPath: [...backtrackPath],
    selectedItemIds: [...selectedItems].reverse(),
    maxValue: completedTable[n][capacity],
    totalWeight,
    capacity,
    activeCodeLine: 21,
    description: {
      title: 'Optimal Solution Found!',
      maxValue: completedTable[n][capacity],
      selectedItems: items.filter(it => selectedItems.includes(it.id)).reverse(),
      totalWeight,
      capacity,
      detail: `Backtracking complete. Maximum value achievable is ${completedTable[n][capacity]} using total weight ${totalWeight} of capacity ${capacity}.`
    }
  });

  return steps;
}
