
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

const SimpleTestimonial = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Confiamos na Sigma Pay",
      author: "Ana Silva",
      business: "Restaurante Premium",
      initials: "AS"
    },
    {
      quote: "Transformou completamente nossa operação financeira",
      author: "Carlos Mendes",
      business: "Tech Solutions",
      initials: "CM"
    },
    {
      quote: "Eficiência e segurança em cada transação",
      author: "Marina Santos",
      business: "Boutique Elegance",
      initials: "MS"
    },
    {
      quote: "Repasses imediatos mudaram nosso fluxo de caixa",
      author: "Roberto Lima",
      business: "Lima Materiais",
      initials: "RL"
    },
    {
      quote: "Plataforma intuitiva e suporte excepcional",
      author: "Fernanda Costa",
      business: "Clínica Vida",
      initials: "FC"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-sigma-teal-50 to-sigma-cyan-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f4457] mb-8 sm:mb-12">
            Confiança Real
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 border border-sigma-slate-100 relative overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-sigma-teal-50/30 to-sigma-cyan-50/30 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="text-4xl sm:text-5xl lg:text-6xl text-[#0f4457] mb-4 sm:mb-6">"</div>
              
              <blockquote 
                key={currentTestimonial}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-sigma-slate-800 mb-6 sm:mb-8 leading-relaxed animate-fade-in"
              >
                {testimonials[currentTestimonial].quote}
              </blockquote>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0f4457] to-sigma-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg sm:text-xl">
                    {testimonials[currentTestimonial].initials}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-semibold text-[#0f4457] text-base sm:text-lg">
                    {testimonials[currentTestimonial].author}
                  </div>
                  <div className="text-sigma-slate-600 text-sm sm:text-base">
                    {testimonials[currentTestimonial].business}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-[#0f4457] w-6 sm:w-8' 
                    : 'bg-sigma-teal-300 hover:bg-sigma-teal-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleTestimonial;
