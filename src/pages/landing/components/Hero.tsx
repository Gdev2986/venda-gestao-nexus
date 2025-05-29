
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f4457] via-[#1a5a70] to-[#0f4457] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-white rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-sigma-blue-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fade-in">
            Transforme sua 
            <span className="block bg-gradient-to-r from-white to-sigma-teal-300 bg-clip-text text-transparent">
              gestão financeira
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2 sm:mt-4">
              com liberdade e autonomia
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 max-w-3xl mx-auto animate-slide-in-left leading-relaxed" style={{ animationDelay: '0.3s' }}>
            Receba pagamentos, faça transferências, pague contas e boletos direto da sua conta. 
            Uma solução sob medida, pensada pra quem quer praticidade e controle total do fluxo financeiro, 
            sem intermediários, sem complicação.
          </p>

          {/* Check list items */}
          <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3 text-left max-w-2xl mx-auto animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center text-gray-200 text-sm sm:text-base">
              <span className="text-sigma-teal-300 mr-2 sm:mr-3 font-bold">✓</span>
              Pagamento de boletos direto pela plataforma
            </div>
            <div className="flex items-center text-gray-200 text-sm sm:text-base">
              <span className="text-sigma-teal-300 mr-2 sm:mr-3 font-bold">✓</span>
              Gestão inteligente de recebíveis
            </div>
            <div className="flex items-center text-gray-200 text-sm sm:text-base">
              <span className="text-sigma-teal-300 mr-2 sm:mr-3 font-bold">✓</span>
              Transferências e PIX instantâneos, sem limites
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-slide-in-right mb-8 sm:mb-12" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-sigma-teal-400 to-sigma-cyan-500 hover:from-sigma-teal-500 hover:to-sigma-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              Entre em Contato
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 animate-scale-in" style={{ animationDelay: '0.9s' }}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">+5.000</div>
              <div className="text-gray-300 text-sm sm:text-base">Parceiros de negócios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">R$ 2M+</div>
              <div className="text-gray-300 text-sm sm:text-base">Processados mensalmente</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">99,9%</div>
              <div className="text-gray-300 text-sm sm:text-base">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
