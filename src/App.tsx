
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Criacao from "./pages/Criacao";

const App = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <Criacao />
      </div>
    </div>
  );
};

export default App;
