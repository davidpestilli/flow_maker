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
  selectedEdge: Edge | null;
  onNodeSelect: (node: Node | null) => void;
  onEdgeSelect: (edge: Edge | null) => void;
  setUpdateNodeFunc: (func: (nodeId: string, updates: any) => void) => void;
  setUpdateEdgeFunc: (func: (edgeId: string, updates: any) => void) => void;
}

const CriacaoCanvas = ({ 
  selectedNode, 
  selectedEdge, 
  onNodeSelect, 
  onEdgeSelect, 
  setUpdateNodeFunc, 
  setUpdateEdgeFunc 
}: CriacaoCanvasProps) => {
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

  // Atualiza o selectedEdge quando os edges mudam
  useEffect(() => {
    if (selectedEdge) {
      const updatedEdge = edges.find(e => e.id === selectedEdge.id);
      if (updatedEdge && JSON.stringify(updatedEdge) !== JSON.stringify(selectedEdge)) {
        console.log('Syncing selected edge with updated data'); // Debug
        onEdgeSelect(updatedEdge);
      }
    }
  }, [edges, selectedEdge, onEdgeSelect]);

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
            style: { 
              stroke: '#374151', 
              strokeWidth: 2,
              opacity: 1,
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
            // Armazena as propriedades originais como dados do edge
            data: {
              originalStroke: '#374151',
              originalStrokeWidth: 2,
              originalOpacity: 1,
              originalType: 'smoothstep',
              originalAnimated: true,
              originalMarkerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#374151',
              },
              originalLabelStyle: { fill: '#374151' },
            }
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

      // Dados iniciais completos para compatibilidade com o novo editor
      const newNodeData = { 
        // Propriedades básicas (originais)
        label: type,
        text: type, // Texto inicial igual ao tipo
        backgroundColor: "#ffffff",
        borderColor: "#9ca3af",
        
        // Propriedades de texto com valores padrão
        textColor: "#000000",
        fontSize: 14,
        fontFamily: "Inter",
        textAlign: "center",
        isBold: false,
        isItalic: false,
        isStrikethrough: false,
        
        // Propriedades de layout com valores padrão
        nodeWidth: "auto",
        nodeHeight: "auto",
        padding: 16,
        borderWidth: 2,
        borderRadius: 8,
        
        // Propriedades de efeitos com valores padrão
        hasShadow: true,
        shadowOpacity: 0.1,
        nodeOpacity: 1,
        
        // Propriedades de ícones
        selectedIcon: "",
      };

      const newNode: Node = {
        id: `node-${+new Date()}`,
        type: "custom", // IMPORTANTE: usar o tipo custom
        position,
        data: newNodeData,
      };

      console.log('Creating new node with data:', newNodeData); // DEBUG

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
          console.log('CriacaoCanvas: Node updated - Full data:', updatedNode.data); // DEBUG
          return updatedNode;
        }
        return node;
      })
    );
  }, [setNodes]);

  // Função que realmente atualiza os edges no canvas
  const handleUpdateEdge = useCallback((edgeId: string, updates: any) => {
    console.log('CriacaoCanvas: Updating edge', edgeId, 'with:', updates); // Debug
    
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          const updatedEdge = { 
            ...edge, 
            ...updates,
            style: edge.style ? { ...edge.style, ...updates.style } : updates.style,
            // Lidar corretamente com markerEnd e markerStart nulos
            markerEnd: updates.markerEnd === null ? undefined : 
              (updates.markerEnd ? 
                (edge.markerEnd && typeof edge.markerEnd === 'object' && typeof updates.markerEnd === 'object' ? 
                  { ...edge.markerEnd, ...updates.markerEnd } : 
                  updates.markerEnd) 
                : edge.markerEnd),
            markerStart: updates.markerStart === null ? undefined :
              (updates.markerStart ? 
                (edge.markerStart && typeof edge.markerStart === 'object' && typeof updates.markerStart === 'object' ? 
                  { ...edge.markerStart, ...updates.markerStart } : 
                  updates.markerStart) 
                : edge.markerStart),
            // Armazena as propriedades originais como dados do edge
            data: {
              ...edge.data,
              originalStroke: updates.style?.stroke || edge.data?.originalStroke || edge.style?.stroke,
              originalStrokeWidth: updates.style?.strokeWidth || edge.data?.originalStrokeWidth || edge.style?.strokeWidth,
              originalOpacity: updates.style?.opacity || edge.data?.originalOpacity || edge.style?.opacity,
              originalType: updates.type || edge.data?.originalType || edge.type,
              originalAnimated: updates.animated !== undefined ? updates.animated : edge.data?.originalAnimated,
              originalMarkerEnd: updates.markerEnd === null ? null : 
                (updates.markerEnd ? 
                  { ...edge.data?.originalMarkerEnd, ...updates.markerEnd } :
                  edge.data?.originalMarkerEnd),
              originalMarkerStart: updates.markerStart === null ? null :
                (updates.markerStart !== undefined ? 
                  updates.markerStart : 
                  edge.data?.originalMarkerStart),
              originalLabelStyle: updates.labelStyle ? 
                { ...edge.data?.originalLabelStyle, ...updates.labelStyle } :
                edge.data?.originalLabelStyle,
            }
          };
          console.log('CriacaoCanvas: Edge updated:', updatedEdge); // Debug
          return updatedEdge;
        }
        return edge;
      })
    );
  }, [setEdges]);

  // Registra as funções de atualização no App
  useEffect(() => {
    setUpdateNodeFunc(handleUpdateNode);
    setUpdateEdgeFunc(handleUpdateEdge);
  }, [handleUpdateNode, handleUpdateEdge, setUpdateNodeFunc, setUpdateEdgeFunc]);

  // Detecta seleção através do clique no nó
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    console.log('Node clicked:', node); // Debug
    console.log('Node data on click:', node.data); // DEBUG EXTRA
    onNodeSelect(node);
    onEdgeSelect(null); // Desseleciona edge
    
    // Desseleciona todos os edges mas volta para suas propriedades originais
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        selected: false,
        type: edge.data?.originalType || edge.type || 'smoothstep',
        animated: edge.data?.originalAnimated !== undefined ? edge.data.originalAnimated : edge.animated,
        style: {
          ...edge.style,
          // Volta para as propriedades originais armazenadas no data
          stroke: edge.data?.originalStroke || edge.style?.stroke || '#374151',
          strokeWidth: edge.data?.originalStrokeWidth || edge.style?.strokeWidth || 2,
          opacity: edge.data?.originalOpacity || edge.style?.opacity || 1,
        },
        markerEnd: edge.markerEnd ? 
          (typeof edge.markerEnd === 'object' && edge.markerEnd !== null ? {
            ...edge.markerEnd,
            color: edge.data?.originalStroke || edge.style?.stroke || '#374151',
          } : edge.markerEnd)
          : edge.markerEnd,
        markerStart: edge.markerStart ? 
          (typeof edge.markerStart === 'object' && edge.markerStart !== null ? {
            ...edge.markerStart,
            color: edge.data?.originalStroke || edge.style?.stroke || '#374151',
          } : edge.markerStart)
          : edge.markerStart,
        labelStyle: edge.data?.originalLabelStyle || edge.labelStyle || { fill: '#374151' },
      }))
    );
  }, [onNodeSelect, onEdgeSelect, setEdges]);

  // Captura mudanças nos nós incluindo seleção
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    
    // Verifica se houve mudança de seleção
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
    
    // Seleciona o edge clicado
    onEdgeSelect(edge);
    onNodeSelect(null); // Desseleciona nó
    
    // Atualiza o estado dos edges para marcar como selecionado
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        selected: e.id === edge.id,
        // Mantém as propriedades originais para edges não selecionados
        type: e.id === edge.id ? e.type : (e.data?.originalType || e.type || 'smoothstep'),
        animated: e.id === edge.id ? e.animated : (e.data?.originalAnimated !== undefined ? e.data.originalAnimated : e.animated),
        style: {
          ...e.style,
          // Para o edge selecionado, usa azul. Para os outros, volta para propriedades originais
          stroke: e.id === edge.id ? '#3b82f6' : (e.data?.originalStroke || e.style?.stroke || '#374151'),
          strokeWidth: e.id === edge.id ? 4 : (e.data?.originalStrokeWidth || e.style?.strokeWidth || 2),
          opacity: e.id === edge.id ? e.style?.opacity : (e.data?.originalOpacity || e.style?.opacity || 1),
        },
        markerEnd: e.markerEnd ? 
          (typeof e.markerEnd === 'object' ? {
            ...e.markerEnd,
            color: e.id === edge.id ? '#3b82f6' : (e.data?.originalStroke || e.style?.stroke || '#374151'),
          } : e.markerEnd)
          : e.markerEnd,
        markerStart: e.markerStart ? 
          (typeof e.markerStart === 'object' ? {
            ...e.markerStart,
            color: e.id === edge.id ? '#3b82f6' : (e.data?.originalStroke || e.style?.stroke || '#374151'),
          } : e.markerStart)
          : e.markerStart,
        labelStyle: e.id === edge.id ? 
          e.labelStyle : 
          (e.data?.originalLabelStyle || e.labelStyle || { fill: '#374151' }),
      }))
    );
  }, [setEdges, onNodeSelect, onEdgeSelect]);

  // Captura cliques no pano de fundo para desselecionar
  const handlePaneClick = useCallback(() => {
    onNodeSelect(null);
    onEdgeSelect(null);
    
    // Desseleciona todos os edges e volta para suas propriedades originais
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        selected: false,
        type: edge.data?.originalType || edge.type || 'smoothstep',
        animated: edge.data?.originalAnimated !== undefined ? edge.data.originalAnimated : edge.animated,
        style: {
          ...edge.style,
          // Volta para as propriedades originais armazenadas no data
          stroke: edge.data?.originalStroke || edge.style?.stroke || '#374151',
          strokeWidth: edge.data?.originalStrokeWidth || edge.style?.strokeWidth || 2,
          opacity: edge.data?.originalOpacity || edge.style?.opacity || 1,
        },
        markerEnd: edge.markerEnd && typeof edge.markerEnd === 'object' ? {
          ...edge.markerEnd,
          color: edge.data?.originalStroke || edge.style?.stroke || '#374151',
        } : edge.markerEnd,
        markerStart: edge.markerStart && typeof edge.markerStart === 'object' ? {
          ...edge.markerStart,
          color: edge.data?.originalStroke || edge.style?.stroke || '#374151',
        } : edge.markerStart,
        labelStyle: edge.data?.originalLabelStyle || edge.labelStyle || { fill: '#374151' },
      }))
    );
  }, [onNodeSelect, onEdgeSelect, setEdges]);

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
        {/* MiniMap com suporte às novas propriedades de cor */}
        <MiniMap 
          nodeColor={(node) => {
            // Usa a cor de fundo do nó se disponível (nova funcionalidade)
            if (node.data.backgroundColor) {
              return node.data.backgroundColor;
            }
            // Cores padrão por tipo (mantidas para compatibilidade)
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
      
      {/* Instruções melhoradas para o usuário */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md border max-w-xs">
        <h3 className="font-semibold text-sm mb-2 text-gray-800">🎨 Como usar:</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• <strong>Arraste</strong> formas da barra lateral</li>
          <li>• <strong>Clique</strong> para selecionar e editar nós</li>
          <li>• <strong>Clique</strong> nas conexões para editá-las</li>
          <li>• <strong>Arraste</strong> entre pontos azuis para conectar</li>
          <li>• <strong>Delete</strong> para remover selecionados</li>
          <li>• <strong>Use as abas</strong> no painel para personalizar</li>
          <li>• <strong>Templates</strong> rápidos na aba Estilo</li>
          <li>• <strong>Shift+Click</strong> para seleção múltipla</li>
        </ul>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 <strong>Dica:</strong> Use os templates para começar rapidamente!
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente principal exportado (mantido igual)
const Criacao = ({ 
  selectedNode, 
  selectedEdge, 
  onNodeSelect, 
  onEdgeSelect, 
  setUpdateNodeFunc, 
  setUpdateEdgeFunc 
}: CriacaoCanvasProps) => {
  return (
    <div className="flex-1 h-full">
      <ReactFlowProvider>
        <CriacaoCanvas 
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onNodeSelect={onNodeSelect}
          onEdgeSelect={onEdgeSelect}
          setUpdateNodeFunc={setUpdateNodeFunc}
          setUpdateEdgeFunc={setUpdateEdgeFunc}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default Criacao;