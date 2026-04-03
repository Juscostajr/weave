import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar';
import CustomNode from './CustomNode';
import { getLayoutedElements, parseOpenLineage } from './utils/lineageParser';
import openLineageData from './data/openlineage-mock.json';

const nodeTypes = { custom: CustomNode };

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const { nodes: parsedNodes, edges: parsedEdges } = parseOpenLineage(openLineageData);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(parsedNodes, parsedEdges);

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, []);

const onNodeClick = useCallback((_, clickedNode) => {
    setSelectedNode(clickedNode); 
    
    // 1. Inicializa os conjuntos para rastrear a linhagem à esquerda (Upstream)
    const upstreamNodes = new Set([clickedNode.id]);
    const upstreamEdges = new Set();
    const queue = [clickedNode.id];

    // 2. Algoritmo BFS para percorrer o grafo de trás para frente
    while (queue.length > 0) {
      const currentId = queue.shift();

      // Procura todas as arestas que chegam no nó atual (onde ele é o 'target')
      edges.forEach((edge) => {
        if (edge.target === currentId) {
          upstreamEdges.add(edge.id);
          
          // Se o nó de origem ainda não foi visitado, entra na fila para continuar a busca
          if (!upstreamNodes.has(edge.source)) {
            upstreamNodes.add(edge.source);
            queue.push(edge.source);
          }
        }
      });
    }

    // 3. Atualiza o estado dos nós destacando toda a cadeia rastreada
    setNodes((nds) => nds.map((n) => ({
      ...n,
      data: { ...n.data, isHighlighted: upstreamNodes.has(n.id) }
    })));

    // 4. Atualiza o estado das arestas com o azul da Microsoft
    setEdges((eds) => eds.map((e) => ({
      ...e,
      style: {
        stroke: upstreamEdges.has(e.id) ? '#0078d4' : '#b3b0ad',
        strokeWidth: upstreamEdges.has(e.id) ? 2 : 1.5,
      },
      // Dica visual extra: Liga a animação de fluxo APENAS na cadeia selecionada
      animated: upstreamEdges.has(e.id), 
      // Traz as linhas destacadas para frente das linhas cinzas
      zIndex: upstreamEdges.has(e.id) ? 10 : 0 
    })));
    
  // IMPORTANTE: Adicionamos 'edges' como dependência para o algoritmo funcionar com os dados mais recentes
  }, [edges, setNodes, setEdges]);

  const closeSidebar = () => setSelectedNode(null);

  return (
    // 1. O container principal ocupando a tela toda (100vh = 100% da altura da view)
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#f9fafb' }}>

      {/* 2. O container do Grafo (Pai direto do React Flow). 
          Aqui está o segredo para corrigir o Erro 004: width e height 100% explícitos! */}
      <div style={{ flexGrow: 1, height: '100%', width: '100%', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          onPaneClick={closeSidebar}
          fitView
        >
          <Background color="#aaa" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Painel de Detalhes (Drawer) */}
      <Sidebar node={selectedNode} onClose={closeSidebar} />
    </div>
  );
}