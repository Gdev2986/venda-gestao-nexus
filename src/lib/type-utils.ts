
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
    // Map each possible role string to the enum
    if (upperRole === 'ADMIN') return UserRole.ADMIN;
    if (upperRole === 'CLIENT') return UserRole.CLIENT;
    if (upperRole === 'FINANCIAL' || upperRole === 'FINANCE') return UserRole.FINANCIAL;
    if (upperRole === 'LOGISTICS') return UserRole.LOGISTICS;
    if (upperRole === 'PARTNER') return UserRole.PARTNER;
    if (upperRole === 'USER') return UserRole.USER;
    
    // Default for unknown roles
    console.warn(`Unknown role: ${role}, defaulting to CLIENT`);
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
