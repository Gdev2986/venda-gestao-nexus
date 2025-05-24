import { supabase } from '@/integrations/supabase/client';
import { Payment, PaymentStatus, PaymentType, PaymentFilters, PaymentHistory } from '@/types/payment.types';

export class PaymentsService {
  /**
   * Busca todos os pagamentos com filtros opcionais
   */
  static async getPayments(filters: PaymentFilters = {}, page = 1, limit = 25) {
    try {
      let query = supabase
        .from('payment_requests')
        .select(`
          id,
          client_id,
          type,
          value,
          status,
          note,
          proof_url,
          boleto_url,
          created_at,
          updated_at,
          clients:client_id (
            business_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters.client_id) {
        query = query.eq('client_id', filters.client_id);
      }
      
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      // Paginação
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Transformar dados para o formato esperado
      const payments: Payment[] = (data || []).map(item => ({
        id: item.id,
        client_id: item.client_id,
        client_name: item.clients?.business_name,
        client_email: item.clients?.email,
        type: item.type as PaymentType,
        value: item.value,
        status: item.status as PaymentStatus,
        note: item.note,
        proof_url: item.proof_url,
        boleto_url: item.boleto_url,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      return {
        data: payments,
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      throw error;
    }
  }

  /**
   * Busca um pagamento específico por ID
   */
  static async getPaymentById(id: string): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select(`
          id,
          client_id,
          type,
          value,
          status,
          note,
          proof_url,
          boleto_url,
          created_at,
          updated_at,
          clients:client_id (
            business_name,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) return null;

      return {
        id: data.id,
        client_id: data.client_id,
        client_name: data.clients?.business_name,
        client_email: data.clients?.email,
        type: data.type as PaymentType,
        value: data.value,
        status: data.status as PaymentStatus,
        note: data.note,
        proof_url: data.proof_url,
        boleto_url: data.boleto_url,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error);
      throw error;
    }
  }

  /**
   * Atualiza o status de um pagamento (apenas admin)
   */
  static async updatePaymentStatus(
    paymentId: string, 
    status: PaymentStatus, 
    note?: string
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (note) {
        updateData.note = note;
      }

      const { error } = await supabase
        .from('payment_requests')
        .update(updateData)
        .eq('id', paymentId);

      if (error) throw error;

      // Criar entrada no histórico
      await this.createPaymentHistory(paymentId, status, note);

      // Enviar notificação para o cliente
      await this.notifyStatusChange(paymentId, status);
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error);
      throw error;
    }
  }

  /**
   * Upload de comprovante de pagamento (apenas admin)
   */
  static async uploadProof(paymentId: string, file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `payment-proof-${paymentId}-${Date.now()}.${fileExt}`;
      const filePath = `payment-proofs/${fileName}`;

      // Upload do arquivo para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const proofUrl = urlData.publicUrl;

      // Atualizar o pagamento com a URL do comprovante
      const { error: updateError } = await supabase
        .from('payment_requests')
        .update({ 
          proof_url: proofUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (updateError) throw updateError;

      // Notificar cliente sobre o comprovante
      await this.notifyProofUploaded(paymentId);

      return proofUrl;
    } catch (error) {
      console.error('Erro ao fazer upload do comprovante:', error);
      throw error;
    }
  }

  /**
   * Criar entrada no histórico de pagamentos
   */
  private static async createPaymentHistory(
    paymentId: string,
    status: PaymentStatus,
    note?: string
  ): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('payment_history')
        .insert({
          payment_id: paymentId,
          status,
          note,
          created_by: userData.user?.id,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao criar histórico de pagamento:', error);
      // Não propagar erro para não afetar operação principal
    }
  }

  /**
   * Buscar histórico de um pagamento
   */
  static async getPaymentHistory(paymentId: string): Promise<PaymentHistory[]> {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select(`
          id,
          payment_id,
          status,
          note,
          created_by,
          created_at,
          profiles:created_by (
            name,
            email
          )
        `)
        .eq('payment_id', paymentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        payment_id: item.payment_id,
        status: item.status as PaymentStatus,
        note: item.note,
        created_by: item.created_by,
        created_at: item.created_at
      }));
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  }

  /**
   * Enviar notificação de mudança de status
   */
  private static async notifyStatusChange(
    paymentId: string,
    status: PaymentStatus
  ): Promise<void> {
    try {
      // Buscar dados do pagamento para notificação
      const payment = await this.getPaymentById(paymentId);
      if (!payment) return;

      const statusMessages = {
        [PaymentStatus.APPROVED]: 'Sua solicitação de pagamento foi aprovada!',
        [PaymentStatus.REJECTED]: 'Sua solicitação de pagamento foi rejeitada.',
        [PaymentStatus.PROCESSED]: 'Seu pagamento foi processado e finalizado.',
        [PaymentStatus.AWAITING]: 'Sua solicitação está aguardando análise.'
      };

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: payment.client_id,
          title: 'Status do Pagamento Atualizado',
          message: statusMessages[status],
          type: 'PAYMENT_UPDATE',
          data: {
            payment_id: paymentId,
            status,
            value: payment.value
          }
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      // Não propagar erro para não afetar operação principal
    }
  }

  /**
   * Notificar cliente sobre upload de comprovante
   */
  private static async notifyProofUploaded(paymentId: string): Promise<void> {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) return;

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: payment.client_id,
          title: 'Comprovante de Pagamento Disponível',
          message: 'O comprovante do seu pagamento foi enviado e está disponível para download.',
          type: 'PAYMENT_PROOF',
          data: {
            payment_id: paymentId,
            proof_url: payment.proof_url
          }
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao notificar sobre comprovante:', error);
    }
  }

  /**
   * Buscar pagamentos do cliente logado
   */
  static async getClientPayments(clientId: string, page = 1, limit = 25) {
    return this.getPayments({ client_id: clientId }, page, limit);
  }
} 