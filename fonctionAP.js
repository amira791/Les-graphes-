function DFS(currentNode, graph, discovery, low, parent, aps) {
    let children = 0;
    discovery[currentNode] = low[currentNode] = ++time;

    const neighbors = graph[currentNode];

    for (const v of neighbors) {
        if (!discovery[v]) {
            children++;
            parent[v] = currentNode;
            DFS(v, graph, discovery, low, parent, aps);

            low[currentNode] = Math.min(low[u], low[v]);

            if (parent[currentNode] === -1 && children > 1) {
                aps.add(currentNode);
            }

            if (parent[currentNode] !== -1 && low[v] >= discovery[currentNode]) {
                aps.add(currentNode);
            }
        } else if (v !== parent[currentNode]) {
            low[currentNode] = Math.min(low[currentNode], discovery[v]);
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
