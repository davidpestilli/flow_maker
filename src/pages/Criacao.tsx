import React, { useCallback, useEffect } from "react";
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
import type { Edge, Node, Connection, NodeChange } from "reactflow";
import CustomNode from "../components/CustomNode";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Definir nodeTypes fora do componente para evitar recriação
const nodeTypes = {
  custom: CustomNode,
};

interface CriacaoCanvasProps {
  selectedNode: Node | null;
  onNodeSelect: (node: Node | null) => void;
  setUpdateNodeFunc: (func: (nodeId: string, updates: any) => void) => void;
}

const CriacaoCanvas = ({ selectedNode, onNodeSelect, setUpdateNodeFunc }: CriacaoCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project } = useReactFlow();

  // Atualiza o selectedNode quando os nodes mudam
  useEffect(() => {
    if (selectedNode) {
      const updatedNode = nodes.find(n => n.id === selectedNode.id);
      if (updatedNode && JSON.stringify(updatedNode.data) !== JSON.stringify(selectedNode.data)) {
        console.log('Syncing selected node with updated data'); // Debug
        onNodeSelect(updatedNode);
      }
    }
  }, [nodes, selectedNode, onNodeSelect]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // INVERTER a direção para que seja intuitiva:
      // Se você arrasta de B para A, a seta deve apontar de B para A
      const correctedParams = {
        ...(typeof params === 'object' ? params : {}),
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
            style: { 
              stroke: '#374151', 
              strokeWidth: 2,
              cursor: 'pointer' // Indica que é clicável
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#374151',
            },
            // Adiciona ID único para facilitar seleção
            id: `edge-${+new Date()}`,
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
        type: "custom", // IMPORTANTE: usar o tipo custom
        position,
        data: { 
          label: type,
          text: type, // Texto inicial igual ao tipo
          backgroundColor: "#ffffff",
          borderColor: "#9ca3af"
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Função que realmente atualiza os nodes no canvas
  const handleUpdateNode = useCallback((nodeId: string, updates: any) => {
    console.log('CriacaoCanvas: Updating node', nodeId, 'with:', updates); // Debug
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = { ...node, data: { ...node.data, ...updates } };
          console.log('CriacaoCanvas: Node updated:', updatedNode); // Debug
          return updatedNode;
        }
        return node;
      })
    );
  }, [setNodes]);

  // Registra a função de atualização no App
  useEffect(() => {
    setUpdateNodeFunc(handleUpdateNode);
  }, [handleUpdateNode, setUpdateNodeFunc]);

  // Detecta seleção através do clique no nó
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    console.log('Node clicked:', node); // Debug
    onNodeSelect(node);
    
    // Desseleciona todos os edges quando um nó é selecionado
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        selected: false,
        style: {
          ...edge.style,
          stroke: '#374151',
          strokeWidth: 2,
        },
        markerEnd: edge.markerEnd && typeof edge.markerEnd === 'object' ? {
          ...(edge.markerEnd as any),
          color: '#374151',
        } : edge.markerEnd,
      }))
    );
  }, [onNodeSelect, setEdges]);

  // Captura mudanças nos nós incluindo seleção
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    
    // Verifica se houve mudança de seleção usando useEffect será melhor
    const selectionChange = changes.find(change => change.type === 'select');
    if (selectionChange) {
      if (selectionChange.selected) {
        // Busca o nó nos nodes atuais
        const selectedNode = nodes.find(n => n.id === selectionChange.id);
        if (selectedNode) {
          console.log('Node selected:', selectedNode); // Debug
          onNodeSelect(selectedNode);
        }
      } else {
        console.log('Node deselected'); // Debug
        onNodeSelect(null);
      }
    }
  }, [onNodesChange, nodes, onNodeSelect]);

  // Handler para cliques em edges
  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    console.log('Edge clicked:', edge); // Debug
    
    // Atualiza o estado dos edges para marcar como selecionado
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        selected: e.id === edge.id, // Apenas o edge clicado fica selecionado
        style: {
          ...e.style,
          stroke: e.id === edge.id ? '#3b82f6' : '#374151',
          strokeWidth: e.id === edge.id ? 4 : 2,
        },
        markerEnd: e.markerEnd && typeof e.markerEnd === 'object' ? {
          ...(e.markerEnd as any),
          color: e.id === edge.id ? '#3b82f6' : '#374151',
        } : e.markerEnd,
      }))
    );

    // Desseleciona qualquer nó selecionado
    onNodeSelect(null);
  }, [setEdges, onNodeSelect]);

  // Captura cliques no pano de fundo para desselecionar
  const handlePaneClick = useCallback(() => {
    onNodeSelect(null);
    
    // Desseleciona todos os edges também
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        selected: false,
        style: {
          ...edge.style,
          stroke: '#374151',
          strokeWidth: 2,
        },
        markerEnd: edge.markerEnd && typeof edge.markerEnd === 'object' ? {
          ...(edge.markerEnd as any),
          color: '#374151',
        } : edge.markerEnd,
      }))
    );
  }, [onNodeSelect, setEdges]);

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaneClick={handlePaneClick}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick} // Adiciona handler para cliques em edges
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
          style: { cursor: 'pointer' }, // Mostra que edges são clicáveis
        }}
        selectNodesOnDrag={false} // Evita seleção acidental ao arrastar
        multiSelectionKeyCode="Shift" // Permite seleção múltipla com Shift
        deleteKeyCode="Delete" // Permite deletar com Delete
        fitView
      >
        <MiniMap 
          nodeColor={(node) => {
            // Usa a cor de fundo do nó se disponível
            if (node.data.backgroundColor) {
              return node.data.backgroundColor;
            }
            // Cores padrão por tipo
            switch (node.data.label) {
              case 'rectangle': return '#3b82f6'; // azul
              case 'ellipse': return '#10b981';   // verde
              case 'circle': return '#6366f1';    // roxo
              case 'triangle': return '#f59e0b';  // laranja
              default: return '#6b7280';          // cinza
            }
          }}
          nodeStrokeWidth={3}
          maskColor="rgb(240, 240, 240, 0.6)"
        />
        <Controls 
          showInteractive={false} // Remove o botão de interação
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={12} 
          size={1} 
          color="#e5e7eb"
        />
      </ReactFlow>
      
      {/* Instruções para o usuário */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md border max-w-xs">
        <h3 className="font-semibold text-sm mb-2">Como usar:</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Arraste formas da barra lateral</li>
          <li>• Clique para selecionar e editar nós</li>
          <li>• Clique nas conexões para selecioná-las</li>
          <li>• Arraste entre pontos azuis para conectar</li>
          <li>• Delete para remover selecionados</li>
          <li>• Use o painel lateral para personalizar</li>
        </ul>
      </div>
    </div>
  );
};

const Criacao = ({ selectedNode, onNodeSelect, setUpdateNodeFunc }: CriacaoCanvasProps) => {
  return (
    <div className="flex-1 h-full">
      <ReactFlowProvider>
        <CriacaoCanvas 
          selectedNode={selectedNode}
          onNodeSelect={onNodeSelect}
          setUpdateNodeFunc={setUpdateNodeFunc}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default Criacao;