
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-sigma-indigo-600 to-sigma-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Σ</span>
          </div>
          <span className="text-xl font-bold text-sigma-indigo-900">Sigma Pay</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#beneficios" className="text-gray-600 hover:text-sigma-indigo-600 transition-colors">Benefícios</a>
          <a href="#como-funciona" className="text-gray-600 hover:text-sigma-indigo-600 transition-colors">Como Funciona</a>
          <a href="#depoimentos" className="text-gray-600 hover:text-sigma-indigo-600 transition-colors">Depoimentos</a>
          <a href="#contato" className="text-gray-600 hover:text-sigma-indigo-600 transition-colors">Contato</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-sigma-indigo-600 hover:text-sigma-indigo-700">
            Login
          </Button>
          <Button className="bg-gradient-to-r from-sigma-indigo-600 to-sigma-blue-500 hover:from-sigma-indigo-700 hover:to-sigma-blue-600 text-white px-6">
            Começar Agora
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
