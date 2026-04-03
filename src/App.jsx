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
    let { nodes: parsedNodes, edges: parsedEdges } = parseOpenLineage(openLineageData);
    const urlParams = new URLSearchParams(window.location.search);
    const focusNodeId = urlParams.get('focus');

    if (focusNodeId && parsedNodes.some((n) => n.id === focusNodeId)) {
      const upstreamNodes = new Set([focusNodeId]);
      const upstreamEdges = new Set();
      const queue = [focusNodeId];

      while (queue.length > 0) {
        const currentId = queue.shift();

        parsedEdges.forEach((edge) => {
          if (edge.target === currentId) {
            upstreamEdges.add(edge.id);
            if (!upstreamNodes.has(edge.source)) {
              upstreamNodes.add(edge.source);
              queue.push(edge.source);
            }
          }
        });
      }

      parsedNodes = parsedNodes.filter((n) => upstreamNodes.has(n.id));
      parsedEdges = parsedEdges.filter((e) => upstreamEdges.has(e.id));
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(parsedNodes, parsedEdges);

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [setNodes, setEdges]);


  const onNodeClick = useCallback((_, clickedNode) => {
    setSelectedNode(clickedNode); 
    
    const upstreamNodes = new Set([clickedNode.id]);
    const upstreamEdges = new Set();
    const queue = [clickedNode.id];

    while (queue.length > 0) {
      const currentId = queue.shift();
      edges.forEach((edge) => {
        if (edge.target === currentId) {
          upstreamEdges.add(edge.id);
          if (!upstreamNodes.has(edge.source)) {
            upstreamNodes.add(edge.source);
            queue.push(edge.source);
          }
        }
      });
    }

    setNodes((nds) => nds.map((n) => ({
      ...n,
      data: { ...n.data, isHighlighted: upstreamNodes.has(n.id) }
    })));

    setEdges((eds) => eds.map((e) => ({
      ...e,
      style: {
        stroke: upstreamEdges.has(e.id) ? '#0078d4' : '#b3b0ad',
        strokeWidth: upstreamEdges.has(e.id) ? 2 : 1.5,
      },
      animated: upstreamEdges.has(e.id), 
      zIndex: upstreamEdges.has(e.id) ? 10 : 0 
    })));
  }, [edges, setNodes, setEdges]);

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <div className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#ccc" gap={16} />
          <Controls />
        </ReactFlow>
      </div>

      <Sidebar selectedNode={selectedNode} />
    </div>
  );
}