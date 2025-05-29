
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { CreditCard, Smartphone, TrendingUp, Shield } from "lucide-react";

const InteractiveFlow = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: CreditCard,
      title: "Adquira",
      description: "Máquina personalizada com sua marca",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Smartphone,
      title: "Venda",
      description: "Aceite todos os tipos de pagamento",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: TrendingUp,
      title: "Receba",
      description: "Repasses automáticos em tempo real",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Expanda",
      description: "Pague contas e transfira com segurança",
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Como Funciona
          </h2>
        </div>

        {/* Grid Layout instead of horizontal scroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all duration-500 hover:scale-105 ${
                activeStep === index ? 'ring-2 ring-blue-400 scale-105' : ''
              } bg-gradient-to-br ${step.color} border-0 shadow-xl transform-gpu h-64`}
              onMouseEnter={() => setActiveStep(index)}
            >
              <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/50 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-8 space-x-3">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeStep === index 
                  ? 'bg-blue-400 w-8' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveFlow;
