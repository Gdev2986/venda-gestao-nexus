
import { Button } from "@/components/ui/button";
import { Shield, Zap, Clock, Award } from "lucide-react";

const FinalCall = () => {
  const features = [
    {
      icon: Shield,
      label: "Seguro"
    },
    {
      icon: Zap,
      label: "Rápido"
    },
    {
      icon: Clock,
      label: "Preciso"
    },
    {
      icon: Award,
      label: "Premium"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#0f4457] via-[#1a5a70] to-[#0f4457]">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-in">
            Transforme sua gestão financeira
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto animate-slide-in-left leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Uma solução completa pra revolucionar seu negócio, com mais agilidade e autonomia.
          </p>

          <div className="mb-8 sm:mb-12 animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-sigma-teal-400 to-sigma-cyan-500 hover:from-sigma-teal-500 hover:to-sigma-cyan-600 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              Comece Agora
            </Button>
          </div>

          {/* Features with Icons */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center space-y-2 sm:space-y-3 group hover:scale-110 transition-transform duration-300"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-sigma-teal-400/20 to-sigma-cyan-500/20 rounded-full flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-sigma-teal-400/30 group-hover:to-sigma-cyan-500/30 transition-all duration-300 backdrop-blur-sm border border-white/20">
                    <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-sigma-teal-300 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-white font-medium text-sm sm:text-base lg:text-lg group-hover:text-sigma-teal-300 transition-colors duration-300">
                    {feature.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCall;
