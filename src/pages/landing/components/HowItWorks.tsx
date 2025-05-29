
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Adquira",
      description: "Tenha sua máquina de pagamento personalizada com a sua marca."
    },
    {
      step: "02", 
      title: "Venda",
      description: "Aceite todas as bandeiras e tipos de pagamento."
    },
    {
      step: "03",
      title: "Receba", 
      description: "Repasses automáticos e imediatos — dinheiro no seu fluxo quando quiser."
    },
    {
      step: "04",
      title: "Expanda",
      description: "Gerencie pagamentos, faça transferências e pague contas com segurança e agilidade."
    }
  ];

  return (
    <section id="como-funciona" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-sigma-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f4457] mb-4 sm:mb-6">
            Como funciona?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-sigma-slate-600 max-w-2xl mx-auto">
            Em apenas 4 passos simples, você transforma completamente 
            sua gestão financeira
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Connection Lines - only visible on large screens */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-sigma-teal-300 via-sigma-cyan-400 to-sigma-teal-300 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="relative animate-slide-in-left" style={{ animationDelay: `${index * 0.2}s` }}>
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-4 border-0 shadow-lg bg-white h-full">
                  <CardContent className="p-6 sm:p-8 text-center">
                    {/* Step Number */}
                    <div className="relative mb-4 sm:mb-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0f4457] to-sigma-teal-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <span className="text-lg sm:text-2xl font-bold text-white">{step.step}</span>
                      </div>
                      {/* Connector Arrow - only visible on large screens */}
                      {index < steps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-8 xl:-right-12 transform -translate-y-1/2">
                          <ArrowRight className="h-6 w-6 xl:h-8 xl:w-8 text-sigma-teal-300" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold text-[#0f4457] mb-3 sm:mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-sigma-slate-600 leading-relaxed text-sm sm:text-base">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
