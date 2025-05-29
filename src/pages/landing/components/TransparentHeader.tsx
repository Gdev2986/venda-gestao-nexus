import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TransparentHeader = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-xs sm:text-sm">Σ</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-white">Sigma Pay</span>
        </div>

        <Button 
          variant="outline" 
          onClick={handleLoginClick}
          className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-gray-900 px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg backdrop-blur-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          Já sou cliente
        </Button>
      </div>
    </header>
  );
};

export default TransparentHeader;
