/**
 * Greedy Fractional Knapsack Algorithm Engine
 * Browser-native, standalone computation and step generation
 */

/**
 * Solves the Fractional Knapsack problem greedily.
 * 
 * @param {Array<{id: number, name?: string, weight: number, value: number}>} items 
 * @param {number} capacity 
 * @returns {Object} Solution summary
 */
export function solveFractionalKnapsack(items, capacity) {
  const formattedItems = items.map((it, idx) => ({
    id: it.id || idx + 1,
    name: it.name || `Item ${idx + 1}`,
    weight: Number(it.weight),
    value: Number(it.value),
    ratio: Number(it.value) / Number(it.weight)
  }));

  // Sort descending by ratio
  formattedItems.sort((a, b) => b.ratio - a.ratio);

  let remainingCapacity = capacity;
  let totalValue = 0;
  let totalWeight = 0;
  const selectedItems = [];

  for (const item of formattedItems) {
    if (remainingCapacity <= 0) {
      selectedItems.push({
        ...item,
        fraction: 0,
        takenWeight: 0,
        takenValue: 0
      });
      continue;
    }

    if (item.weight <= remainingCapacity) {
      // Take full item
      totalValue += item.value;
      totalWeight += item.weight;
      remainingCapacity -= item.weight;
      selectedItems.push({
        ...item,
        fraction: 1,
        fractionPercent: 100,
        takenWeight: item.weight,
        takenValue: item.value
      });
    } else {
      // Take fractional part
      const fraction = remainingCapacity / item.weight;
      const takenVal = fraction * item.value;
      const takenWt = remainingCapacity;
      totalValue += takenVal;
      totalWeight += takenWt;
      remainingCapacity = 0;
      selectedItems.push({
        ...item,
        fraction,
        fractionPercent: Number((fraction * 100).toFixed(2)),
        takenWeight: takenWt,
        takenValue: takenVal
      });
    }
  }

  return {
    sortedItems: formattedItems,
    selectedItems: selectedItems.filter(it => it.fraction > 0),
    allProcessedItems: selectedItems,
    totalValue,
    totalWeight,
    capacity
  };
}

/**
 * Generates interactive step-by-step states for Fractional Knapsack.
 * 
 * @param {Object} config
 * @param {Array<{id: number, name?: string, weight: number, value: number}>} config.items
 * @param {number} config.capacity
 * @returns {Array<Object>} Step sequence
 */
export function generateFractionalKnapsackSteps({ items, capacity }) {
  const steps = [];
  const cleanCap = Number(capacity);

  // Step 0: Input & Ratio Calculation
  const initialItems = items.map((it, idx) => {
    const w = Number(it.weight);
    const v = Number(it.value);
    return {
      id: it.id || idx + 1,
      name: it.name || `Item ${idx + 1}`,
      weight: w,
      value: v,
      ratio: v / w,
      color: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'][idx % 8]
    };
  });

  steps.push({
    stepIndex: 0,
    id: 'step-ratio-calc',
    phase: 'init',
    items: initialItems.map(it => ({ ...it })),
    knapsackItems: [],
    remainingCapacity: cleanCap,
    currentWeight: 0,
    currentValue: 0,
    capacity: cleanCap,
    currentItem: null,
    activeCodeLine: 2,
    description: {
      title: 'Step 1: Calculate Value/Weight Ratios',
      detail: `For each of the ${initialItems.length} items, compute density ratio = Value / Weight. This metric represents the value gained per unit weight.`,
      formula: 'Ratio = Value / Weight'
    }
  });

  // Step 1: Sorting by Ratio
  const sortedItems = [...initialItems].sort((a, b) => b.ratio - a.ratio);

  steps.push({
    stepIndex: 1,
    id: 'step-sort-ratios',
    phase: 'sort',
    items: sortedItems.map(it => ({ ...it })),
    knapsackItems: [],
    remainingCapacity: cleanCap,
    currentWeight: 0,
    currentValue: 0,
    capacity: cleanCap,
    currentItem: null,
    activeCodeLine: 4,
    description: {
      title: 'Step 2: Greedy Sorting by Ratio (Descending)',
      detail: `Sorted items in descending order of ratio: ${sortedItems.map(it => `${it.name} (${it.ratio.toFixed(2)})`).join(' > ')}. The greedy strategy prioritizes the highest value density first.`,
      formula: 'Sort items such that ratio[i] >= ratio[i+1]'
    }
  });

  // Steps: Processing items greedily
  let remainingCap = cleanCap;
  let currentVal = 0;
  let currentWt = 0;
  const knapsackContents = [];

  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i];

    // Sub-step A: Evaluating item
    steps.push({
      stepIndex: steps.length,
      id: `evaluate-item-${item.id}`,
      phase: 'fill',
      items: sortedItems.map(it => ({ ...it })),
      knapsackItems: knapsackContents.map(k => ({ ...k })),
      remainingCapacity: remainingCap,
      currentWeight: currentWt,
      currentValue: currentVal,
      capacity: cleanCap,
      currentItem: { ...item, currentIndex: i },
      decision: remainingCap <= 0 ? 'skip' : (item.weight <= remainingCap ? 'full' : 'fraction'),
      activeCodeLine: 6,
      description: {
        title: `Evaluating ${item.name}`,
        itemText: `${item.name} | Weight: ${item.weight}, Value: ${item.value}, Ratio: ${item.ratio.toFixed(2)}`,
        detail: remainingCap <= 0 
          ? `Knapsack is fully packed (Remaining capacity = 0). Cannot take any more items.`
          : item.weight <= remainingCap
            ? `Item weight (${item.weight}) fits within remaining capacity (${remainingCap}). We can take 100% of this item.`
            : `Item weight (${item.weight}) exceeds remaining capacity (${remainingCap}). We must take a fraction (${remainingCap}/${item.weight} = ${((remainingCap / item.weight) * 100).toFixed(2)}%) to fill the container.`,
        remainingCapacity: remainingCap
      }
    });

    if (remainingCap <= 0) {
      // Knapsack already full
      continue;
    }

    if (item.weight <= remainingCap) {
      // Take full item
      const addedVal = item.value;
      const addedWt = item.weight;
      currentVal += addedVal;
      currentWt += addedWt;
      remainingCap -= addedWt;

      knapsackContents.push({
        ...item,
        fraction: 1.0,
        fractionPercent: 100,
        takenWeight: addedWt,
        takenValue: addedVal,
        percentageOfContainer: (addedWt / cleanCap) * 100
      });

      steps.push({
        stepIndex: steps.length,
        id: `take-full-item-${item.id}`,
        phase: 'fill',
        items: sortedItems.map(it => ({ ...it })),
        knapsackItems: knapsackContents.map(k => ({ ...k })),
        remainingCapacity: remainingCap,
        currentWeight: currentWt,
        currentValue: currentVal,
        capacity: cleanCap,
        currentItem: { ...item, currentIndex: i },
        decision: 'full',
        fractionSelected: '100%',
        valueAdded: addedVal,
        weightAdded: addedWt,
        activeCodeLine: 8,
        description: {
          title: `Taken Full: ${item.name}`,
          itemText: `${item.name} (w = ${item.weight}, v = ${item.value})`,
          detail: `Added full item (${item.weight} kg, +${item.value} value). Remaining knapsack capacity is now ${remainingCap} kg.`,
          valueAdded: addedVal,
          weightAdded: addedWt,
          remainingCapacity: remainingCap
        }
      });
    } else {
      // Take fraction
      const fraction = remainingCap / item.weight;
      const fractionPercent = Number((fraction * 100).toFixed(2));
      const addedVal = fraction * item.value;
      const addedWt = remainingCap;

      currentVal += addedVal;
      currentWt += addedWt;
      const prevCap = remainingCap;
      remainingCap = 0;

      knapsackContents.push({
        ...item,
        fraction,
        fractionPercent,
        takenWeight: addedWt,
        takenValue: addedVal,
        percentageOfContainer: (addedWt / cleanCap) * 100
      });

      steps.push({
        stepIndex: steps.length,
        id: `take-fraction-item-${item.id}`,
        phase: 'fill',
        items: sortedItems.map(it => ({ ...it })),
        knapsackItems: knapsackContents.map(k => ({ ...k })),
        remainingCapacity: 0,
        currentWeight: currentWt,
        currentValue: currentVal,
        capacity: cleanCap,
        currentItem: { ...item, currentIndex: i },
        decision: 'fraction',
        fractionSelected: `${prevCap}/${item.weight} (${fractionPercent}%)`,
        valueAdded: addedVal,
        weightAdded: addedWt,
        activeCodeLine: 11,
        description: {
          title: `Taken Fraction of ${item.name} (${fractionPercent}%)`,
          itemText: `${item.name} (Weight needed: ${addedWt} of ${item.weight})`,
          detail: `Only ${addedWt} capacity left. Took fraction ${prevCap}/${item.weight} = ${fractionPercent}%. Added ${addedVal.toFixed(2)} value. Knapsack is now 100% full.`,
          valueAdded: addedVal,
          weightAdded: addedWt,
          remainingCapacity: 0
        }
      });
    }
  }

  // Final Step: Complete
  steps.push({
    stepIndex: steps.length,
    id: 'complete',
    phase: 'complete',
    items: sortedItems.map(it => ({ ...it })),
    knapsackItems: knapsackContents.map(k => ({ ...k })),
    remainingCapacity: remainingCap,
    currentWeight: currentWt,
    currentValue: currentVal,
    capacity: cleanCap,
    currentItem: null,
    activeCodeLine: 14,
    description: {
      title: 'Greedy Fractional Knapsack Optimal Solution',
      maxValue: currentVal,
      totalWeight: currentWt,
      capacity: cleanCap,
      selectedItems: knapsackContents.map(k => ({
        id: k.id,
        name: k.name,
        fractionPercent: k.fractionPercent,
        takenWeight: k.takenWeight,
        takenValue: k.takenValue
      })),
      detail: `Knapsack filled to capacity ${currentWt}/${cleanCap} with total optimal value of ${Number(currentVal.toFixed(2))}.`
    }
  });

  return steps;
}
