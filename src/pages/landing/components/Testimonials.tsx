
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Ana Silva",
      business: "Restaurante Sabor & Arte",
      text: "A Sigma Pay revolucionou nosso negócio. Agora aceitamos todos os tipos de pagamento e nossa gestão financeira ficou muito mais organizada.",
      avatar: "🍽️"
    },
    {
      name: "Carlos Santos",
      business: "Loja Tech Store",
      text: "O que mais me impressiona é a agilidade no repasse. Não preciso mais me preocupar com burocracias bancárias.",
      avatar: "💻"
    },
    {
      name: "Marina Costa",
      business: "Salão Beleza Pura",
      text: "A máquina personalizada com nossa marca deu um toque profissional que nossos clientes adoram. Recomendo para todos!",
      avatar: "💄"
    },
    {
      name: "Roberto Lima",
      business: "Oficina Lima Motors",
      text: "Desde que começamos a usar a Sigma Pay, nossa produtividade aumentou 40%. O sistema é intuitivo e confiável.",
      avatar: "🔧"
    },
    {
      name: "Juliana Pereira",
      business: "Boutique Elegance",
      text: "O suporte é excepcional e a plataforma nunca nos deixou na mão. Nossa receita aumentou significativamente.",
      avatar: "👗"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section id="depoimentos" className="py-20 bg-gradient-to-br from-sigma-indigo-50 to-sigma-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-sigma-indigo-900 mb-6">
            Empreendedores que confiam na Sigma Pay
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Histórias reais de sucesso de quem já transformou seu negócio
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <Card className="mx-4 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <div className="text-6xl mb-6">{testimonial.avatar}</div>
                      
                      <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-8 leading-relaxed">
                        "{testimonial.text}"
                      </blockquote>
                      
                      <div>
                        <div className="font-semibold text-sigma-indigo-900 text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-600">
                          {testimonial.business}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-sigma-indigo-600 w-8' 
                    : 'bg-sigma-indigo-300 hover:bg-sigma-indigo-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
