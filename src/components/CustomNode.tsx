import React from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";

const CustomNode = ({ data, selected }: NodeProps) => {
  // Propriedades básicas (originais - sempre presentes)
  const label = data.label;
  const text = data.text || data.label;
  
  // Propriedades de estilo com fallbacks seguros
  const backgroundColor = data.backgroundColor || '#ffffff';
  const borderColor = data.borderColor || '#9ca3af';
  const borderWidth = data.borderWidth || 2;
  const borderRadius = data.borderRadius || 8;
  
  // Propriedades de texto com fallbacks seguros
  const textColor = data.textColor || '#000000';
  const fontSize = data.fontSize || 14;
  const fontFamily = data.fontFamily || 'Inter';
  const textAlign = data.textAlign || 'center';
  const isBold = data.isBold || false;
  const isItalic = data.isItalic || false;
  const isStrikethrough = data.isStrikethrough || false;
  
  // Propriedades de layout com fallbacks seguros
  const nodeWidth = data.nodeWidth;
  const nodeHeight = data.nodeHeight;
  const padding = data.padding || 16;
  
  // Propriedades de efeitos com fallbacks seguros
  const hasShadow = data.hasShadow !== false; // padrão true, mas pode ser false
  const shadowOpacity = data.shadowOpacity || 0.1;
  const nodeOpacity = data.nodeOpacity || 1;
  
  // Ícone com fallback seguro
  const selectedIcon = data.selectedIcon || "";

  // Função para gerar o estilo do texto
  const getTextStyle = () => {
    return {
      color: textColor,
      fontSize: `${fontSize}px`,
      fontFamily,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isStrikethrough ? 'underline' : 'none',
      margin: 0,
      padding: 0,
    };
  };

  // Função para calcular dimensões com fallbacks
  const getDimensions = (defaultWidth: number, defaultHeight: number) => {
    const width = nodeWidth && nodeWidth !== "auto" ? parseInt(nodeWidth.toString()) : defaultWidth;
    const height = nodeHeight && nodeHeight !== "auto" ? parseInt(nodeHeight.toString()) : defaultHeight;
    return { width, height };
  };

  // Função para gerar container de texto com alinhamento
  const renderTextContent = () => {
    const contentStyle = {
      ...getTextStyle(),
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      justifyContent: textAlign === 'left' ? 'flex-start' : 
                     textAlign === 'right' ? 'flex-end' : 'center',
      textAlign: textAlign as any,
      wordBreak: 'break-word' as any,
      overflow: 'hidden',
    };

    return (
      <div style={contentStyle}>
        {selectedIcon && (
          <span style={{ marginRight: selectedIcon ? '4px' : '0', flexShrink: 0 }}>
            {selectedIcon}
          </span>
        )}
        <span style={{ wordBreak: 'break-word' }}>{text}</span>
      </div>
    );
  };

  const renderShape = () => {
    const selectedClass = selected ? 'ring-2 ring-blue-400 ring-offset-1' : '';
    
    // Estilo base comum a todos os elementos
    const baseStyle = {
      backgroundColor,
      borderColor: selected ? '#3b82f6' : borderColor,
      borderWidth: `${selected ? Math.max(borderWidth, 2) : borderWidth}px`,
      borderStyle: 'solid' as const,
      padding: `${padding}px`,
      boxShadow: hasShadow ? `0 4px 6px rgba(0, 0, 0, ${shadowOpacity})` : 'none',
      opacity: nodeOpacity,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    };

    switch (label) {
      case "circle": {
        const { width: circleSize } = getDimensions(96, 96);
        
        return (
          <div 
            className={`border shadow-md cursor-pointer transition-all duration-200 ${selectedClass}`}
            style={{
              ...baseStyle,
              borderRadius: '50%',
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              minWidth: `${circleSize}px`,
              minHeight: `${circleSize}px`,
            }}
          >
            {renderTextContent()}
          </div>
        );
      }

      case "ellipse": {
        const { width, height } = getDimensions(120, 80);
        
        return (
          <div 
            className={`border shadow-md cursor-pointer transition-all duration-200 ${selectedClass}`}
            style={{
              ...baseStyle,
              borderRadius: '50%',
              width: `${width}px`,
              height: `${height}px`,
              minWidth: `${width}px`,
              minHeight: `${height}px`,
            }}
          >
            {renderTextContent()}
          </div>
        );
      }

      case "rectangle": {
        const { width, height } = getDimensions(120, 60);
        
        return (
          <div 
            className={`border shadow-md cursor-pointer transition-all duration-200 ${selectedClass}`}
            style={{
              ...baseStyle,
              borderRadius: `${borderRadius}px`,
              width: `${width}px`,
              height: `${height}px`,
              minWidth: `${width}px`,
              minHeight: `${height}px`,
            }}
          >
            {renderTextContent()}
          </div>
        );
      }

      case "triangle": {
        const { width: triangleSize, height: triangleHeight } = getDimensions(120, 100);
        
        return (
          <div 
            className="relative"
            style={{ 
              width: `${triangleSize}px`, 
              height: `${triangleHeight}px`,
              opacity: nodeOpacity,
              filter: hasShadow ? `drop-shadow(0 4px 6px rgba(0, 0, 0, ${shadowOpacity}))` : 'none',
            }}
          >
            <svg 
              viewBox={`0 0 ${triangleSize} ${triangleHeight}`} 
              className="w-full h-full"
            >
              <polygon
                points={`${triangleSize/2},0 ${triangleSize},${triangleHeight} 0,${triangleHeight}`}
                fill={backgroundColor}
                stroke={selected ? "#3b82f6" : borderColor}
                strokeWidth={selected ? Math.max(borderWidth, 3) : borderWidth}
                className="cursor-pointer transition-all duration-200"
              />
            </svg>
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer pointer-events-none"
              style={{
                padding: `${padding}px`,
                paddingTop: `${padding + 20}px`, // Ajuste para posicionamento no triângulo
              }}
            >
              <div
                style={{
                  ...getTextStyle(),
                  textAlign: textAlign as any,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: textAlign === 'left' ? 'flex-start' : 
                                 textAlign === 'right' ? 'flex-end' : 'center',
                  wordBreak: 'break-word' as any,
                }}
              >
                {selectedIcon && (
                  <span style={{ marginRight: '4px', flexShrink: 0 }}>
                    {selectedIcon}
                  </span>
                )}
                <span>{text}</span>
              </div>
            </div>
          </div>
        );
      }

      default: {
        const { width, height } = getDimensions(100, 50);
        
        return (
          <div 
            className={`border shadow-md cursor-pointer transition-all duration-200 ${selectedClass}`}
            style={{
              ...baseStyle,
              borderRadius: `${borderRadius}px`,
              width: `${width}px`,
              height: `${height}px`,
              minWidth: `${width}px`,
              minHeight: `${height}px`,
            }}
          >
            {renderTextContent()}
          </div>
        );
      }
    }
  };

  // Renderiza os handles de conexão
  const renderHandles = () => {
    const handleStyle = {
      background: '#3b82f6',
      border: '2px solid white',
      width: '12px',
      height: '12px',
      zIndex: 10,
    };

    return (
      <>
        {["Top", "Right", "Bottom", "Left"].map((pos) => (
          <React.Fragment key={pos}>
            <Handle
              type="source"
              position={Position[pos as keyof typeof Position]}
              id={`${pos.toLowerCase()}-source`}
              className="hover:!bg-blue-600 hover:!scale-110 transition-all duration-200"
              style={handleStyle}
            />
            <Handle
              type="target"
              position={Position[pos as keyof typeof Position]}
              id={`${pos.toLowerCase()}-target`}
              className="hover:!bg-blue-600 hover:!scale-110 transition-all duration-200"
              style={handleStyle}
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