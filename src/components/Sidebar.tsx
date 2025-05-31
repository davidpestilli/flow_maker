import React, { useState, useEffect } from "react";
import type { Node } from "reactflow";

interface SidebarProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
}

const Sidebar = ({ selectedNode, onUpdateNode }: SidebarProps) => {
  const [nodeText, setNodeText] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [borderColor, setBorderColor] = useState("#9ca3af");

  // Atualiza os valores quando um novo nó é selecionado
  useEffect(() => {
    if (selectedNode) {
      setNodeText(selectedNode.data.text || selectedNode.data.label || "");
      setBackgroundColor(selectedNode.data.backgroundColor || "#ffffff");
      setBorderColor(selectedNode.data.borderColor || "#9ca3af");
    }
  }, [selectedNode]);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setNodeText(newText);
    if (selectedNode) {
      console.log('Sidebar: Calling onUpdateNode with text:', newText); // Debug
      onUpdateNode(selectedNode.id, { text: newText });
    }
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBackgroundColor(newColor);
    if (selectedNode) {
      console.log('Sidebar: Calling onUpdateNode with backgroundColor:', newColor); // Debug
      onUpdateNode(selectedNode.id, { backgroundColor: newColor });
    }
  };

  const handleBorderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBorderColor(newColor);
    if (selectedNode) {
      console.log('Sidebar: Calling onUpdateNode with borderColor:', newColor); // Debug
      onUpdateNode(selectedNode.id, { borderColor: newColor });
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
            {selectedNode ? "Editar Nó" : "Selecione um nó"}
          </p>
          {selectedNode && (
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Nó selecionado"></div>
          )}
        </div>
        
        {selectedNode ? (
          <div className="space-y-4">
            {/* Debug Info */}
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <strong>Debug:</strong> Node ID: {selectedNode.id}
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
        ) : (
          <p className="text-sm text-gray-500">
            Clique em um nó no canvas para editá-lo.
          </p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;