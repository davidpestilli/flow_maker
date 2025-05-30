import React, { useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionMode,
} from "reactflow";
import type { Edge, Node, Connection } from "reactflow";
import CustomNode from "../components/CustomNode";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Definir nodeTypes fora do componente para evitar recriação
const nodeTypes = {
  custom: CustomNode,
};

const CriacaoCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project } = useReactFlow();

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // INVERTER a direção para que seja intuitiva:
      // Se você arrasta de B para A, a seta deve apontar de B para A
      const correctedParams = {
        ...params,
        source: params.target,    // Inverter source
        target: params.source,    // Inverter target
        sourceHandle: params.targetHandle,  // Inverter handles também
        targetHandle: params.sourceHandle,
      };

      // Adicionar edge com estilo personalizado e direção corrigida
      setEdges((eds) =>
        addEdge(
          {
            ...correctedParams,
            type: 'smoothstep' as const, // Tipo de linha suave
            animated: true, // Adiciona animação à linha
            style: { stroke: '#374151', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#374151',
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node = {
        id: `node-${+new Date()}`,
        type: "custom", // Usando o tipo custom
        position,
        data: { label: type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes} // IMPORTANTE: Registrar os nodeTypes
        connectionMode={ConnectionMode.Loose}
        connectOnClick={false}
        elementsSelectable={true}
        nodesDraggable={true}
        nodesConnectable={true}
        edgesUpdatable={true}
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: true,
          type: 'smoothstep' as const,
        }}
        fitView
      >
      <MiniMap 
        nodeColor={(node) => {
          switch (node.data.label) {
            case 'rectangle': return '#3b82f6'; // azul
            case 'ellipse': return '#10b981';   // verde
            case 'circle': return '#6366f1';    // roxo
            case 'triangle': return '#f59e0b';  // laranja
            default: return '#6b7280';          // cinza
          }
        }}
      />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

const Criacao = () => (
  <div className="flex-1 h-full">
    <ReactFlowProvider>
      <CriacaoCanvas />
    </ReactFlowProvider>
  </div>
);

export default Criacao;