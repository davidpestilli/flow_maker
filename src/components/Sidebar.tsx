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
  // Estados para nós - Texto e Tipografia
  const [nodeText, setNodeText] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [textAlign, setTextAlign] = useState("center");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [textColor, setTextColor] = useState("#000000");

  // Estados para nós - Cores e Estilo
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [borderColor, setBorderColor] = useState("#9ca3af");
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderRadius, setBorderRadius] = useState(8);

  // Estados para nós - Layout e Dimensões
  const [nodeWidth, setNodeWidth] = useState("auto");
  const [nodeHeight, setNodeHeight] = useState("auto");
  const [padding, setPadding] = useState(16);

  // Estados para nós - Efeitos
  const [hasShadow, setHasShadow] = useState(true);
  const [shadowOpacity, setShadowOpacity] = useState(0.1);
  const [nodeOpacity, setNodeOpacity] = useState(1);

  // Estados para nós - Ícones
  const [selectedIcon, setSelectedIcon] = useState("");

  // Estados para abas
  const [activeTab, setActiveTab] = useState("style");

  // Estados para edges (mantidos do código original)
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

  // Presets de nós
  const nodePresets = [
    { name: "Processo", bg: "#3b82f6", border: "#1d4ed8", text: "#ffffff" },
    { name: "Decisão", bg: "#f59e0b", border: "#d97706", text: "#ffffff" },
    { name: "Início/Fim", bg: "#10b981", border: "#059669", text: "#ffffff" },
    { name: "Dados", bg: "#8b5cf6", border: "#7c3aed", text: "#ffffff" },
    { name: "Documento", bg: "#ef4444", border: "#dc2626", text: "#ffffff" },
    { name: "Banco de Dados", bg: "#06b6d4", border: "#0891b2", text: "#ffffff" },
  ];

  // Ícones comuns
  const commonIcons = ["📊", "💡", "⚙️", "📈", "🎯", "✓", "⚠️", "🚀", "📋", "🔄", "⭐", "🔒", "📁", "🌐", "💬", "📞"];

  // Cores predefinidas
  const presetColors = [
    "#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#374151", "#000000",
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
    "#fef3c7", "#dbeafe", "#dcfce7", "#fce7f3", "#e0e7ff", "#f3e8ff", "#cffafe", "#ecfdf5"
  ];

  // Atualiza os valores quando um novo nó é selecionado
  useEffect(() => {
    if (selectedNode) {
      setNodeText(selectedNode.data.text || selectedNode.data.label || "");
      setBackgroundColor(selectedNode.data.backgroundColor || "#ffffff");
      setBorderColor(selectedNode.data.borderColor || "#9ca3af");
      setBorderWidth(selectedNode.data.borderWidth || 2);
      setBorderRadius(selectedNode.data.borderRadius || 8);
      setIsBold(selectedNode.data.isBold || false);
      setIsItalic(selectedNode.data.isItalic || false);
      setIsStrikethrough(selectedNode.data.isStrikethrough || false);
      setTextColor(selectedNode.data.textColor || "#000000");
      setFontSize(selectedNode.data.fontSize || 14);
      setFontFamily(selectedNode.data.fontFamily || "Inter");
      setTextAlign(selectedNode.data.textAlign || "center");
      setNodeWidth(selectedNode.data.nodeWidth || "auto");
      setNodeHeight(selectedNode.data.nodeHeight || "auto");
      setPadding(selectedNode.data.padding || 16);
      setHasShadow(selectedNode.data.hasShadow !== false);
      setShadowOpacity(selectedNode.data.shadowOpacity || 0.1);
      setNodeOpacity(selectedNode.data.nodeOpacity || 1);
      setSelectedIcon(selectedNode.data.selectedIcon || "");
    }
  }, [selectedNode]);

  // Atualiza os valores quando um novo edge é selecionado (mantido do código original)
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
      
      if (selectedEdge.markerEnd && typeof selectedEdge.markerEnd === 'object' && selectedEdge.markerEnd?.type) {
        setArrowType(selectedEdge.markerEnd.type);
      } else {
        setArrowType("none");
      }
      
      setArrowSize(typeof selectedEdge.markerEnd === 'object' && selectedEdge.markerEnd?.width ? selectedEdge.markerEnd.width : 20);
      setHasStartArrow(!!selectedEdge.markerStart);
    }
  }, [selectedEdge]);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Função para aplicar preset
  const applyPreset = (preset: any) => {
    setBackgroundColor(preset.bg);
    setBorderColor(preset.border);
    setTextColor(preset.text);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        backgroundColor: preset.bg,
        borderColor: preset.border,
        textColor: preset.text,
      });
    }
  };

  // Função para atualizar nó com todos os dados
  const updateNodeData = (updates: any) => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, updates);
    }
  };

  // Handlers para nós - Texto
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setNodeText(newText);
    updateNodeData({ text: newText });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    updateNodeData({ fontSize: newSize });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFamily = e.target.value;
    setFontFamily(newFamily);
    updateNodeData({ fontFamily: newFamily });
  };

  const handleTextAlignChange = (align: string) => {
    setTextAlign(align);
    updateNodeData({ textAlign: align });
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setTextColor(newColor);
    updateNodeData({ textColor: newColor });
  };

  const handleBoldToggle = () => {
    const newBold = !isBold;
    setIsBold(newBold);
    updateNodeData({ isBold: newBold });
  };

  const handleItalicToggle = () => {
    const newItalic = !isItalic;
    setIsItalic(newItalic);
    updateNodeData({ isItalic: newItalic });
  };

  const handleStrikethroughToggle = () => {
    const newStrikethrough = !isStrikethrough;
    setIsStrikethrough(newStrikethrough);
    updateNodeData({ isStrikethrough: newStrikethrough });
  };

  // Handlers para nós - Cores e Estilo
  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBackgroundColor(newColor);
    updateNodeData({ backgroundColor: newColor });
  };

  const handleBorderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBorderColor(newColor);
    updateNodeData({ borderColor: newColor });
  };

  const handleBorderWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    setBorderWidth(newWidth);
    updateNodeData({ borderWidth: newWidth });
  };

  const handleBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseInt(e.target.value);
    setBorderRadius(newRadius);
    updateNodeData({ borderRadius: newRadius });
  };

  // Handlers para nós - Layout
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value || "auto";
    setNodeWidth(newWidth);
    updateNodeData({ nodeWidth: newWidth });
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value || "auto";
    setNodeHeight(newHeight);
    updateNodeData({ nodeHeight: newHeight });
  };

  const handlePaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPadding = parseInt(e.target.value);
    setPadding(newPadding);
    updateNodeData({ padding: newPadding });
  };

  // Handlers para nós - Efeitos
  const handleShadowToggle = () => {
    const newShadow = !hasShadow;
    setHasShadow(newShadow);
    updateNodeData({ hasShadow: newShadow });
  };

  const handleShadowOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(e.target.value);
    setShadowOpacity(newOpacity);
    updateNodeData({ shadowOpacity: newOpacity });
  };

  const handleNodeOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(e.target.value);
    setNodeOpacity(newOpacity);
    updateNodeData({ nodeOpacity: newOpacity });
  };

  // Handlers para ícones
  const handleIconChange = (icon: string) => {
    setSelectedIcon(icon);
    updateNodeData({ selectedIcon: icon });
  };

  // Handlers para edges (mantidos do código original)
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
      
      if (arrowType !== "none") {
        updates.markerEnd = { 
          type: arrowType,
          color: newColor 
        };
      }
      
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
        onUpdateEdge(selectedEdge.id, { 
          markerEnd: null,
          markerStart: null
        });
        setHasStartArrow(false);
      } else {
        const updates: any = {
          markerEnd: {
            type: newType,
            width: arrowSize,
            height: arrowSize,
            color: edgeColor
          }
        };
        
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

  // Componente de abas
  const TabButton = ({ id, label, icon, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`py-2 px-3 text-xs font-medium border-b-2 transition-colors ${
        isActive
          ? 'border-blue-500 text-blue-600 bg-blue-50'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className="mr-1">{icon}</span>
      {label}
    </button>
  );

  // Componente de palete de cores
  const ColorPalette = ({ currentColor, onColorChange, label }: any) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="color"
          value={currentColor}
          onChange={onColorChange}
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={currentColor}
          onChange={onColorChange}
          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
        />
      </div>
      
      <div className="grid grid-cols-8 gap-1">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange({ target: { value: color } })}
            className="w-6 h-6 border border-gray-300 rounded cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  return (
    <aside className="w-80 bg-gray-100 p-3 border-r border-gray-300 h-full overflow-y-auto">
      {/* Seção de Formas - VERSÃO MELHORADA */}
      <div className="mb-6">
        <p className="font-semibold mb-3 text-gray-800">Formas</p>
        
        <div className="grid grid-cols-2 gap-2">
          <div
            className="p-3 bg-white border rounded text-center cursor-move hover:bg-gray-50 transition-colors text-xs flex flex-col items-center space-y-1"
            onDragStart={(e) => onDragStart(e, "rectangle")}
            draggable
          >
            {/* Ícone SVG do Retângulo */}
            <svg width="20" height="16" viewBox="0 0 20 16" className="text-blue-500">
              <rect x="1" y="1" width="18" height="14" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
            </svg>
            <span className="text-gray-700">Retângulo</span>
          </div>

          <div
            className="p-3 bg-white border rounded text-center cursor-move hover:bg-gray-50 transition-colors text-xs flex flex-col items-center space-y-1"
            onDragStart={(e) => onDragStart(e, "ellipse")}
            draggable
          >
            {/* Ícone SVG da Elipse */}
            <svg width="20" height="16" viewBox="0 0 20 16" className="text-green-500">
              <ellipse cx="10" cy="8" rx="9" ry="7" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-gray-700">Elipse</span>
          </div>

          <div
            className="p-3 bg-white border rounded text-center cursor-move hover:bg-gray-50 transition-colors text-xs flex flex-col items-center space-y-1"
            onDragStart={(e) => onDragStart(e, "circle")}
            draggable
          >
            {/* Ícone SVG do Círculo */}
            <svg width="18" height="18" viewBox="0 0 18 18" className="text-purple-500">
              <circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-gray-700">Círculo</span>
          </div>

          <div
            className="p-3 bg-white border rounded text-center cursor-move hover:bg-gray-50 transition-colors text-xs flex flex-col items-center space-y-1"
            onDragStart={(e) => onDragStart(e, "triangle")}
            draggable
          >
            {/* Ícone SVG do Triângulo */}
            <svg width="18" height="16" viewBox="0 0 18 16" className="text-orange-500">
              <polygon points="9,1 17,15 1,15" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-gray-700">Triângulo</span>
          </div>
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
            {/* Abas */}
            <div className="border-b border-gray-200 -mx-3">
              <nav className="flex px-3">
                <TabButton 
                  id="style" 
                  label="Estilo" 
                  icon="🎨" 
                  isActive={activeTab === "style"} 
                  onClick={setActiveTab}
                />
                <TabButton 
                  id="text" 
                  label="Texto" 
                  icon="📝" 
                  isActive={activeTab === "text"} 
                  onClick={setActiveTab}
                />
                <TabButton 
                  id="layout" 
                  label="Layout" 
                  icon="📐" 
                  isActive={activeTab === "layout"} 
                  onClick={setActiveTab}
                />
                <TabButton 
                  id="effects" 
                  label="Efeitos" 
                  icon="✨" 
                  isActive={activeTab === "effects"} 
                  onClick={setActiveTab}
                />
              </nav>
            </div>

            {/* Conteúdo das Abas */}
            {activeTab === "style" && (
              <div className="space-y-4">
                {/* Templates Rápidos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Templates Rápidos
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {nodePresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className="p-2 text-xs border rounded hover:opacity-80 transition-opacity"
                        style={{ 
                          backgroundColor: preset.bg, 
                          borderColor: preset.border,
                          color: preset.text 
                        }}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cor de Fundo */}
                <ColorPalette 
                  currentColor={backgroundColor}
                  onColorChange={handleBackgroundColorChange}
                  label="Cor de Fundo"
                />

                {/* Cor da Borda */}
                <ColorPalette 
                  currentColor={borderColor}
                  onColorChange={handleBorderColorChange}
                  label="Cor da Borda"
                />

                {/* Espessura da Borda */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Espessura da Borda: {borderWidth}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={borderWidth}
                    onChange={handleBorderWidthChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Arredondamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arredondamento: {borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={borderRadius}
                    onChange={handleBorderRadiusChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === "text" && (
              <div className="space-y-4">
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

                {/* Ícone/Emoji */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ícone/Emoji
                  </label>
                  <div className="grid grid-cols-8 gap-1 mb-2">
                    {commonIcons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => handleIconChange(icon)}
                        className={`p-1 text-sm border rounded hover:bg-gray-50 ${
                          selectedIcon === icon ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={selectedIcon}
                    onChange={(e) => handleIconChange(e.target.value)}
                    placeholder="Ou digite um emoji/ícone"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>

                {/* Cor do Texto */}
                <ColorPalette 
                  currentColor={textColor}
                  onColorChange={handleTextColorChange}
                  label="Cor do Texto"
                />

                {/* Tamanho da Fonte */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tamanho da Fonte: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Família da Fonte */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Família da Fonte
                  </label>
                  <select
                    value={fontFamily}
                    onChange={handleFontFamilyChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>

                {/* Alinhamento do Texto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alinhamento do Texto
                  </label>
                  <div className="flex gap-1">
                    {[
                      { value: "left", icon: "⬅️", label: "Esquerda" },
                      { value: "center", icon: "⬌", label: "Centro" },
                      { value: "right", icon: "➡️", label: "Direita" }
                    ].map((align) => (
                      <button
                        key={align.value}
                        onClick={() => handleTextAlignChange(align.value)}
                        className={`flex-1 px-2 py-2 text-xs border rounded transition-colors ${
                          textAlign === align.value 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                        title={align.label}
                      >
                        {align.icon}
                      </button>
                    ))}
                  </div>
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
              </div>
            )}

            {activeTab === "layout" && (
              <div className="space-y-4">
                {/* Largura */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Largura
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={nodeWidth === "auto" ? "" : nodeWidth}
                      onChange={handleWidthChange}
                      placeholder="Auto"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <button
                      onClick={() => {
                        setNodeWidth("auto");
                        updateNodeData({ nodeWidth: "auto" });
                      }}
                      className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Auto
                    </button>
                  </div>
                </div>

                {/* Altura */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Altura
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={nodeHeight === "auto" ? "" : nodeHeight}
                      onChange={handleHeightChange}
                      placeholder="Auto"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <button
                      onClick={() => {
                        setNodeHeight("auto");
                        updateNodeData({ nodeHeight: "auto" });
                      }}
                      className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Auto
                    </button>
                  </div>
                </div>

                {/* Espaçamento Interno */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Espaçamento Interno: {padding}px
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="32"
                    value={padding}
                    onChange={handlePaddingChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>8px</span>
                    <span>32px</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "effects" && (
              <div className="space-y-4">
                {/* Opacidade do Nó */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opacidade: {Math.round(nodeOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={nodeOpacity}
                    onChange={handleNodeOpacityChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Sombra */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasShadow}
                      onChange={handleShadowToggle}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Sombra</span>
                  </label>
                  
                  {hasShadow && (
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600 mb-1">
                        Intensidade: {Math.round(shadowOpacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="0.5"
                        step="0.05"
                        value={shadowOpacity}
                        onChange={handleShadowOpacityChange}
                        className="w-full h-2 bg-gray-200 rounded-lg"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preview do Nó */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="bg-gray-50 p-4 border rounded-md flex justify-center">
                <div
                  className="inline-flex items-center border transition-all duration-200"
                  style={{
                    backgroundColor,
                    borderColor,
                    borderWidth: `${borderWidth}px`,
                    borderRadius: selectedNode?.data.label === "circle" ? "50%" : `${borderRadius}px`,
                    padding: `${padding}px`,
                    boxShadow: hasShadow ? `0 4px 6px rgba(0, 0, 0, ${shadowOpacity})` : 'none',
                    fontSize: `${fontSize}px`,
                    fontFamily,
                    textAlign: textAlign as any,
                    fontWeight: isBold ? 'bold' : 'normal',
                    fontStyle: isItalic ? 'italic' : 'normal',
                    textDecoration: isStrikethrough ? 'underline' : 'none',
                    color: textColor,
                    opacity: nodeOpacity,
                    minWidth: nodeWidth !== "auto" ? `${nodeWidth}px` : "auto",
                    minHeight: nodeHeight !== "auto" ? `${nodeHeight}px` : "auto",
                    width: nodeWidth !== "auto" ? `${nodeWidth}px` : "auto",
                    height: nodeHeight !== "auto" ? `${nodeHeight}px` : "auto",
                    justifyContent: textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center',
                    alignItems: 'center',
                  }}
                >
                  {selectedIcon && <span className="mr-2 flex-shrink-0">{selectedIcon}</span>}
                  <span>{nodeText || "Texto de exemplo"}</span>
                </div>
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
              <p className="text-xs text-gray-500">
                <strong>Posição:</strong> X: {Math.round(selectedNode.position.x)}, Y: {Math.round(selectedNode.position.y)}
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
                {presetColors.slice(0, 12).map((color) => (
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
              <p className="text-xs text-gray-500">
                <strong>Tipo:</strong> {selectedEdge.type || "smoothstep"}
              </p>
            </div>
          </div>
        )}

        {/* Quando nada está selecionado */}
        {!selectedNode && !selectedEdge && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">🎨</div>
            <p className="text-sm text-gray-500 mb-2">
              Selecione um elemento para editá-lo
            </p>
            <p className="text-xs text-gray-400">
              Clique em um nó ou conexão para ver as opções de personalização
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;