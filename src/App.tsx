import { useState, useRef } from "react";
import type { Node } from "reactflow";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Criacao from "./pages/Criacao";

const App = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const updateNodeFuncRef = useRef<((nodeId: string, updates: any) => void) | null>(null);

  const handleNodeSelect = (node: Node | null) => {
    console.log('App: Node selected:', node); // Debug
    setSelectedNode(node);
  };

  const handleUpdateNode = (nodeId: string, updates: any) => {
    console.log('App: handleUpdateNode called with:', nodeId, updates); // Debug
    
    // Chama a função real de atualização do canvas
    if (updateNodeFuncRef.current) {
      updateNodeFuncRef.current(nodeId, updates);
    }
  };

  const setUpdateNodeFunc = (func: (nodeId: string, updates: any) => void) => {
    updateNodeFuncRef.current = func;
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar 
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
        />
        <Criacao 
          selectedNode={selectedNode}
          onNodeSelect={handleNodeSelect}
          setUpdateNodeFunc={setUpdateNodeFunc}
        />
      </div>
    </div>
  );
};

export default App;