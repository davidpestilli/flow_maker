import React from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import { useState, useCallback, useRef, useEffect } from "react";

const CustomNode = ({ data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text || data.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const label = data.label;

  // Foca no input quando entra em modo de edição
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Inicia edição ao dar duplo clique
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  // Salva o texto e sai do modo de edição
  const handleSaveText = useCallback(() => {
    setIsEditing(false);
    data.text = text;
  }, [text, data]);

  // Manipula teclas no input
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation(); // Impede que o ReactFlow capture os eventos
    if (e.key === 'Enter') {
      handleSaveText();
    } else if (e.key === 'Escape') {
      setText(data.text || data.label);
      setIsEditing(false);
    }
  }, [handleSaveText, data.text, data.label]);

  // Salva quando perde o foco
  const handleBlur = useCallback(() => {
    handleSaveText();
  }, [handleSaveText]);

  // Evita propagação de eventos de mouse durante edição
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isEditing) {
      e.stopPropagation();
    }
  }, [isEditing]);

  const renderTextContent = () => {
    if (isEditing) {
      return (
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onMouseDown={handleMouseDown}
          className="bg-transparent border-none outline-none text-center text-sm w-full min-w-[60px] text-black"
          style={{ 
            fontSize: '14px',
            fontFamily: 'inherit',
            pointerEvents: 'all'
          }}
        />
      );
    }

    return (
      <span className="text-sm text-black select-none">
        {text || label}
      </span>
    );
  };

  const renderShape = () => {
    // Adiciona borda azul quando selecionado
    const selectedClass = selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-400';
    
    switch (label) {
      case "circle":
        return (
          <div 
            className={`w-24 h-24 rounded-full bg-white border-2 ${selectedClass} flex items-center justify-center text-sm shadow-md cursor-pointer transition-all duration-200`}
            onDoubleClick={handleDoubleClick}
          >
            {renderTextContent()}
          </div>
        );

      case "ellipse":
        return (
          <div 
            className={`px-8 py-5 rounded-full bg-white border-2 ${selectedClass} text-sm shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center`}
            onDoubleClick={handleDoubleClick}
          >
            {renderTextContent()}
          </div>
        );

      case "rectangle":
        return (
          <div 
            className={`px-6 py-4 rounded-md bg-white border-2 ${selectedClass} text-sm shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center`}
            onDoubleClick={handleDoubleClick}
          >
            {renderTextContent()}
          </div>
        );

      case "triangle":
        return (
          <div className="w-[120px] h-[100px] relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50,0 100,100 0,100"
                fill="white"
                stroke={selected ? "#3b82f6" : "#9ca3af"}
                strokeWidth={selected ? "3" : "2"}
                className="cursor-pointer transition-all duration-200"
                filter={selected ? "drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))" : "none"}
              />
            </svg>
            <div 
              className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-sm cursor-pointer"
              onDoubleClick={handleDoubleClick}
            >
              {renderTextContent()}
            </div>
          </div>
        );

      default:
        return (
          <div 
            className={`px-4 py-4 rounded-md bg-white border-2 ${selectedClass} text-sm shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center`}
            onDoubleClick={handleDoubleClick}
          >
            {renderTextContent()}
          </div>
        );
    }
  };

  // Renders the 4 handles around the shape - mantendo exatamente como estava
  const renderHandles = () => {
    return (
      <>
        {["Top", "Right", "Bottom", "Left"].map((pos) => (
          <React.Fragment key={pos}>
            <Handle
              type="source"
              position={Position[pos as keyof typeof Position]}
              id={pos.toLowerCase()}
              className={`!bg-blue-500 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-600 !-${pos.toLowerCase()}-1.5`}
            />
            <Handle
              type="target"
              position={Position[pos as keyof typeof Position]}
              id={pos.toLowerCase()}
              className={`!bg-blue-500 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-600 !-${pos.toLowerCase()}-1.5`}
            />
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="relative flex items-center justify-center">
      {renderShape()}
      {renderHandles()}
    </div>
  );
};

export default CustomNode;