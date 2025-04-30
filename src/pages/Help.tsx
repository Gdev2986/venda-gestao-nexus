import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, CreditCard, HelpCircle, UserPlus, Settings, Wallet } from "lucide-react";

const faqCategories = [
  {
    id: "account",
    label: "Conta e Acesso",
    icon: UserPlus,
    faqs: [
      {
        question: "Como alterar minha senha?",
        answer: "Para alterar sua senha, acesse a página de Configurações no menu lateral, clique na aba 'Perfil' e selecione a opção 'Alterar senha'. Você precisará informar sua senha atual e a nova senha."
      },
      {
        question: "Esqueci minha senha, como recuperar?",
        answer: "Na tela de login, clique em 'Esqueci minha senha'. Você receberá um e-mail com instruções para redefinir sua senha. Se não receber o e-mail, verifique sua pasta de spam ou entre em contato com o suporte."
      },
      {
        question: "Como atualizar meus dados de contato?",
        answer: "Acesse a página de Configurações através do menu lateral, clique na aba 'Perfil' e atualize seus dados de contato. Lembre-se de clicar em 'Salvar' após fazer as alterações."
      }
    ]
  },
  {
    id: "payments",
    label: "Pagamentos",
    icon: Wallet,
    faqs: [
      {
        question: "Como solicitar um pagamento?",
        answer: "Para solicitar um pagamento, acesse a página 'Pagamentos' no menu lateral e clique no botão 'Nova Solicitação'. Preencha o valor desejado, selecione o método de pagamento (PIX, TED ou Boleto) e confirme a solicitação."
      },
      {
        question: "Quanto tempo leva para aprovar um pagamento?",
        answer: "Os pagamentos são analisados em até 24 horas úteis. Após a aprovação, o valor é transferido conforme o método escolhido: PIX (imediato), TED (até 2 horas em dias úteis) ou Boleto (até 3 dias úteis após o pagamento)."
      },
      {
        question: "Por que meu pagamento foi rejeitado?",
        answer: "Um pagamento pode ser rejeitado por diversos motivos, como saldo insuficiente, dados incompletos ou inconsistentes, ou problemas com o comprovante enviado. Verifique a mensagem de rejeição para entender o motivo específico e como proceder."
      },
      {
        question: "Como enviar um comprovante de pagamento?",
        answer: "Após realizar o pagamento de um boleto, acesse a página 'Pagamentos', localize o pagamento na lista e clique em 'Detalhes'. Na tela de detalhes, você encontrará a opção 'Enviar Comprovante'."
      }
    ]
  },
  {
    id: "sales",
    label: "Vendas e Relatórios",
    icon: FileText,
    faqs: [
      {
        question: "Como verificar minhas vendas?",
        answer: "Acesse a página 'Vendas' no menu lateral para visualizar todas as suas transações. Você pode filtrar por período, método de pagamento e terminal, além de exportar os dados para Excel ou PDF."
      },
      {
        question: "O que significa cada status de venda?",
        answer: "Nas vendas, os status possíveis são: 'Pendente' (transação em processamento), 'Aprovada' (transação concluída com sucesso), 'Rejeitada' (transação não aprovada) e 'Estornada' (valor devolvido ao cliente)."
      },
      {
        question: "Como gerar um relatório personalizado?",
        answer: "Acesse a página 'Relatórios' no menu lateral, selecione o tipo de relatório desejado, ajuste os filtros disponíveis (data, cliente, método de pagamento) e clique em 'Gerar Relatório'. Você pode exportar o relatório em diferentes formatos."
      }
    ]
  },
  {
    id: "commission",
    label: "Comissões",
    icon: CreditCard,
    faqs: [
      {
        question: "Como as comissões são calculadas?",
        answer: "As comissões são calculadas automaticamente com base nas vendas dos clientes vinculados ao seu perfil de parceiro. A porcentagem varia conforme o contrato estabelecido e é aplicada sobre o valor líquido das transações."
      },
      {
        question: "Quando as comissões são pagas?",
        answer: "As comissões são contabilizadas diariamente, mas o pagamento é realizado mensalmente, até o 5º dia útil do mês subsequente, mediante solicitação através da plataforma na seção 'Pagamentos'."
      },
      {
        question: "Como vincular um cliente ao meu perfil de parceiro?",
        answer: "Para vincular um cliente, acesse a página 'Clientes', clique em 'Novo Cliente' e preencha os dados. Durante o cadastro, o cliente será automaticamente vinculado ao seu perfil de parceiro."
      }
    ]
  },
  {
    id: "settings",
    label: "Configurações",
    icon: Settings,
    faqs: [
      {
        question: "Como cadastrar uma chave PIX?",
        answer: "Acesse a página de Configurações no menu lateral, selecione a aba 'Chaves PIX' e clique em 'Adicionar Nova Chave'. Preencha o tipo de chave (CPF, e-mail, telefone), o valor e um nome de identificação."
      },
      {
        question: "Como configurar notificações?",
        answer: "Acesse a página de Configurações, selecione a aba 'Notificações' e escolha quais tipos de alertas deseja receber por e-mail ou na plataforma. Você pode configurar notificações para pagamentos, vendas e suporte."
      },
      {
        question: "O que fazer se as informações estiverem incorretas?",
        answer: "Caso encontre informações incorretas em seu cadastro ou transações, acesse imediatamente o suporte através do menu 'Suporte' ou envie um e-mail para suporte@sigmapay.com.br detalhando o problema."
      }
    ]
  }
];

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("account");
  
  const filteredFaqs = searchQuery 
    ? faqCategories.flatMap(category => 
        category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(faq => ({ ...faq, category: category.id }))
      )
    : [];
  
  const activeCategoryFaqs = faqCategories.find(cat => cat.id === activeCategory)?.faqs || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Central de Ajuda</h1>
        <p className="text-muted-foreground">
          Encontre respostas para dúvidas comuns e aprenda a utilizar a plataforma
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Ajuda
          </CardTitle>
          <CardDescription>
            Digite uma palavra-chave ou pergunta para encontrar ajuda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Ex: Como solicitar um pagamento?" 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {searchQuery && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Resultados da pesquisa:</h3>
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`search-${idx}`}>
                      <AccordionTrigger className="text-left">
                        <div>
                          <div>{faq.question}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Categoria: {faqCategories.find(cat => cat.id === faq.category)?.label}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-4">{faq.answer}</div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <HelpCircle className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="font-medium">Nenhum resultado encontrado</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tente buscar com outras palavras-chave ou entre em contato com o suporte
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Perguntas Frequentes
          </CardTitle>
          <CardDescription>
            Respostas para as dúvidas mais comuns sobre a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="w-full gap-1 flex-wrap">
              {faqCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="gap-1">
                  <category.icon className="h-4 w-4 mr-1" />
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {faqCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="pt-4">
                <Accordion type="single" collapsible className="w-full">
                  {activeCategoryFaqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-4">{faq.answer}</div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="bg-muted p-6 rounded-lg mt-6">
        <div className="flex flex-col items-center text-center">
          <HelpCircle className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Ainda com dúvidas?</h2>
          <p className="text-muted-foreground mb-4">
            Se você não encontrou o que procurava, entre em contato com nossa equipe de suporte.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <a 
              href="mailto:suporte@sigmapay.com.br" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              Enviar Email
            </a>
            <a 
              href="/support" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
            >
              Abrir Chamado
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
