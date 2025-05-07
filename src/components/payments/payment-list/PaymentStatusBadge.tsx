
import { PaymentStatus } from '@/types';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
      ${status === PaymentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : ''}
      ${status === PaymentStatus.APPROVED ? 'bg-green-100 text-green-800' : ''}
      ${status === PaymentStatus.REJECTED ? 'bg-red-100 text-red-800' : ''}
      ${status === PaymentStatus.PAID ? 'bg-blue-100 text-blue-800' : ''}
      `}
    >
      {status}
    </span>
  );
};
