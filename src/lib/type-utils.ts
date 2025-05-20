
import { UserRole, PaymentStatus } from "@/types/enums";

/**
 * Converte uma string para um valor do enum PaymentStatus
 */
export function toPaymentStatus(status: string | PaymentStatus): PaymentStatus {
  if (typeof status === 'string') {
    switch (status.toUpperCase()) {
      case 'PENDENTE': return PaymentStatus.PENDING;
      case 'EM_PROCESSAMENTO': return PaymentStatus.PROCESSING;
      case 'APROVADO': return PaymentStatus.APPROVED;
      case 'RECUSADO': return PaymentStatus.REJECTED;
      case 'PAGO': return PaymentStatus.PAID;
      default: return PaymentStatus.PROCESSING;
    }
  }
  return status;
}

/**
 * Converte uma string para um valor do enum UserRole
 */
export function toUserRole(role: string | UserRole): UserRole {
  if (typeof role === 'string') {
    const upperRole = role.toUpperCase();
    // Verifica se o role existe no enum UserRole
    if (Object.values(UserRole).includes(upperRole as UserRole)) {
      return upperRole as UserRole;
    }
    // Default para CLIENT se não encontrado
    return UserRole.CLIENT;
  }
  return role;
}

/**
 * Type guard para verificar se uma string é um UserRole válido
 */
export function isValidUserRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}
