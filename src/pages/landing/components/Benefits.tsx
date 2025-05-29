
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Smartphone, BarChart, Shield, Clock, Zap } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: CreditCard,
      title: "Múltiplas formas de pagamento",
      description: "Aceite cartões de crédito, débito, PIX e transferências em uma única solução integrada."
    },
    {
      icon: Smartphone,
      title: "Máquina personalizada",
      description: "Equipamento com sua marca e identidade visual, fortalecendo seu negócio."
    },
    {
      icon: BarChart,
      title: "Gestão financeira completa",
      description: "Controle total das suas finanças com relatórios detalhados e análises em tempo real."
    },
    {
      icon: Shield,
      title: "Segurança máxima",
      description: "Transações protegidas com certificação PCI DSS e criptografia de ponta."
    },
    {
      icon: Clock,
      title: "Repasse automático",
      description: "Receba seus pagamentos automaticamente sem burocracias ou atrasos."
    },
    {
      icon: Zap,
      title: "Pagamento de contas",
      description: "Pague suas contas diretamente pela plataforma e mantenha tudo organizado."
    }
  ];

  return (
    <section id="beneficios" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-sigma-indigo-900 mb-6">
            Por que escolher a Sigma Pay?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Uma solução completa que vai além do processamento de pagamentos, 
            oferecendo gestão financeira inteligente para o seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sigma-indigo-500 to-sigma-blue-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-sigma-indigo-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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

export default Benefits;
