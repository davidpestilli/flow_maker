import React, { useCallback, useMemo } from "react";
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
  Position,
  ConnectionMode,
} from "reactflow";
import type { Edge, Node, Connection } from "reactflow";
import CustomNode from "../components/CustomNode";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const CriacaoCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project } = useReactFlow();

  // Memoizar nodeTypes para evitar recriação em cada renderização
  const nodeTypes = useMemo(
    () => ({
      custom: CustomNode,
    }),
    []
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // Adicionar edge com estilo personalizado
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep", // Tipo de linha suave
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
        id: `${+new Date()}`,
        type: "custom",
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
        connectionMode={ConnectionMode.Loose}
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: true,
          type: 'smoothstep',
        }}
        fitView
      >
        <MiniMap 
          nodeColor={(node) => {
            switch (node.data.label) {
              case 'rectangle': return '#3b82f6';
              case 'ellipse': return '#10b981';
              case 'diamond': return '#f59e0b';
              default: return '#6b7280';
            }
          }}
        />
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