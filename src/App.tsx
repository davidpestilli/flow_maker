import { useState, useRef } from "react";
import type { Node, Edge } from "reactflow";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Criacao from "./pages/Criacao";

const App = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const updateNodeFuncRef = useRef<((nodeId: string, updates: any) => void) | null>(null);
  const updateEdgeFuncRef = useRef<((edgeId: string, updates: any) => void) | null>(null);

  const handleNodeSelect = (node: Node | null) => {
    console.log('App: Node selected:', node); // Debug
    setSelectedNode(node);
    // Quando seleciona um nó, desseleciona edge
    if (node) {
      setSelectedEdge(null);
    }
  };

  const handleEdgeSelect = (edge: Edge | null) => {
    console.log('App: Edge selected:', edge); // Debug
    setSelectedEdge(edge);
    // Quando seleciona um edge, desseleciona nó
    if (edge) {
      setSelectedNode(null);
    }
  };

  const handleUpdateNode = (nodeId: string, updates: any) => {
    console.log('App: handleUpdateNode called with:', nodeId, updates); // Debug
    
    // Chama a função real de atualização do canvas
    if (updateNodeFuncRef.current) {
      updateNodeFuncRef.current(nodeId, updates);
    }
  };

  const handleUpdateEdge = (edgeId: string, updates: any) => {
    console.log('App: handleUpdateEdge called with:', edgeId, updates); // Debug
    
    // Chama a função real de atualização do canvas
    if (updateEdgeFuncRef.current) {
      updateEdgeFuncRef.current(edgeId, updates);
    }
  };

  const setUpdateNodeFunc = (func: (nodeId: string, updates: any) => void) => {
    updateNodeFuncRef.current = func;
  };

  const setUpdateEdgeFunc = (func: (edgeId: string, updates: any) => void) => {
    updateEdgeFuncRef.current = func;
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar 
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onUpdateNode={handleUpdateNode}
          onUpdateEdge={handleUpdateEdge}
        />
        <Criacao 
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onNodeSelect={handleNodeSelect}
          onEdgeSelect={handleEdgeSelect}
          setUpdateNodeFunc={setUpdateNodeFunc}
          setUpdateEdgeFunc={setUpdateEdgeFunc}
        />
      </div>
    </div>
  );
};

export default App;