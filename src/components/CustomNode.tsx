import React from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";

const CustomNode = ({ data, selected }: NodeProps) => {
  const label = data.label;
  const text = data.text || data.label;
  const backgroundColor = data.backgroundColor || 'white';
  const borderColor = data.borderColor || '#9ca3af';

  const renderShape = () => {
    // Adiciona borda azul quando selecionado
    const selectedClass = selected ? 'ring-2 ring-blue-400' : '';
    const borderStyle = { borderColor: selected ? '#3b82f6' : borderColor };
    const backgroundStyle = { backgroundColor };
    
    switch (label) {
      case "circle":
        return (
          <div 
            className={`w-24 h-24 rounded-full border-2 flex items-center justify-center text-sm shadow-md cursor-pointer transition-all duration-200 ${selectedClass}`}
            style={{ ...borderStyle, ...backgroundStyle }}
          >
            <span className="text-sm text-black select-none text-center px-2">
              {text}
            </span>
          </div>
        );

      case "ellipse":
        return (
          <div 
            className={`px-8 py-5 rounded-full border-2 text-sm shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center ${selectedClass}`}
            style={{ ...borderStyle, ...backgroundStyle }}
          >
            <span className="text-sm text-black select-none text-center">
              {text}
            </span>
          </div>
        );

      case "rectangle":
        return (
          <div 
            className={`px-6 py-4 rounded-md border-2 text-sm shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center ${selectedClass}`}
            style={{ ...borderStyle, ...backgroundStyle }}
          >
            <span className="text-sm text-black select-none text-center">
              {text}
            </span>
          </div>
        );

      case "triangle":
        return (
          <div className="w-[120px] h-[100px] relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50,0 100,100 0,100"
                fill={backgroundColor}
                stroke={selected ? "#3b82f6" : borderColor}
                strokeWidth={selected ? "3" : "2"}
                className="cursor-pointer transition-all duration-200"
                filter={selected ? "drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))" : "none"}
              />
            </svg>
            <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-sm cursor-pointer pointer-events-none">
              <span className="text-sm text-black select-none text-center">
                {text}
              </span>
            </div>
          </div>
        );

      default:
        return (
          <div 
            className={`px-4 py-4 rounded-md border-2 text-sm shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center ${selectedClass}`}
            style={{ ...borderStyle, ...backgroundStyle }}
          >
            <span className="text-sm text-black select-none text-center">
              {text}
            </span>
          </div>
        );
    }
  };

  // Renders the 4 handles around the shape
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