
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, MessageSquare, Book, Phone, Mail } from "lucide-react";

const ClientHelp = () => {
  const faqItems = [
    {
      question: "Como solicitar um pagamento?",
      answer: "Acesse 'Meus Pagamentos' e clique em 'Solicitar Pagamento'. Preencha o valor e aguarde a aprovação."
    },
    {
      question: "Quando recebo meus pagamentos?",
      answer: "Pagamentos aprovados são processados em até 2 dias úteis após a aprovação."
    },
    {
      question: "Como acompanhar minhas vendas?",
      answer: "No Dashboard você pode ver um resumo completo das suas vendas e transações."
    },
    {
      question: "Minha máquina está com problema, o que fazer?",
      answer: "Abra um chamado de suporte técnico na seção 'Suporte' informando o problema."
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Central de Ajuda"
        description="Encontre respostas para suas dúvidas e entre em contato conosco"
      />
      
      {/* Busca */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar na central de ajuda..." 
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Links Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <MessageSquare className="h-8 w-8 mx-auto text-green-600" />
            <CardTitle>Abrir Chamado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Precisa de ajuda técnica? Abra um chamado.
            </p>
            <Button variant="outline" size="sm">
              Novo Chamado
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Book className="h-8 w-8 mx-auto text-purple-600" />
            <CardTitle>Manual do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Acesse o manual completo da plataforma.
            </p>
            <Button variant="outline" size="sm">
              Ver Manual
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Phone className="h-8 w-8 mx-auto text-orange-600" />
            <CardTitle>Contato Direto</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Fale diretamente com nosso suporte.
            </p>
            <Button variant="outline" size="sm">
              Entrar em Contato
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium">{item.question}</h4>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
              {index < faqItems.length - 1 && <hr className="my-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contato */}
      <Card className="border-l-4 border-l-teal-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-teal-600" />
            Entre em Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Suporte Técnico:</strong><br />
              suporte@sigmapay.com.br<br />
              (11) 9999-9999
            </div>
            <div>
              <strong>Comercial:</strong><br />
              comercial@sigmapay.com.br<br />
              (11) 8888-8888
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Horário de atendimento: Segunda à Sexta, 8h às 18h
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientHelp;
