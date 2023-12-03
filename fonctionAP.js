
let nodes = [];
let links = [];
let Graph = null;


function DFS(currentNode, graph, discovery, low, parent, aps, time) {
    console.log(graph);

    console.log(currentNode);
    let children = 0;
    discovery[currentNode] = low[currentNode] = ++time;

    // Find links where the current node is either the source or target
    const relevantLinks = graph.links.filter(link => link.source.label === currentNode.label || link.target.id === currentNode.id);

    const neighbors = relevantLinks.map(link => (link.source.label === currentNode.label ? link.target.id : link.source.id));
    console.log(neighbors);

    for (const v of neighbors) {
        if (!discovery[v]) {
            children++;
            parent[v] = currentNode;
            DFS(v, graph, discovery, low, parent, aps, time);

            low[currentNode] = Math.min(low[currentNode], low[v]);

            if (parent[currentNode] === -1 && children > 1) {
                aps.add(currentNode.id);
            }

            if (parent[currentNode] !== -1 && low[v] >= discovery[currentNode]) {
                aps.add(currentNode.id);
            }
        } else if (v !== parent[currentNode]) {
            low[currentNode] = Math.min(low[currentNode], discovery[v]);
        }
    }
}


function createGraph() {
    const Graph = { nodes: [], links: [] };
  
    nodes.forEach(node => {
      Graph.nodes.push({ id: node.id, label: node.label });
    });
  

    links.forEach(link => {
      Graph.links.push({ source: link.source.id, target: link.target.id });
    });
  
    return Graph;
  }

  function getSavedGraph() {
    return Graph;
  }

  function find_AP_Tarjan(graph) {
    const aps = new Set();
    const discovery = {};
    const low = {};
    const parent = {};
    let time = 0; // Declare 'time' with 'let' to avoid potential issues
    const graphToUse = graph || getSavedGraph();

    for (const node of graphToUse.nodes) {
        if (!discovery[node]) {
            parent[node] = -1;
            DFS(node, graphToUse, discovery, low, parent, aps, time); // Pass 'time' as an argument to DFS
        }
    }

    console.log(aps);
    highlightAPs(aps);
}

function highlightAPs(articulationPoints) {
    // Update nodes
    node = d3.select('#graph-container')
        .selectAll("circle")
        .data(nodes, d => d.id);

    // Exit
    node.exit().remove();

    // Enter + Update
    node = node.enter().append("circle")
        .attr("r", 15)
        .call(drag(simulation))
        .on("click", handleNodeClick)
        .merge(node)
        .attr("fill", d => articulationPoints.has(d.id) ? "#eb4034" : "#66a3ff");

    console.log("Nodes Updated");

    // Update labels (assuming you want to update labels similarly)
    labels = d3.select('#graph-container')
        .selectAll("text")
        .data(nodes, d => d.id);

    // Exit
    labels.exit().remove();

    // Enter + Update
    labels = labels.enter().append("text")
        .text(d => d.label)
        .attr("font-size", 12)
        .attr("dx", 15)
        .merge(labels);

    // Update links (assuming you want to update links similarly)
    link = d3.select('#graph-container')
        .selectAll("line")
        .data(links, d => `${d.source.id}-${d.target.id}`);

    // Exit
    link.exit().remove();

    // Enter + Update
    link = link.enter().append("line")
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .merge(link)
        .attr("stroke", "#66a3ff");  // Set the link color to blue

    console.log("Links Updated");

    // Restart simulation
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
}


  
  
// const sampleGraph = {
//     'A': ['B', 'C'],
//     'B': ['A', 'D'],
//     'C': ['A', 'D', 'E'],
//     'D': ['B', 'C'],
//     'E': ['C'],
// };

// // Call the function to find articulation points
// const articulationPoints = find_AP_Tarjan(sampleGraph);

// // Display the result
// console.log('Articulation Points:', articulationPoints);






// Create a D3 force simulation
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).distance(100))
  .force('charge', d3.forceManyBody().strength(-100))
  .force('center', d3.forceCenter(400, 300));

// Create links for SVG element
let link = d3.select('#graph-container')
  .selectAll("line")
  .data(links)
  .enter()
  .append("line")
  .attr("stroke", "#000000")
  .attr("stroke-width", 2);

// Create nodes for SVG element
let node = d3.select('#graph-container')
.selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r", 10)
  .attr("fill", "#66a3ff")
  .call(drag(simulation))
  .on("click", handleNodeClick);

// Add labels to nodes
let labels = d3.select('#graph-container')
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .text(d => d.label)
  .attr("font-size", 12)
  .attr('text-anchor', 'middle')
  .attr("dx", 15)
  .attr("dy", 4);

// Update positions of nodes, links, and labels during each tick of the simulation
// don't mind this function it's not important
simulation.on('tick', () => {
  
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  node
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);

  labels
    .attr('x', d => d.x)
    .attr('y', d => d.y);
  
});

// Dragging behavior for nodes
// don't mind this function it's not important
function drag(simuation) {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
}

// la fonctione ajoute un nouveau sommet au graphe
function addNode() {
// creer le nouveau sommet 
  const newNode = { id: nodes.length + 1, label: `Node ${nodes.length + 1}` };
  nodes.push(newNode);
//mettre a jour les sommets de la simulation
  node = node.data(nodes, d => d.id);

  node = node.enter().append("circle")
      .attr("r", 15)
      .attr("fill", "#66a3ff")
      .merge(node)
      .call(drag(simulation))
      .on("click", handleNodeClick);
  

  labels = labels.data(nodes, d => d.id);
  labels.exit().remove();
  labels = labels.enter().append("text")
      .text(d => d.label)
      .attr("font-size", 12)
      .attr("dx", 15)
     
      .merge(labels);
      Graph = { nodes: [...nodes], links: [...links] };
    
      simulation.nodes(nodes);
      simulation.alpha(1).restart();
}


let isLinking = false;
let selectedNode = null;

//active le mode linking pour ajouter une arrete
function startLinking() {
  isLinking = true;
  updateGraph();
  Graph = { nodes: [...nodes], links: [...links] };
  
}

/************************************************************ */
// Function to update the graph elements
function updateGraph() {
node = node.data(nodes, d => d.id);
node = node
    .enter().append("circle")
    .attr("r", 15)
    .attr("fill", "#66a3ff")
    .call(drag(simulation))
    .on("click", handleNodeClick)
    .merge(node);

labels = labels.data(nodes, d => d.id);
labels.exit().remove();
labels = labels
    .enter().append("text")
    .text(d => d.label)
    .attr("font-size", 12)
    .attr("dx", 15)
    .merge(labels);

// Update links
link = link.data(links, d => `${d.source.id}-${d.target.id}`);
link.exit().remove();
link = link
    .enter().append("line")
    .attr("stroke", "#000000")
    .attr("stroke-width", 2)
    .merge(link)
    .attr("stroke", "#66a3ff");  // Set the link color to blue

simulation.nodes(nodes);
simulation.force("link").links(links);
simulation.alpha(1).restart();
}


/****************************************************************** */

// la fonction ajoute une arrete entre deux sommets
function handleNodeClick(event, d) {
  if (isLinking) {
    // si aucun sommet n'est selctione avant => enregistrer le clicked sommet 
      if (selectedNode === null) {
          selectedNode = d;  
      } else {
        // s'il existe deja un sommet selectionne => le sommet deja selectionne = source
        // et le sommet qu'on vient de selectionnne = terget 
        const newLink = { source: selectedNode, target: d };
        links.push(newLink);
        console.log(newLink);

          isLinking = false;
          selectedNode = null;

          // mettre a jour les links de la simulation
          link = link.data(links, d => `${d.source.id}-${d.target.id}`);
          
          link = link.enter().append("line")
              .attr("stroke", "#000000")
              .attr("stroke-width", 2)
              .merge(link);

          simulation.force("link").links(links);
          simulation.alpha(1).restart();
      }
  }
}
/**************************************************************** */

