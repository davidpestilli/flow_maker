import React, { useState, useEffect } from "react";
import type { Node, Edge } from "reactflow";
import { MarkerType } from "reactflow";

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
  const [edgeOpacity, setEdgeOpacity] = useState(1);
  const [edgeType, setEdgeType] = useState("smoothstep");
  const [edgeAnimated, setEdgeAnimated] = useState(true);
  const [edgeLabelColor, setEdgeLabelColor] = useState("#374151");
  const [arrowType, setArrowType] = useState<MarkerType | "none">(MarkerType.ArrowClosed);
  const [arrowSize, setArrowSize] = useState(20);
  const [hasStartArrow, setHasStartArrow] = useState(false);

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
      setEdgeLabel(selectedEdge.label ? String(selectedEdge.label) : "");
      setEdgeColor(selectedEdge.style?.stroke || "#374151");
      setEdgeWidth(typeof selectedEdge.style?.strokeWidth === 'number' ? selectedEdge.style.strokeWidth : parseInt(selectedEdge.style?.strokeWidth as string) || 2);
      setEdgeStyle(selectedEdge.style?.strokeDasharray ? 
        (selectedEdge.style.strokeDasharray === "2,2" ? "dotted" : "dashed") : "solid");
      setEdgeOpacity(typeof selectedEdge.style?.opacity === 'number' ? selectedEdge.style.opacity : parseFloat(selectedEdge.style?.opacity as string) || 1);
      setEdgeType(selectedEdge.type || "smoothstep");
      setEdgeAnimated(selectedEdge.animated !== false);
      setEdgeLabelColor(selectedEdge.labelStyle?.fill || "#374151");
      
      // Corrigir o tipo de seta - verificar se existe markerEnd
      if (selectedEdge.markerEnd && typeof selectedEdge.markerEnd === 'object' && selectedEdge.markerEnd?.type) {
        setArrowType(selectedEdge.markerEnd.type);
      } else {
        setArrowType("none"); // Se não tem markerEnd, é "sem seta"
      }
      
      setArrowSize(typeof selectedEdge.markerEnd === 'object' && selectedEdge.markerEnd?.width ? selectedEdge.markerEnd.width : 20);
      setHasStartArrow(!!selectedEdge.markerStart);
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
      const updates: any = { 
        style: { stroke: newColor }
      };
      
      // Só adiciona markerEnd se não for "sem seta"
      if (arrowType !== "none") {
        updates.markerEnd = { 
          type: arrowType,
          color: newColor 
        };
      }
      
      // Se tem seta no início, atualiza também
      if (hasStartArrow && arrowType !== "none") {
        updates.markerStart = { 
          type: arrowType,
          color: newColor 
        };
      }
      
      onUpdateEdge(selectedEdge.id, updates);
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
      let strokeDasharray = "none";
      if (newStyle === "dashed") strokeDasharray = "5,5";
      if (newStyle === "dotted") strokeDasharray = "2,2";
      
      onUpdateEdge(selectedEdge.id, { 
        style: { 
          strokeDasharray: strokeDasharray === "none" ? undefined : strokeDasharray
        }
      });
    }
  };

  const handleEdgeOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(e.target.value);
    setEdgeOpacity(newOpacity);
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, { 
        style: { opacity: newOpacity }
      });
    }
  };

  const handleEdgeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setEdgeType(newType);
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, { 
        type: newType
      });
    }
  };

  const handleEdgeAnimatedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnimated = e.target.checked;
    setEdgeAnimated(newAnimated);
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, { 
        animated: newAnimated
      });
    }
  };

  const handleEdgeLabelColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setEdgeLabelColor(newColor);
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, { 
        labelStyle: { fill: newColor }
      });
    }
  };

  const handleArrowTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as MarkerType | "none";
    setArrowType(newType);
    if (selectedEdge) {
      if (newType === "none") {
        // Remove todas as setas explicitamente
        console.log('Removing arrows - setting to null'); // Debug
        onUpdateEdge(selectedEdge.id, { 
          markerEnd: null,
          markerStart: null
        });
        setHasStartArrow(false);
      } else {
        // Adiciona seta no fim
        const updates: any = {
          markerEnd: {
            type: newType,
            width: arrowSize,
            height: arrowSize,
            color: edgeColor
          }
        };
        
        // Se tinha seta no início, mantém
        if (hasStartArrow) {
          updates.markerStart = {
            type: newType,
            width: arrowSize,
            height: arrowSize,
            color: edgeColor
          };
        }
        
        onUpdateEdge(selectedEdge.id, updates);
      }
    }
  };

  const handleArrowSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setArrowSize(newSize);
    if (selectedEdge && arrowType !== "none") {
      const updates: any = {
        markerEnd: { 
          type: arrowType,
          width: newSize,
          height: newSize,
          color: edgeColor
        }
      };
      
      if (hasStartArrow) {
        updates.markerStart = {
          type: arrowType,
          width: newSize,
          height: newSize,
          color: edgeColor
        };
      }
      
      onUpdateEdge(selectedEdge.id, updates);
    }
  };

  const handleStartArrowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hasStart = e.target.checked;
    setHasStartArrow(hasStart);
    if (selectedEdge) {
      if (arrowType === "none") {
        // Se não tem seta no fim, não pode ter no início
        setHasStartArrow(false);
        return;
      }
      
      onUpdateEdge(selectedEdge.id, { 
        markerStart: hasStart ? {
          type: arrowType,
          width: arrowSize,
          height: arrowSize,
          color: edgeColor
        } : null
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

            {/* Cor do Texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor do Texto
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="color"
                  value={edgeLabelColor}
                  onChange={handleEdgeLabelColorChange}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={edgeLabelColor}
                  onChange={handleEdgeLabelColorChange}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                />
              </div>
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
                        const updates: any = { 
                          style: { stroke: color }
                        };
                        
                        if (arrowType !== "none") {
                          updates.markerEnd = { color: color };
                          if (hasStartArrow) {
                            updates.markerStart = { color: color };
                          }
                        }
                        
                        onUpdateEdge(selectedEdge.id, updates);
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
                <option value="dotted">Pontilhada</option>
              </select>
            </div>

            {/* Opacidade da Linha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opacidade: {Math.round(edgeOpacity * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={edgeOpacity}
                onChange={handleEdgeOpacityChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Tipo de Conexão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Conexão
              </label>
              <select
                value={edgeType}
                onChange={handleEdgeTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="smoothstep">Suave (SmoothStep)</option>
                <option value="straight">Reta</option>
                <option value="step">Degraus</option>
                <option value="default">Bezier</option>
                <option value="simplebezier">Bezier Simples</option>
              </select>
            </div>

            {/* Animação */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={edgeAnimated}
                  onChange={handleEdgeAnimatedChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Animação da linha
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Adiciona movimento visual à conexão
              </p>
            </div>

            {/* Tipo de Seta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Seta
              </label>
              <select
                value={arrowType}
                onChange={handleArrowTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={MarkerType.ArrowClosed}>Seta Fechada</option>
                <option value="none">Sem Seta</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                ReactFlow suporta principalmente setas fechadas
              </p>
            </div>

            {/* Tamanho da Seta */}
            {arrowType !== "none" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamanho da Seta: {arrowSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={arrowSize}
                  onChange={handleArrowSizeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10px</span>
                  <span>40px</span>
                </div>
              </div>
            )}

            {/* Seta no Início */}
            {arrowType !== "none" && (
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasStartArrow}
                    onChange={handleStartArrowChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Seta dupla (início e fim)
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Adiciona seta no início da conexão
                </p>
              </div>
            )}

            {/* Preview da Linha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="bg-white p-4 border rounded-md">
                <svg width="100%" height="60">
                  <defs>
                    {/* Definir marcadores para preview */}
                    {arrowType === MarkerType.ArrowClosed && (
                      <marker
                        id="arrowEnd"
                        markerWidth={arrowSize}
                        markerHeight={arrowSize}
                        refX={arrowSize - 2}
                        refY={arrowSize / 2}
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <polygon
                          points={`0,0 0,${arrowSize} ${arrowSize},${arrowSize / 2}`}
                          fill={edgeColor}
                          fillOpacity={edgeOpacity}
                        />
                      </marker>
                    )}
                    {hasStartArrow && arrowType === MarkerType.ArrowClosed && (
                      <marker
                        id="arrowStart"
                        markerWidth={arrowSize}
                        markerHeight={arrowSize}
                        refX="2"
                        refY={arrowSize / 2}
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <polygon
                          points={`${arrowSize},0 ${arrowSize},${arrowSize} 0,${arrowSize / 2}`}
                          fill={edgeColor}
                          fillOpacity={edgeOpacity}
                        />
                      </marker>
                    )}
                  </defs>
                  
                  <line
                    x1="15"
                    y1="30"
                    x2="85%"
                    y2="30"
                    stroke={edgeColor}
                    strokeWidth={edgeWidth}
                    strokeOpacity={edgeOpacity}
                    strokeDasharray={
                      edgeStyle === "dashed" ? "5,5" : 
                      edgeStyle === "dotted" ? "2,2" : "none"
                    }
                    markerEnd={arrowType !== "none" ? "url(#arrowEnd)" : "none"}
                    markerStart={hasStartArrow && arrowType !== "none" ? "url(#arrowStart)" : "none"}
                  />
                  
                  {edgeLabel && (
                    <text
                      x="50%"
                      y="20"
                      textAnchor="middle"
                      fontSize="12"
                      fill={edgeLabelColor}
                      fillOpacity={edgeOpacity}
                    >
                      {edgeLabel}
                    </text>
                  )}
                  
                  {edgeAnimated && (
                    <circle
                      cx="15"
                      cy="30"
                      r="2"
                      fill={edgeColor}
                      fillOpacity={edgeOpacity}
                    >
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 75,0; 0,0"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </svg>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {edgeType === "smoothstep" && "Linha com curvas suaves"}
                  {edgeType === "straight" && "Linha reta"}
                  {edgeType === "step" && "Linha em degraus"}
                  {edgeType === "default" && "Curva Bezier"}
                  {edgeType === "simplebezier" && "Curva Bezier simples"}
                </div>
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