
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Zap, Repeat, Lock, BarChart, Clock, Smartphone } from "lucide-react";

const AnimatedBenefits = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const benefits = [
    {
      icon: Zap,
      keyword: "Gestão",
      description: "Completa e inteligente",
      bgColor: "bg-slate-800/90",
      hoverColor: "hover:bg-blue-600/20"
    },
    {
      icon: Repeat,
      keyword: "Rendimento",
      description: "Automático e seguro",
      bgColor: "bg-slate-700/90",
      hoverColor: "hover:bg-green-600/20"
    },
    {
      icon: Lock,
      keyword: "Segurança",
      description: "Máxima proteção",
      bgColor: "bg-slate-800/90",
      hoverColor: "hover:bg-purple-600/20"
    },
    {
      icon: BarChart,
      keyword: "Controle",
      description: "Total das finanças",
      bgColor: "bg-slate-700/90",
      hoverColor: "hover:bg-orange-600/20"
    },
    {
      icon: Clock,
      keyword: "Velocidade",
      description: "Repasses instantâneos",
      bgColor: "bg-slate-800/90",
      hoverColor: "hover:bg-pink-600/20"
    },
    {
      icon: Smartphone,
      keyword: "Praticidade",
      description: "Tudo no mesmo lugar",
      bgColor: "bg-slate-700/90",
      hoverColor: "hover:bg-indigo-600/20"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Tudo no mesmo lugar
            </span>
          </h2>
          <p className="text-base text-gray-400">Sem complicação • Gestão com autonomia</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className={`group relative ${benefit.bgColor} ${benefit.hoverColor} border border-gray-600 transition-all duration-500 hover:scale-105 backdrop-blur-sm overflow-hidden hover:border-blue-400/50`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-6 text-center relative h-40 flex flex-col justify-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  hoveredCard === index 
                    ? 'bg-white/20 scale-110' 
                    : 'bg-gray-600 group-hover:bg-gray-500'
                }`}>
                  <benefit.icon className={`h-6 w-6 transition-all duration-300 ${
                    hoveredCard === index ? 'text-white' : 'text-gray-300 group-hover:text-gray-200'
                  }`} />
                </div>

                <h3 className={`text-base font-bold mb-2 transition-all duration-300 ${
                  hoveredCard === index 
                    ? 'text-white scale-105' 
                    : 'text-white'
                }`}>
                  {benefit.keyword}
                </h3>

                <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedBenefits;
