import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api/payments';
import { PaymentListParams, PaymentFormData } from '@/types/payment';
import { toast } from 'react-hot-toast';

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (params: PaymentListParams) => [...paymentKeys.lists(), params] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: number) => [...paymentKeys.details(), id] as const,
  pending: (params?: object) => [...paymentKeys.all, 'pending', params] as const,
  overdue: (params?: object) => [...paymentKeys.all, 'overdue', params] as const,
  report: (params?: object) => [...paymentKeys.all, 'report', params] as const,
};

export function usePayments(params: PaymentListParams = {}) {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => paymentsApi.list(params),
  });
}

export function usePayment(id: number) {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentsApi.get(id),
    enabled: !!id,
  });
}

export function usePendingPayments(params: { group_id?: number } = {}) {
  return useQuery({
    queryKey: paymentKeys.pending(params),
    queryFn: () => paymentsApi.pending(params),
  });
}

export function useOverduePayments(params: { group_id?: number } = {}) {
  return useQuery({
    queryKey: paymentKeys.overdue(params),
    queryFn: () => paymentsApi.overdue(params),
  });
}

export function usePaymentReport(
  params: {
    group_id?: number;
    start_date?: string;
    end_date?: string;
    period_month?: number;
    period_year?: number;
  } = {}
) {
  return useQuery({
    queryKey: paymentKeys.report(params),
    queryFn: () => paymentsApi.getReport(params),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PaymentFormData) => paymentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.pending() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.overdue() });
      toast.success('تم تسجيل الدفعة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تسجيل الدفعة');
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PaymentFormData> }) =>
      paymentsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: paymentKeys.pending() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.overdue() });
      toast.success('تم تحديث الدفعة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث الدفعة');
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => paymentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.pending() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.overdue() });
      toast.success('تم حذف الدفعة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف الدفعة');
    },
  });
}
