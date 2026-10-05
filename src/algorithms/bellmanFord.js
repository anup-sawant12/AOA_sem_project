/**
 * Bellman–Ford Single-Source Shortest Paths Algorithm Engine
 * Browser-native computation, edge relaxation steps, path reconstruction,
 * and negative-weight cycle detection.
 */

/**
 * Solves Bellman-Ford directly.
 * 
 * @param {Array<string>} vertices Array of vertex labels
 * @param {Array<{from: string, to: string, weight: number}>} edges
 * @param {string} source Source vertex label
 * @returns {Object} Solution data
 */
export function solveBellmanFord(vertices, edges, source) {
  const dist = {};
  const predecessor = {};

  vertices.forEach(v => {
    dist[v] = Infinity;
    predecessor[v] = null;
  });
  dist[source] = 0;

  const V = vertices.length;

  // V - 1 iterations
  for (let i = 1; i < V; i++) {
    for (const edge of edges) {
      const u = edge.from;
      const v = edge.to;
      const w = Number(edge.weight);
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        predecessor[v] = u;
      }
    }
  }

  // 1 additional pass for negative cycle
  let hasNegativeCycle = false;
  let cycleEdge = null;
  for (const edge of edges) {
    const u = edge.from;
    const v = edge.to;
    const w = Number(edge.weight);
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      hasNegativeCycle = true;
      cycleEdge = edge;
      break;
    }
  }

  return {
    vertices,
    edges,
    source,
    dist,
    predecessor,
    hasNegativeCycle,
    cycleEdge
  };
}

/**
 * Reconstructs shortest path from source to target vertex.
 * 
 * @param {string} target Target vertex
 * @param {string} source Source vertex
 * @param {Object} predecessor
 * @param {number} maxVertices
 * @returns {Array<string>|null}
 */
export function reconstructBellmanFordPath(target, source, predecessor, maxVertices = 10) {
  if (target === source) return [source];
  if (!predecessor[target]) return null;

  const path = [];
  let curr = target;
  let count = 0;

  while (curr !== null && count < maxVertices + 2) {
    path.push(curr);
    if (curr === source) break;
    curr = predecessor[curr];
    count++;
  }

  if (curr !== source) return null; // Unreachable or cycle
  return path.reverse();
}

/**
 * Generates an array of step-by-step states for interactive Bellman-Ford animation.
 * 
 * @param {Object} config
 * @param {Array<string>} config.vertices
 * @param {Array<{from: string, to: string, weight: number}>} config.edges
 * @param {string} config.source
 * @returns {Array<Object>} Step sequence
 */
export function generateBellmanFordSteps({ vertices, edges, source }) {
  const steps = [];
  const V = vertices.length;

  const currentDist = {};
  const currentPredecessor = {};

  vertices.forEach(v => {
    currentDist[v] = Infinity;
    currentPredecessor[v] = null;
  });
  currentDist[source] = 0;

  // Step 0: Initialization
  steps.push({
    stepIndex: 0,
    id: 'step-init',
    phase: 'init',
    iteration: 0,
    maxIterations: V - 1,
    source,
    activeEdge: null,
    dist: { ...currentDist },
    predecessor: { ...currentPredecessor },
    vertices: [...vertices],
    edges: [...edges],
    relaxed: false,
    activeCodeLine: 2,
    description: {
      title: 'Step 0: Distance Table Initialization',
      detail: `Initialized source vertex '${source}' with dist[${source}] = 0. All other ${V - 1} vertices initialized with distance ∞. Predecessors set to null.`,
      formula: `dist[${source}] = 0, dist[v] = ∞ for all v != ${source}`
    }
  });

  // V - 1 outer relaxation passes
  for (let iter = 1; iter <= V - 1; iter++) {
    let anyUpdateInIter = false;

    // Start of iteration banner step
    steps.push({
      stepIndex: steps.length,
      id: `iter-${iter}-start`,
      phase: 'relax',
      iteration: iter,
      maxIterations: V - 1,
      source,
      activeEdge: null,
      dist: { ...currentDist },
      predecessor: { ...currentPredecessor },
      vertices: [...vertices],
      edges: [...edges],
      relaxed: false,
      activeCodeLine: 4,
      description: {
        title: `Starting Iteration ${iter} of ${V - 1}`,
        detail: `Pass ${iter}/${V - 1}: Examining all ${edges.length} directed edges for relaxation opportunities.`,
        formula: 'dist[u] + weight < dist[v]'
      }
    });

    for (let eIdx = 0; eIdx < edges.length; eIdx++) {
      const edge = edges[eIdx];
      const u = edge.from;
      const v = edge.to;
      const w = Number(edge.weight);

      const uDist = currentDist[u];
      const vDist = currentDist[v];
      const canRelax = uDist !== Infinity && uDist + w < vDist;

      if (canRelax) {
        const oldDist = vDist;
        const newDist = uDist + w;
        currentDist[v] = newDist;
        currentPredecessor[v] = u;
        anyUpdateInIter = true;

        steps.push({
          stepIndex: steps.length,
          id: `iter-${iter}-relax-${u}-${v}`,
          phase: 'relax',
          iteration: iter,
          maxIterations: V - 1,
          source,
          activeEdge: { ...edge, index: eIdx },
          uVertex: u,
          vVertex: v,
          weight: w,
          uDist,
          oldDist,
          newDist,
          relaxed: true,
          dist: { ...currentDist },
          predecessor: { ...currentPredecessor },
          vertices: [...vertices],
          edges: [...edges],
          activeCodeLine: 6,
          description: {
            title: `Relaxed Edge: ${u} -> ${v} (Weight: ${w})`,
            detail: `Edge (${u} -> ${v}) RELAXED! Current dist[${u}] = ${uDist}. dist[${u}] + weight = ${uDist} + ${w} = ${newDist} < old dist[${v}] (${oldDist === Infinity ? '∞' : oldDist}). Distance to '${v}' updated to ${newDist}!`,
            formula: `dist[${v}] = dist[${u}] + weight = ${uDist} + (${w}) = ${newDist}`
          }
        });
      } else {
        // Step for checked edge that was not relaxed (only if u is reached or meaningful)
        if (uDist !== Infinity) {
          steps.push({
            stepIndex: steps.length,
            id: `iter-${iter}-check-${u}-${v}`,
            phase: 'relax',
            iteration: iter,
            maxIterations: V - 1,
            source,
            activeEdge: { ...edge, index: eIdx },
            uVertex: u,
            vVertex: v,
            weight: w,
            uDist,
            oldDist: vDist,
            newDist: vDist,
            relaxed: false,
            dist: { ...currentDist },
            predecessor: { ...currentPredecessor },
            vertices: [...vertices],
            edges: [...edges],
            activeCodeLine: 5,
            description: {
              title: `Checked Edge: ${u} -> ${v} (Weight: ${w})`,
              detail: `Checked edge (${u} -> ${v}). dist[${u}] + weight = ${uDist} + ${w} = ${uDist + w} >= current dist[${v}] (${vDist === Infinity ? '∞' : vDist}). No relaxation possible.`,
              formula: `${uDist} + (${w}) >= ${vDist === Infinity ? '∞' : vDist}`
            }
          });
        }
      }
    }
  }

  // Final Phase: Negative Cycle Detection Pass
  let hasNegativeCycle = false;
  let cycleEdge = null;

  for (let eIdx = 0; eIdx < edges.length; eIdx++) {
    const edge = edges[eIdx];
    const u = edge.from;
    const v = edge.to;
    const w = Number(edge.weight);
    if (currentDist[u] !== Infinity && currentDist[u] + w < currentDist[v]) {
      hasNegativeCycle = true;
      cycleEdge = { ...edge, index: eIdx };
      break;
    }
  }

  steps.push({
    stepIndex: steps.length,
    id: 'negative-cycle-check',
    phase: 'check',
    iteration: V,
    maxIterations: V - 1,
    source,
    activeEdge: cycleEdge,
    hasNegativeCycle,
    cycleEdge,
    dist: { ...currentDist },
    predecessor: { ...currentPredecessor },
    vertices: [...vertices],
    edges: [...edges],
    activeCodeLine: 9,
    description: {
      title: hasNegativeCycle ? 'Negative Cycle Detected!' : 'Negative Cycle Check: Passed',
      detail: hasNegativeCycle
        ? `NEGATIVE WEIGHT CYCLE DETECTED! Edge (${cycleEdge.from} -> ${cycleEdge.to}, weight ${cycleEdge.weight}) can STILL be relaxed: dist[${cycleEdge.from}] (${currentDist[cycleEdge.from]}) + ${cycleEdge.weight} = ${currentDist[cycleEdge.from] + Number(cycleEdge.weight)} < dist[${cycleEdge.to}] (${currentDist[cycleEdge.to]}).`
        : `Negative Cycle Check Passed! No edges can be further relaxed after ${V - 1} iterations. The shortest paths are optimal and well-defined.`,
      formula: hasNegativeCycle ? 'dist[u] + w < dist[v] on V-th pass' : 'No edges can relax'
    }
  });

  // Final Complete Step
  steps.push({
    stepIndex: steps.length,
    id: 'complete',
    phase: 'complete',
    iteration: V,
    maxIterations: V - 1,
    source,
    activeEdge: null,
    hasNegativeCycle,
    cycleEdge,
    dist: { ...currentDist },
    predecessor: { ...currentPredecessor },
    vertices: [...vertices],
    edges: [...edges],
    activeCodeLine: 11,
    description: {
      title: hasNegativeCycle ? 'Algorithm Finished (Negative Cycle)' : 'Bellman-Ford Optimal Distances Found!',
      detail: hasNegativeCycle
        ? `Negative cycle detected in the graph reachable from source '${source}'. Shortest paths cannot be computed.`
        : `Shortest distances and predecessors from source '${source}' successfully computed for all ${V} vertices.`,
      formula: hasNegativeCycle ? 'Negative Cycle' : `Source: ${source}`
    }
  });

  return steps;
}
