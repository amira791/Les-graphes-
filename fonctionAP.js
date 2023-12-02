function DFS(u, graph, discovery, low, parent, aps) {
    let children = 0;
    discovery[u] = low[u] = ++time;

    const neighbors = graph[u];

    for (const v of neighbors) {
        if (!discovery[v]) {
            children++;
            parent[v] = u;
            DFS(v, graph, discovery, low, parent, aps);

            low[u] = Math.min(low[u], low[v]);

            if (parent[u] === -1 && children > 1) {
                aps.add(u);
            }

            if (parent[u] !== -1 && low[v] >= discovery[u]) {
                aps.add(u);
            }
        } else if (v !== parent[u]) {
            low[u] = Math.min(low[u], discovery[v]);
        }
    }
}

function find_AP_Tarjan(graph) {
    const aps = new Set();
    const discovery = {};
    const low = {};
    const parent = {};
    time = 0;

    for (const node in graph) {
        if (!discovery[node]) {
            parent[node] = -1;
            DFS(node, graph, discovery, low, parent, aps);
        }
    }

    return Array.from(aps);
}

const sampleGraph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D', 'E'],
    'D': ['B', 'C'],
    'E': ['C'],
};

// Call the function to find articulation points
const articulationPoints = find_AP_Tarjan(sampleGraph);

// Display the result
console.log('Articulation Points:', articulationPoints);
