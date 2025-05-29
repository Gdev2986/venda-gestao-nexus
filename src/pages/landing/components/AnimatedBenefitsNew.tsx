
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const AnimatedBenefitsNew = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const benefits = [
    {
      title: "Gestão",
      description: "Completa e inteligente — controle total do fluxo.",
      icon: "📊",
      gradient: "from-sigma-teal-500 to-sigma-cyan-600"
    },
    {
      title: "Rendimento", 
      description: "Automatizado e seguro — receba e pague sem complicação.",
      icon: "💰",
      gradient: "from-sigma-cyan-500 to-sigma-teal-600"
    },
    {
      title: "Segurança",
      description: "Máxima proteção — criptografia e sigilo em todas as operações.",
      icon: "🔒",
      gradient: "from-sigma-teal-600 to-sigma-slate-700"
    },
    {
      title: "Controle",
      description: "Sua grana, suas regras.",
      icon: "🎯",
      gradient: "from-sigma-slate-600 to-sigma-teal-600"
    },
    {
      title: "Velocidade",
      description: "Repasses instantâneos — sem esperar dias pra ter seu dinheiro.",
      icon: "⚡",
      gradient: "from-sigma-cyan-500 to-sigma-teal-500"
    },
    {
      title: "Praticidade",
      description: "Tudo na palma da mão — um sistema ágil, simples e objetivo.",
      icon: "📱",
      gradient: "from-sigma-teal-500 to-sigma-cyan-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-sigma-slate-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-sigma-teal-900 mb-6">
            Tudo no mesmo lugar
          </h2>
          <p className="text-xl text-sigma-slate-600 max-w-3xl mx-auto">
            Uma plataforma completa que centraliza todas as suas necessidades financeiras
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 shadow-lg bg-white overflow-hidden"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-8 text-center relative">
                {/* Background Gradient Effect */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
                
                {/* Icon */}
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-sigma-teal-900 mb-4 group-hover:text-sigma-teal-800 transition-colors duration-300">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sigma-slate-600 leading-relaxed group-hover:text-sigma-slate-700 transition-colors duration-300">
                  {benefit.description}
                </p>

                {/* Animated Border */}
                <div 
                  className={`absolute inset-0 border-2 border-transparent bg-gradient-to-br ${benefit.gradient} rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'subtract' }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedBenefitsNew;
