import React from "react";

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-40 bg-gray-100 p-3 border-r border-gray-300 h-full">
      <p className="font-semibold mb-2">Shapes</p>
      <div
        className="p-2 bg-white border rounded mb-2 cursor-move text-center"
        onDragStart={(e) => onDragStart(e, "rectangle")}
        draggable
      >
        Retângulo
      </div>
      <div
        className="p-2 bg-white border rounded mb-2 cursor-move text-center"
        onDragStart={(e) => onDragStart(e, "ellipse")}
        draggable
      >
        Elipse
      </div>
      <div
        className="p-2 bg-white border rounded mb-2 cursor-move text-center"
        onDragStart={(e) => onDragStart(e, "diamond")}
        draggable
      >
        Diamante
      </div>
    </aside>
  );
};

export default Sidebar;