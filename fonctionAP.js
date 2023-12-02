
/* La complexite de DFS : O(V + E) ou V: nb noeuds visites et E: nb arcs visites  */
function DFS (root, graph, visited = new Set())
{
    console.log(root);
    visited.add(root);

    const adjacents = graph[root] || [];

    for (const adjacent of adjacents )
        {
            if (!visited.has(adjacent))
            {
                DFS(adjacent, graph, visited);
            }
        }

}

function find_AP_Torjan (graph)
{
    const APs = new Set();
    const visited = new Set();

   for (node in graph)
   {
    if (!visited.has(node))
    {
        DFS (node, graph, visited)
        const connectedComponent = new Set([...visited]);   

        for (const adjacent of graph[node])
        {
            visited.delete(adjacent);
        }
    }

    if (connectedComponent.size < Object.keys(graph).length)
    {
        APs.add(node);
    }
   }

   return Array.from(APs);

}

