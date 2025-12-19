import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';

interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Standard error messages in Arabic
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: 'طلب غير صالح',
  401: 'غير مصرح. يرجى تسجيل الدخول',
  403: 'غير مسموح لك بهذا الإجراء',
  404: 'العنصر غير موجود',
  405: 'طريقة الطلب غير مسموحة',
  422: 'بيانات غير صالحة',
  429: 'طلبات كثيرة. يرجى الانتظار',
  500: 'حدث خطأ في الخادم',
  502: 'الخادم غير متاح حالياً',
  503: 'الخدمة غير متاحة',
};

/**
 * Extract error message from API response
 */
export function getErrorMessage(error: unknown): string {
  if (!error) {
    return 'حدث خطأ غير متوقع';
  }

  // Axios error with response
  if (isAxiosError(error) && error.response) {
    const data = error.response.data as ApiError;

    // Use API message if available
    if (data?.message) {
      return data.message;
    }

    // Use status code message
    const statusMessage = ERROR_MESSAGES[error.response.status];
    if (statusMessage) {
      return statusMessage;
    }
  }

  // Axios error without response (network error)
  if (isAxiosError(error) && !error.response) {
    return 'خطأ في الاتصال بالخادم';
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  return 'حدث خطأ غير متوقع';
}

/**
 * Get validation errors from API response
 */
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (isAxiosError(error) && error.response?.status === 422) {
    const data = error.response.data as ApiError;
    return data?.errors || null;
  }
  return null;
}

/**
 * Handle error with toast notification
 */
export function handleError(error: unknown, customMessage?: string): void {
  const message = customMessage || getErrorMessage(error);
  toast.error(message);
}

/**
 * Handle success with toast notification
 */
export function handleSuccess(message: string): void {
  toast.success(message);
}

/**
 * Handle API mutation result
 */
export function handleMutationResult(
  error: unknown,
  successMessage?: string,
  errorMessage?: string
): boolean {
  if (error) {
    handleError(error, errorMessage);
    return false;
  }

  if (successMessage) {
    handleSuccess(successMessage);
  }
  return true;
}

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError)?.isAxiosError === true;
}

/**
 * Common success messages
 */
export const SUCCESS_MESSAGES = {
  created: 'تم الإنشاء بنجاح',
  updated: 'تم التحديث بنجاح',
  deleted: 'تم الحذف بنجاح',
  saved: 'تم الحفظ بنجاح',
  sent: 'تم الإرسال بنجاح',
  login: 'تم تسجيل الدخول بنجاح',
  logout: 'تم تسجيل الخروج بنجاح',
  copied: 'تم النسخ',
};

/**
 * Common form field error messages
 */
export const FIELD_ERRORS: Record<string, Record<string, string>> = {
  required: {
    name: 'الاسم مطلوب',
    email: 'البريد الإلكتروني مطلوب',
    phone: 'رقم الهاتف مطلوب',
    password: 'كلمة المرور مطلوبة',
    amount: 'المبلغ مطلوب',
    date: 'التاريخ مطلوب',
    title: 'العنوان مطلوب',
    content: 'المحتوى مطلوب',
  },
  invalid: {
    email: 'البريد الإلكتروني غير صالح',
    phone: 'رقم الهاتف غير صالح',
    date: 'التاريخ غير صالح',
    amount: 'المبلغ غير صالح',
  },
};
