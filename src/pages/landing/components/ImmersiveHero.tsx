import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
const ImmersiveHero = () => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Olá! Quero transformar minha gestão financeira com a Sigma Pay.");
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };
  const handleCardClick = () => {
    console.log('Card clicked, current state:', isCardFlipped);
    setIsCardFlipped(!isCardFlipped);
  };
  return <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-sigma-teal-900 via-sigma-cyan-900 to-sigma-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sigma-teal-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sigma-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-sigma-teal-400 rounded-full blur-3xl opacity-15 animate-pulse" style={{
        animationDelay: '2s'
      }}></div>
      </div>

      {/* Particle System */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-sigma-cyan-400 rounded-full animate-float opacity-40" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 4}s`
      }} />)}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Text Content - First */}
          <div className="text-left order-1 pt-5 mt-14">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
              <span className="block bg-gradient-to-r from-sigma-cyan-400 via-white to-sigma-teal-400 bg-clip-text text-transparent light-sweep">
                Transforme sua
              </span>
              <span className="block text-white/90 mt-2">
                gestão financeira
              </span>
              <span className="block text-white/90 mt-2 text-3xl md:text-4xl lg:text-5xl">
                com liberdade e autonomia
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed animate-slide-in-left max-w-2xl" style={{
            animationDelay: '0.3s'
          }}>
              Receba pagamentos, faça transferências, pague contas e boletos direto da sua conta. 
              Uma solução sob medida, pensada pra quem quer praticidade e controle total do fluxo financeiro, 
              sem intermediários, sem complicação.
            </p>

            <p className="text-base md:text-lg text-sigma-cyan-200 mb-8 leading-relaxed animate-slide-in-left max-w-2xl" style={{
            animationDelay: '0.4s'
          }}>
              ✓ Pagamento de boletos direto pela plataforma<br />
              ✓ Gestão inteligente de recebíveis<br />
              ✓ Transferências e PIX instantâneos, sem limites
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-right" style={{
            animationDelay: '0.6s'
          }}>
              <Button size="lg" onClick={handleWhatsAppClick} className="bg-gradient-to-r from-sigma-teal-500 to-sigma-cyan-600 hover:from-sigma-teal-600 hover:to-sigma-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                Entre em Contato
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 animate-scale-in" style={{
            animationDelay: '0.9s'
          }}>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">+5.000</div>
                <div className="text-sm text-gray-400">Parceiros de negócios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">R$ 2M+</div>
                <div className="text-sm text-gray-400">Processados mensalmente</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">99,9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </div>

          {/* Card Animation - Second */}
          <div className="flex justify-center items-center order-2 mb-7">
            <div className="relative w-80 h-48 cursor-pointer transition-all duration-700 hover:scale-105" style={{
            perspective: '1000px',
            animation: 'gentle-float 6s ease-in-out infinite'
          }} onClick={handleCardClick}>
              <div className="absolute inset-0 w-full h-full transition-transform duration-700" style={{
              transformStyle: 'preserve-3d',
              transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}>
                {/* Card Front */}
                <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-sigma-teal-600 via-sigma-cyan-600 to-sigma-teal-700 shadow-2xl border border-white/20" style={{
                backfaceVisibility: 'hidden'
              }}>
                  <div className="p-6 h-full flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs opacity-75 mb-1">SIGMA PAY</div>
                        <div className="text-lg font-bold">**** **** **** 1234</div>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white/40 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-75">VÁLIDO ATÉ</div>
                        <div className="text-sm font-semibold">12/28</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-75">JOÃO SILVA</div>
                        <div className="text-lg font-bold">Σ</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Back */}
                <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-sigma-slate-800 to-sigma-slate-900 shadow-2xl border border-white/20" style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}>
                  <div className="p-6 h-full flex flex-col text-white">
                    <div className="h-8 bg-black mb-4 rounded"></div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-center mb-4">
                        <div className="text-xs opacity-75 mb-2">CÓDIGO CVV</div>
                        <div className="text-2xl font-bold tracking-wider">•••</div>
                      </div>
                      <div className="text-center text-xs opacity-75">
                        Pague boletos, contas e transfira<br />
                        diretamente pela plataforma
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sigma-teal-500/10 to-sigma-cyan-500/10 blur-xl scale-110 opacity-30 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ImmersiveHero;