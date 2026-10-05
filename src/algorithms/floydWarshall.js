/**
 * Floyd–Warshall All-Pairs Shortest Paths Algorithm Engine
 * Browser-native computation, negative cycle detection, path reconstruction,
 * and detailed step-by-step state generation.
 */

/**
 * Solves Floyd–Warshall directly.
 * 
 * @param {Array<string>} vertices Vertex names e.g. ['A', 'B', 'C', 'D']
 * @param {Array<{from: string, to: string, weight: number}>} edges
 * @returns {Object} Solution data
 */
export function solveFloydWarshall(vertices, edges) {
  const V = vertices.length;
  const vertexMap = {};
  vertices.forEach((v, idx) => {
    vertexMap[v] = idx;
  });

  // dist[i][j]
  const dist = Array.from({ length: V }, () => Array(V).fill(Infinity));
  // next[i][j] for path reconstruction
  const next = Array.from({ length: V }, () => Array(V).fill(null));

  for (let i = 0; i < V; i++) {
    dist[i][i] = 0;
  }

  for (const edge of edges) {
    const u = vertexMap[edge.from];
    const v = vertexMap[edge.to];
    if (u !== undefined && v !== undefined) {
      dist[u][v] = Number(edge.weight);
      next[u][v] = v;
    }
  }

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          const candidate = dist[i][k] + dist[k][j];
          if (candidate < dist[i][j]) {
            dist[i][j] = candidate;
            next[i][j] = next[i][k];
          }
        }
      }
    }
  }

  // Check negative cycle: dist[i][i] < 0
  let hasNegativeCycle = false;
  for (let i = 0; i < V; i++) {
    if (dist[i][i] < 0) {
      hasNegativeCycle = true;
      break;
    }
  }

  return {
    vertices,
    edges,
    dist,
    next,
    hasNegativeCycle
  };
}

/**
 * Reconstructs shortest path between source vertex u and destination v using `next` matrix.
 * 
 * @param {number} u Source vertex index
 * @param {number} v Destination vertex index
 * @param {Array<Array<number|null>>} next
 * @param {Array<string>} vertices
 * @returns {Array<string>|null}
 */
export function reconstructPath(u, v, next, vertices) {
  if (next[u][v] === null) return null;
  const path = [vertices[u]];
  let curr = u;
  while (curr !== v) {
    curr = next[curr][v];
    if (curr === null || path.length > vertices.length + 2) {
      // Negative cycle / infinite loop safeguard
      return null;
    }
    path.push(vertices[curr]);
  }
  return path;
}

/**
 * Generates interactive step states for Floyd–Warshall.
 * 
 * @param {Object} config
 * @param {Array<string>} config.vertices
 * @param {Array<{from: string, to: string, weight: number}>} config.edges
 * @returns {Array<Object>} Sequence of steps
 */
export function generateFloydWarshallSteps({ vertices, edges }) {
  const V = vertices.length;
  const steps = [];

  const vertexMap = {};
  vertices.forEach((v, idx) => {
    vertexMap[v] = idx;
  });

  // Distance matrix dist[i][j] and next[i][j]
  const dist = Array.from({ length: V }, () => Array(V).fill(Infinity));
  const next = Array.from({ length: V }, () => Array(V).fill(null));

  for (let i = 0; i < V; i++) {
    dist[i][i] = 0;
  }

  for (const edge of edges) {
    const u = vertexMap[edge.from];
    const v = vertexMap[edge.to];
    if (u !== undefined && v !== undefined) {
      dist[u][v] = Number(edge.weight);
      next[u][v] = v;
    }
  }

  // Step 0: Initial Distance Matrix D^(0)
  steps.push({
    stepIndex: 0,
    id: 'step-init',
    phase: 'init',
    kIndex: null,
    kVertex: null,
    iIndex: null,
    jIndex: null,
    distMatrix: dist.map(r => [...r]),
    nextMatrix: next.map(r => [...r]),
    vertices: [...vertices],
    edges: [...edges],
    activeEdges: [],
    updated: false,
    activeCodeLine: 2,
    description: {
      title: 'Initial Distance Matrix D^(0)',
      detail: `Initialized ${V} × ${V} distance matrix. Self distances dist[i][i] = 0. Direct edge weights populated; all other pairs initialized to ∞.`,
      formula: 'dist[i][j] = weight(i, j) if edge exists, 0 if i = j, else ∞'
    }
  });

  // Triply-nested loops: k, i, j
  for (let k = 0; k < V; k++) {
    const kName = vertices[k];

    // Intermediate k start step
    steps.push({
      stepIndex: steps.length,
      id: `intermediate-start-k-${k}`,
      phase: 'compute',
      kIndex: k,
      kVertex: kName,
      iIndex: null,
      jIndex: null,
      distMatrix: dist.map(r => [...r]),
      nextMatrix: next.map(r => [...r]),
      vertices: [...vertices],
      edges: [...edges],
      activeEdges: [],
      updated: false,
      activeCodeLine: 4,
      description: {
        title: `Iteration k = ${k + 1} (${kName})`,
        detail: `Now testing vertex '${kName}' as an intermediate path vertex for all pairs (i, j).`,
        formula: `dist[i][j] = min(dist[i][j], dist[i][${kName}] + dist[${kName}][j])`
      }
    });

    for (let i = 0; i < V; i++) {
      const iName = vertices[i];

      for (let j = 0; j < V; j++) {
        const jName = vertices[j];

        const currentDist = dist[i][j];
        const distIK = dist[i][k];
        const distKJ = dist[k][j];

        const canTransit = distIK !== Infinity && distKJ !== Infinity;
        const candidateDist = canTransit ? distIK + distKJ : Infinity;
        const isShorter = canTransit && candidateDist < currentDist;

        // Active edges to highlight in graph
        const activeEdges = [];
        if (canTransit) {
          activeEdges.push({ from: iName, to: kName });
          activeEdges.push({ from: kName, to: jName });
        }
        if (currentDist !== Infinity && currentDist !== 0) {
          activeEdges.push({ from: iName, to: jName, isCurrent: true });
        }

        if (isShorter) {
          dist[i][j] = candidateDist;
          next[i][j] = next[i][k];
        }

        // Add step if there is something educational (either an update occurred or path was evaluated)
        // To keep animation step count student-friendly without 1000 noisy empty infinity steps:
        if (i !== j && (isShorter || canTransit)) {
          steps.push({
            stepIndex: steps.length,
            id: `k-${k}-i-${i}-j-${j}`,
            phase: 'compute',
            kIndex: k,
            kVertex: kName,
            iIndex: i,
            iVertex: iName,
            jIndex: j,
            jVertex: jName,
            currentDist,
            distIK,
            distKJ,
            candidateDist,
            updated: isShorter,
            distMatrix: dist.map(r => [...r]),
            nextMatrix: next.map(r => [...r]),
            vertices: [...vertices],
            edges: [...edges],
            activeEdges,
            activeCodeLine: isShorter ? 7 : 6,
            description: {
              title: `Checking Path: ${iName} -> ${jName} via ${kName}`,
              detail: isShorter
                ? `SHORTER PATH FOUND! Via intermediate ${kName}: dist[${iName}][${kName}] (${distIK}) + dist[${kName}][${jName}] (${distKJ}) = ${candidateDist} < existing dist[${iName}][${jName}] (${currentDist === Infinity ? '∞' : currentDist}). Updated!`
                : `Path via ${kName} (${distIK} + ${distKJ} = ${candidateDist}) does not improve existing dist[${iName}][${jName}] (${currentDist}). No update.`,
              formula: `dist[${iName}][${jName}] = min(${currentDist === Infinity ? '∞' : currentDist}, ${distIK} + ${distKJ}) = ${dist[i][j]}`
            }
          });
        }
      }
    }
  }

  // Negative cycle check pass
  let hasNegativeCycle = false;
  let cycleVertex = null;
  for (let i = 0; i < V; i++) {
    if (dist[i][i] < 0) {
      hasNegativeCycle = true;
      cycleVertex = vertices[i];
      break;
    }
  }

  // Final Step
  steps.push({
    stepIndex: steps.length,
    id: 'complete',
    phase: 'complete',
    kIndex: null,
    kVertex: null,
    iIndex: null,
    jIndex: null,
    distMatrix: dist.map(r => [...r]),
    nextMatrix: next.map(r => [...r]),
    vertices: [...vertices],
    edges: [...edges],
    activeEdges: [],
    hasNegativeCycle,
    cycleVertex,
    updated: false,
    activeCodeLine: 10,
    description: {
      title: hasNegativeCycle ? 'Negative Cycle Detected!' : 'All-Pairs Shortest Paths Found!',
      detail: hasNegativeCycle
        ? `Negative cycle detected in the graph! Vertex '${cycleVertex}' has negative self-distance dist[${cycleVertex}][${cycleVertex}] = ${dist[vertexMap[cycleVertex]][vertexMap[cycleVertex]]} < 0.`
        : `Algorithm completed. All-pairs shortest path matrix is finalized with no negative cycles.`,
      formula: hasNegativeCycle ? 'dist[i][i] < 0' : 'Optimal All-Pairs Matrix'
    }
  });

  return steps;
}
