
// Função para formatar moeda brasileira
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

// Função para formatar porcentagem
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

// Função para formatar data
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
};

// Função para formatar data e hora
export const formatDateTime = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

// Formatar números para exibição
export const formatNumber = (value: number, digits = 0): string => {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};

// Formatar CPF (XXX.XXX.XXX-XX)
export const formatCPF = (cpf: string): string => {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11) {
    return cpf;
  }
  
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Formatar CNPJ (XX.XXX.XXX/XXXX-XX)
export const formatCNPJ = (cnpj: string): string => {
  cnpj = cnpj.replace(/\D/g, '');
  
  if (cnpj.length !== 14) {
    return cnpj;
  }
  
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

// Formatar telefone ((XX) XXXXX-XXXX)
export const formatPhone = (phone: string): string => {
  phone = phone.replace(/\D/g, '');
  
  if (phone.length < 10) {
    return phone;
  }
  
  if (phone.length === 10) {
    return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  
  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
};
