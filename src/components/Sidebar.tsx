import React, { useState, useEffect } from "react";
import type { Node, Edge } from "reactflow";

interface SidebarProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
  onUpdateEdge: (edgeId: string, updates: any) => void;
}

const Sidebar = ({ selectedNode, selectedEdge, onUpdateNode, onUpdateEdge }: SidebarProps) => {
  // Estados para nós
  const [nodeText, setNodeText] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [borderColor, setBorderColor] = useState("#9ca3af");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  // Estados para edges
  const [edgeLabel, setEdgeLabel] = useState("");
  const [edgeColor, setEdgeColor] = useState("#374151");
  const [edgeWidth, setEdgeWidth] = useState(2);
  const [edgeStyle, setEdgeStyle] = useState("solid");

  // Atualiza os valores quando um novo nó é selecionado
  useEffect(() => {
    if (selectedNode) {
      setNodeText(selectedNode.data.text || selectedNode.data.label || "");
      setBackgroundColor(selectedNode.data.backgroundColor || "#ffffff");
      setBorderColor(selectedNode.data.borderColor || "#9ca3af");
      setIsBold(selectedNode.data.isBold || false);
      setIsItalic(selectedNode.data.isItalic || false);
      setIsStrikethrough(selectedNode.data.isStrikethrough || false);
    }
  }, [selectedNode]);

  // Atualiza os valores quando um novo edge é selecionado
  useEffect(() => {
    if (selectedEdge) {
      setEdgeLabel(`${selectedEdge.label || ""}`);
      setEdgeColor(selectedEdge.style?.stroke || "#374151");
      setEdgeWidth(typeof selectedEdge.style?.strokeWidth === 'number' ? selectedEdge.style.strokeWidth : parseInt(String(selectedEdge.style?.strokeWidth || 2), 10));
      setEdgeStyle(selectedEdge.style?.strokeDasharray ? "dashed" : "solid");
    }
  }, [selectedEdge]);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Handlers para nós
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setNodeText(newText);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { text: newText });
    }
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBackgroundColor(newColor);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { backgroundColor: newColor });
    }
  };

  const handleBorderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBorderColor(newColor);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { borderColor: newColor });
    }
  };

  const handleBoldToggle = () => {
    const newBold = !isBold;
    setIsBold(newBold);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { isBold: newBold });
    }
  };

  const handleItalicToggle = () => {
    const newItalic = !isItalic;
    setIsItalic(newItalic);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { isItalic: newItalic });
    }
  };

  const handleStrikethroughToggle = () => {
    const newStrikethrough = !isStrikethrough;
    setIsStrikethrough(newStrikethrough);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { isStrikethrough: newStrikethrough });
    }
  };

  // Handlers para edges
  const handleEdgeLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setEdgeLabel(newLabel);
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, { label: newLabel });
    }
  };

  const handleEdgeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setEdgeColor(newColor);
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, { 
        style: { stroke: newColor },
        markerEnd: { color: newColor }
      });
    }
  };

  const handleEdgeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    setEdgeWidth(newWidth);
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, { 
        style: { strokeWidth: newWidth }
      });
    }
  };

  const handleEdgeStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyle = e.target.value;
    setEdgeStyle(newStyle);
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, { 
        style: { 
          strokeDasharray: newStyle === "dashed" ? "5,5" : "none"
        }
      });
    }
  };

  // Cores predefinidas comuns
  const presetColors = [
    "#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db",
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
    "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
  ];

  return (
    <aside className="w-64 bg-gray-100 p-3 border-r border-gray-300 h-full overflow-y-auto">
      {/* Seção de Formas */}
      <div className="mb-6">
        <p className="font-semibold mb-3 text-gray-800">Formas</p>
        
        <div
          className="p-3 bg-white border rounded mb-2 cursor-move text-center hover:bg-gray-50 transition-colors"
          onDragStart={(e) => onDragStart(e, "rectangle")}
          draggable
        >
          Retângulo
        </div>

        <div
          className="p-3 bg-white border rounded mb-2 cursor-move text-center hover:bg-gray-50 transition-colors"
          onDragStart={(e) => onDragStart(e, "ellipse")}
          draggable
        >
          Elipse
        </div>

        <div
          className="p-3 bg-white border rounded mb-2 cursor-move text-center hover:bg-gray-50 transition-colors"
          onDragStart={(e) => onDragStart(e, "circle")}
          draggable
        >
          Círculo
        </div>

        <div
          className="p-3 bg-white border rounded mb-2 cursor-move text-center hover:bg-gray-50 transition-colors"
          onDragStart={(e) => onDragStart(e, "triangle")}
          draggable
        >
          Triângulo
        </div>
      </div>

      {/* Seção de Edição */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-gray-800">
            {selectedNode ? "Editar Nó" : selectedEdge ? "Editar Conexão" : "Selecione um elemento"}
          </p>
          {(selectedNode || selectedEdge) && (
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Elemento selecionado"></div>
          )}
        </div>
        
        {/* Edição de Nós */}
        {selectedNode && (
          <div className="space-y-4">
            {/* Debug Info */}
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border-l-2 border-blue-400">
              <strong>Nó:</strong> {selectedNode.id}
            </div>
            
            {/* Edição de Texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto
              </label>
              <input
                type="text"
                value={nodeText}
                onChange={handleTextChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o texto..."
              />
            </div>

            {/* Formatação de Texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formatação
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleBoldToggle}
                  className={`px-3 py-2 text-sm font-bold border rounded transition-colors ${
                    isBold 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Negrito"
                >
                  <strong>B</strong>
                </button>
                <button
                  onClick={handleItalicToggle}
                  className={`px-3 py-2 text-sm italic border rounded transition-colors ${
                    isItalic 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Itálico"
                >
                  <em>I</em>
                </button>
                <button
                  onClick={handleStrikethroughToggle}
                  className={`px-3 py-2 text-sm border rounded transition-colors ${
                    isStrikethrough 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Sublinhado"
                >
                  <span style={{ textDecoration: 'underline' }}>U</span>
                </button>
              </div>
            </div>

            {/* Cor de Fundo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor de Fundo
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={handleBackgroundColorChange}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={handleBackgroundColorChange}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                />
              </div>
              
              {/* Cores Predefinidas */}
              <div className="grid grid-cols-6 gap-1">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setBackgroundColor(color);
                      if (selectedNode) {
                        onUpdateNode(selectedNode.id, { backgroundColor: color });
                      }
                    }}
                    className="w-6 h-6 border border-gray-300 rounded cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Cor da Borda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor da Borda
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="color"
                  value={borderColor}
                  onChange={handleBorderColorChange}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={borderColor}
                  onChange={handleBorderColorChange}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                />
              </div>
              
              {/* Cores Predefinidas */}
              <div className="grid grid-cols-6 gap-1">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setBorderColor(color);
                      if (selectedNode) {
                        onUpdateNode(selectedNode.id, { borderColor: color });
                      }
                    }}
                    className="w-6 h-6 border border-gray-300 rounded cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Informações do Nó */}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                <strong>ID:</strong> {selectedNode.id}
              </p>
              <p className="text-xs text-gray-500">
                <strong>Tipo:</strong> {selectedNode.data.label}
              </p>
            </div>
          </div>
        )}

        {/* Edição de Edges */}
        {selectedEdge && !selectedNode && (
          <div className="space-y-4">
            {/* Debug Info */}
            <div className="text-xs text-gray-500 bg-green-50 p-2 rounded border-l-2 border-green-400">
              <strong>Conexão:</strong> {selectedEdge.id}
            </div>
            
            {/* Label da Conexão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto da Conexão
              </label>
              <input
                type="text"
                value={edgeLabel}
                onChange={handleEdgeLabelChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o texto..."
              />
            </div>

            {/* Cor da Linha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor da Linha
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="color"
                  value={edgeColor}
                  onChange={handleEdgeColorChange}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={edgeColor}
                  onChange={handleEdgeColorChange}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                />
              </div>
              
              {/* Cores Predefinidas para Edges */}
              <div className="grid grid-cols-6 gap-1">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setEdgeColor(color);
                      if (selectedEdge) {
                        onUpdateEdge(selectedEdge.id, { 
                          style: { stroke: color },
                          markerEnd: { color: color }
                        });
                      }
                    }}
                    className="w-6 h-6 border border-gray-300 rounded cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Espessura da Linha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Espessura: {edgeWidth}px
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={edgeWidth}
                onChange={handleEdgeWidthChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1px</span>
                <span>8px</span>
              </div>
            </div>

            {/* Estilo da Linha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estilo da Linha
              </label>
              <select
                value={edgeStyle}
                onChange={handleEdgeStyleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="solid">Sólida</option>
                <option value="dashed">Tracejada</option>
              </select>
            </div>

            {/* Preview da Linha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="bg-white p-4 border rounded-md">
                <svg width="100%" height="40">
                  <line
                    x1="10"
                    y1="20"
                    x2="90%"
                    y2="20"
                    stroke={edgeColor}
                    strokeWidth={edgeWidth}
                    strokeDasharray={edgeStyle === "dashed" ? "5,5" : "none"}
                  />
                  <polygon
                    points="85,15 95,20 85,25"
                    fill={edgeColor}
                  />
                </svg>
              </div>
            </div>

            {/* Informações da Conexão */}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                <strong>ID:</strong> {selectedEdge.id}
              </p>
              <p className="text-xs text-gray-500">
                <strong>De:</strong> {selectedEdge.source} → <strong>Para:</strong> {selectedEdge.target}
              </p>
            </div>
          </div>
        )}

        {/* Quando nada está selecionado */}
        {!selectedNode && !selectedEdge && (
          <p className="text-sm text-gray-500">
            Clique em um nó ou conexão para editá-lo.
          </p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;