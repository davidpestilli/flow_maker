import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";

const CustomNode = ({ data }: NodeProps) => {
  const label = data.label;

  const renderShape = () => {
    switch (label) {
      case "circle":
        return (
          <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center text-sm shadow-md">
            {label}
          </div>
        );

      case "ellipse":
        return (
          <div className="px-8 py-5 rounded-full bg-white border-2 border-gray-400 text-sm shadow-md">
            {label}
          </div>
        );

      case "rectangle":
        return (
          <div className="px-6 py-4 rounded-md bg-white border-2 border-gray-400 text-sm shadow-md">
            {label}
          </div>
        );

case "triangle":
  return (
    <div className="w-[120px] h-[100px] relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon
          points="50,0 100,100 0,100"
          fill="white"
          stroke="#9ca3af"
          strokeWidth="2"
        />
      </svg>
      <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-sm">
        {label}
      </div>
    </div>
  );

      default:
        return (
          <div className="px-4 py-4 rounded-md bg-white border-2 border-gray-400 text-sm shadow-md">
            {label || "Shape"}
          </div>
        );
    }
  };

  // Renders the 4 handles around the shape
  const renderHandles = () => {
    return (
      <>
        {["Top", "Right", "Bottom", "Left"].map((pos) => (
          <>
            <Handle
              key={`source-${pos}`}
              type="source"
              position={Position[pos as keyof typeof Position]}
              id={pos.toLowerCase()}
              className={`!bg-blue-500 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-600 !-${pos.toLowerCase()}-1.5`}
            />
            <Handle
              key={`target-${pos}`}
              type="target"
              position={Position[pos as keyof typeof Position]}
              id={pos.toLowerCase()}
              className={`!bg-blue-500 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-600 !-${pos.toLowerCase()}-1.5`}
            />
          </>
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
