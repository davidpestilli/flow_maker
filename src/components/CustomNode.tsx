import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";

const CustomNode = ({ data }: NodeProps) => {
  return (
    <div className="relative bg-white border-2 border-gray-400 rounded-md p-4 text-sm text-center shadow-md min-w-[120px] hover:shadow-lg transition-shadow">
      <div className="font-medium">{data.label || "Shape"}</div>

      {/* Handles para conexão - Sources (saída) */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
        style={{ top: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
        style={{ bottom: -6 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
        style={{ right: -6 }}
      />

      {/* Handles para conexão - Targets (entrada) */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-white"
        style={{ top: -6, left: '40%' }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-white"
        style={{ bottom: -6, left: '40%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-white"
        style={{ left: -6, top: '40%' }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-white"
        style={{ right: -6, top: '40%' }}
      />
    </div>
  );
};

export default CustomNode;