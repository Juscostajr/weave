import dagre from 'dagre';

export const parseOpenLineage = (openLineageData) => {
  const initialNodes = new Map();
  const initialEdges = [];

  openLineageData.forEach((event) => {
    const jobId = `${event.job.namespace}:${event.job.name}`;
    
    // 1. Cria o Nó do Job capturando o TIPO real do JSON
    if (!initialNodes.has(jobId)) {
      initialNodes.set(jobId, {
        id: jobId,
        type: 'custom',
        data: { 
            label: event.job.name, 
            namespace: event.job.namespace, 
            type: event.job.facets?.jobType?.type || 'Data Pipeline', // Lê dinamicamente
            runId: event.run?.runId
        }
      });
    }

    // 2. Cria os Nós de Input
    event.inputs?.forEach((input) => {
      const inputId = `${input.namespace}:${input.name}`;
      
      // Inferência simples para o visual: se for API externa, avisa o frontend
      const typeLabel = input.namespace.includes('api') ? 'API Endpoint' : 'Table';

      if (!initialNodes.has(inputId)) {
        initialNodes.set(inputId, {
          id: inputId,
          type: 'custom',
          data: { 
              label: input.name, namespace: input.namespace, type: typeLabel,
              schema: input.facets?.schema?.fields || [] 
          }
        });
      }
      
      initialEdges.push({ 
        id: `e-${inputId}-${jobId}`, source: inputId, target: jobId, 
        type: 'default', // <-- Mudado para 'default' (Linhas curvas de Bezier)
        animated: true, 
        style: { stroke: '#b3b0ad', strokeWidth: 1.5 } 
      });
    });

    // 3. Cria os Nós de Output
    event.outputs?.forEach((output) => {
      const outputId = `${output.namespace}:${output.name}`;
      
      // Inferência para o Dashboard do Power BI na ponta final
      const typeLabel = output.namespace.includes('powerbi') ? 'Dashboard' : 'Lakehouse Table';

      if (!initialNodes.has(outputId)) {
        initialNodes.set(outputId, {
          id: outputId,
          type: 'custom',
          data: { 
              label: output.name, namespace: output.namespace, type: typeLabel,
              schema: output.facets?.schema?.fields || []
          }
        });
      }
      
      initialEdges.push({ 
        id: `e-${jobId}-${outputId}`, source: jobId, target: outputId, 
        type: 'default', // <-- Mudado para 'default' (Linhas curvas de Bezier)
        animated: true, 
        style: { stroke: '#b3b0ad', strokeWidth: 1.5 }
      });
    });
  });

  return { nodes: Array.from(initialNodes.values()), edges: initialEdges };
};

export const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  dagreGraph.setGraph({ rankdir: 'LR', ranksep: 120, nodesep: 60 }); 

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 250, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return { 
        ...node, 
        position: { x: nodeWithPosition.x - 125, y: nodeWithPosition.y - 40 } 
      };
    }),
    edges,
  };
};