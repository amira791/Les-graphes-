

function DFS (racine, graph, visited = new Set())
{
    console.log(racine);
    visited.add(racine);

    const adjacents = graph[racine] || [];

    for (const adjacent of adjacents )
        {
            if (!visited.has(adjacent))
            {
                DFS(adjacent, graph, visited);
            }
        }

}


/* La complexite de DFS : O(V + E) ou V: nb noeuds visites et E: nb arcs visites  */