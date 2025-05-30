import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";

const CustomNode = ({ data }: NodeProps) => {
  // Determinamos o tipo de shape para aplicar estilos diferentes
  const getShapeClass = () => {
    switch (data.label) {
      case 'ellipse':
        return 'rounded-full px-8 py-6';
      case 'diamond':
        return 'transform rotate-45 w-20 h-20 flex items-center justify-center';
      default:
        return 'rounded-md px-4 py-6';
    }
  };

  const contentClass = data.label === 'diamond' ? 'transform -rotate-45 text-xs' : '';

  return (
    <div className={`relative bg-white border-2 border-gray-400 text-sm text-center shadow-md min-w-[120px] hover:shadow-lg transition-shadow ${getShapeClass()}`}>
      <div className={`font-medium ${contentClass}`}>
        {data.label || "Shape"}
      </div>

      {/* Handles que funcionam tanto como SOURCE quanto TARGET */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-600 !-top-1.5"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-600 !-top-1.5"
      />
      
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-600 !-right-1.5"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-600 !-right-1.5"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-600 !-bottom-1.5"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-600 !-bottom-1.5"
      />
      
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-600 !-left-1.5"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-600 !-left-1.5"
      />
    </div>
  );
};

export default CustomNode;