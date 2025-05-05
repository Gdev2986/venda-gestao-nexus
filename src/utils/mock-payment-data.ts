
import { Payment, PaymentStatus, PaymentType } from "@/types";

// Mock payment requests data for development
export const getMockPaymentRequests = (): Payment[] => {
  return [
    {
      id: "1",
      amount: 1500.0,
      status: PaymentStatus.PAID,
      created_at: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      updated_at: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      client_id: "client-1",
      description: "Pagamento mensal",
      receipt_url: "https://example.com/receipt1",
      payment_type: PaymentType.PIX,
      rejection_reason: null
    },
    {
      id: "2",
      amount: 2500.0,
      status: PaymentStatus.APPROVED,
      created_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      updated_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      client_id: "client-1",
      description: "Retirada parcial",
      payment_type: PaymentType.TED,
      bank_info: {
        bank_name: "Banco XYZ",
        branch_number: "0001",
        account_number: "123456-7",
        account_holder: "João Silva"
      },
      rejection_reason: null
    },
    {
      id: "3",
      amount: 800.0,
      status: PaymentStatus.PENDING,
      created_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      updated_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      client_id: "client-1",
      description: "Pagamento emergencial",
      payment_type: PaymentType.PIX,
      rejection_reason: null
    },
    {
      id: "4",
      amount: 300.0,
      status: PaymentStatus.REJECTED,
      created_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
      updated_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
      client_id: "client-1",
      description: "Estorno",
      payment_type: PaymentType.BOLETO,
      document_url: "https://example.com/boleto1.pdf",
      rejection_reason: "Documento inválido"
    }
  ];
};

// Mock pix keys data for development
export const getMockPixKeys = () => {
  return [
    {
      id: "1",
      user_id: "user_1",
      key_type: "CPF",
      type: "CPF",
      key: "123.456.789-00",
      owner_name: "Minha chave principal",
      name: "Minha chave principal",
      isDefault: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      bank_name: "Banco"
    },
    {
      id: "2",
      user_id: "user_1",
      key_type: "EMAIL",
      type: "EMAIL",
      key: "email@exemplo.com",
      owner_name: "Email pessoal",
      name: "Email pessoal",
      isDefault: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      bank_name: "Banco"
    },
  ];
};
