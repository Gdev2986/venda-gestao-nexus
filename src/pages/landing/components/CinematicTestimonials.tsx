
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

const CinematicTestimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "Confiamos na Sigma Pay",
      author: "Ana Silva",
      business: "Restaurante Premium",
      bgPosition: "bg-center"
    },
    {
      text: "Gestão descomplicada",
      author: "Carlos Santos", 
      business: "Tech Store",
      bgPosition: "bg-left"
    },
    {
      text: "Transformou nosso negócio",
      author: "Marina Costa",
      business: "Boutique Elegance", 
      bgPosition: "bg-right"
    },
    {
      text: "Eficiência comprovada",
      author: "Roberto Lima",
      business: "Lima Motors",
      bgPosition: "bg-top"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background Video Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 z-10"></div>
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 transition-all duration-2000 ${testimonials[currentTestimonial].bgPosition}`}></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Confiança Real
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-black/40 border border-gray-700/50 backdrop-blur-md shadow-2xl">
            <CardContent className="p-10 text-center">
              <div 
                key={currentTestimonial}
                className="animate-fade-in"
              >
                <blockquote className="text-2xl md:text-3xl font-light text-white mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonials[currentTestimonial].author[0]}
                    </span>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {testimonials[currentTestimonial].author}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonials[currentTestimonial].business}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Bar */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`h-1 transition-all duration-500 ${
                  index === currentTestimonial 
                    ? 'w-12 bg-blue-400' 
                    : 'w-6 bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CinematicTestimonials;
