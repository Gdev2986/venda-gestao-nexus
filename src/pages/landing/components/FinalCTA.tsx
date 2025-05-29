
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Olá! Gostaria de saber mais sobre as soluções da Sigma Pay.");
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  return (
    <section id="contato" className="py-20 bg-gradient-to-br from-sigma-indigo-900 via-sigma-indigo-800 to-sigma-blue-600 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sigma-blue-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Sua gestão financeira merece uma 
            <span className="block bg-gradient-to-r from-sigma-blue-400 to-white bg-clip-text text-transparent">
              solução completa
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
            Fale conosco e descubra como transformar sua operação em poucos minutos.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              onClick={handleWhatsAppClick}
              className="bg-sigma-green-500 hover:bg-sigma-green-600 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
            >
              Solicitar Contato
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/40 text-white hover:bg-white/10 px-12 py-6 text-xl rounded-2xl backdrop-blur-sm"
            >
              Ver Demonstração
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-80">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Seguro</div>
              <div className="text-gray-300 text-sm">Certificação PCI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-gray-300 text-sm">Suporte</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Rápido</div>
              <div className="text-gray-300 text-sm">Setup em minutos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Confiável</div>
              <div className="text-gray-300 text-sm">99.9% Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
