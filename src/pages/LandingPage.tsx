
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Smartphone,
  BarChart3,
  CreditCard,
  DollarSign
} from "lucide-react";
import { PATHS } from "@/routes/paths";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              SP
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              SigmaPay
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Recursos
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Preços
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Depoimentos
            </a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Contato
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to={PATHS.LOGIN}>
              <Button variant="ghost" className="font-medium">Entrar</Button>
            </Link>
            <Link to={PATHS.REGISTER}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-700/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Plataforma #1 em Gestão de Pagamentos
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Revolucione sua</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Gestão Financeira
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Simplifique o controle de vendas, pagamentos e comissões com nossa plataforma 
              inteligente. Tudo que você precisa para escalar seu negócio.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to={PATHS.REGISTER}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium text-lg px-8 py-4">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-gray-300 hover:bg-gray-50">
                Agendar Demo
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Setup em 5 minutos
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Sem taxa de adesão
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Suporte 24/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">5K+</div>
              <div className="text-gray-600">Clientes Ativos</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">R$ 50M+</div>
              <div className="text-gray-600">Processado/Mês</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">4.9★</div>
              <div className="text-gray-600">Avaliação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Recursos que <span className="text-blue-600">Impulsionam</span> Resultados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ferramentas poderosas para automatizar processos e maximizar sua eficiência operacional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CreditCard,
                title: "Gestão de Pagamentos",
                description: "Controle completo de PIX, TED e boletos com aprovação automática e manual",
                color: "blue"
              },
              {
                icon: BarChart3,
                title: "Analytics Avançado",
                description: "Dashboards inteligentes com insights em tempo real sobre seu negócio",
                color: "green"
              },
              {
                icon: Users,
                title: "Gestão de Clientes",
                description: "CRM integrado para gerenciar clientes, parceiros e suas comissões",
                color: "purple"
              },
              {
                icon: Smartphone,
                title: "Controle de Máquinas",
                description: "Monitoramento completo do ciclo de vida das maquininhas",
                color: "orange"
              },
              {
                icon: Shield,
                title: "Segurança Total",
                description: "Criptografia de ponta e auditoria completa de todas as operações",
                color: "red"
              },
              {
                icon: Globe,
                title: "API Robusta",
                description: "Integre facilmente com seus sistemas existentes via nossa API RESTful",
                color: "indigo"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group">
                <CardContent className="p-0">
                  <div className={`w-14 h-14 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              O que nossos <span className="text-blue-600">clientes</span> dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mais de 5.000 empresas confiam no SigmaPay para gerenciar seus negócios
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Carlos Silva",
                role: "CEO, TechPay Solutions",
                content: "O SigmaPay revolucionou nossa operação. Reduzimos 80% do tempo gasto em processos manuais.",
                rating: 5
              },
              {
                name: "Ana Costa",
                role: "Diretora Financeira, PayFlow",
                content: "Interface intuitiva e suporte excepcional. Nossa equipe se adaptou rapidamente à plataforma.",
                rating: 5
              },
              {
                name: "Roberto Lima",
                role: "Fundador, QuickPay",
                content: "A melhor decisão que tomamos foi migrar para o SigmaPay. ROI positivo em apenas 2 meses.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Planos que <span className="text-blue-600">Crescem</span> com Você
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para seu negócio. Sem surpresas, sem taxas ocultas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Grátis",
                period: "para sempre",
                description: "Perfeito para começar",
                features: [
                  "Até 100 transações/mês",
                  "Dashboard básico",
                  "Suporte por email",
                  "2 usuários"
                ],
                cta: "Começar Grátis",
                popular: false
              },
              {
                name: "Professional",
                price: "R$ 97",
                period: "/mês",
                description: "Para empresas em crescimento",
                features: [
                  "Transações ilimitadas",
                  "Dashboard avançado",
                  "Suporte prioritário",
                  "Usuários ilimitados",
                  "API completa",
                  "Relatórios customizados"
                ],
                cta: "Teste Grátis",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Customizado",
                period: "",
                description: "Para grandes operações",
                features: [
                  "Tudo do Professional",
                  "Integração dedicada",
                  "Account manager",
                  "SLA garantido",
                  "Treinamento incluso"
                ],
                cta: "Falar com Vendas",
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`p-8 relative ${plan.popular ? 'ring-2 ring-blue-500 bg-white' : 'bg-white/80'} hover:shadow-xl transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'} text-white font-medium`}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Pronto para <span className="text-yellow-300">Transformar</span> seu Negócio?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empresas que já escolheram o SigmaPay como sua plataforma de gestão financeira
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to={PATHS.REGISTER}>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-medium text-lg px-8 py-4">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
              Agendar Demonstração
            </Button>
          </div>
          
          <p className="text-blue-200 text-sm">
            ✓ Setup em 5 minutos ✓ Sem cartão de crédito ✓ Suporte gratuito
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                  SP
                </div>
                <span className="text-2xl font-bold">SigmaPay</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                A plataforma mais completa para gestão de pagamentos e vendas do Brasil.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">tw</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Produto</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Empresa</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Imprensa</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Suporte</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Comunidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2024 SigmaPay. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
