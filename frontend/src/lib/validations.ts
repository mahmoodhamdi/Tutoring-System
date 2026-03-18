import { z } from 'zod';

// Common validation schemas

export const phoneSchema = z
  .string()
  .min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل')
  .regex(/^\+?[0-9]+$/, 'صيغة رقم الهاتف غير صالحة');

export const emailSchema = z
  .string()
  .email('البريد الإلكتروني غير صالح')
  .optional()
  .or(z.literal(''));

export const passwordSchema = z
  .string()
  .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
  .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل')
  .regex(/[a-z]/, 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل')
  .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');

// Auth schemas
export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  password_confirmation: z.string(),
  role: z.enum(['student', 'parent']),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'كلمة المرور غير متطابقة',
  path: ['password_confirmation'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: passwordSchema,
  password_confirmation: z.string(),
  token: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'كلمة المرور غير متطابقة',
  path: ['password_confirmation'],
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  password: passwordSchema,
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'كلمة المرور غير متطابقة',
  path: ['password_confirmation'],
});

// Student schemas
export const studentSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: emailSchema,
  phone: phoneSchema,
  date_of_birth: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  address: z.string().optional(),
  school_name: z.string().optional(),
  grade_level: z.string().optional(),
  parent_name: z.string().optional(),
  parent_phone: phoneSchema.optional(),
  secondary_phone: phoneSchema.optional(),
  notes: z.string().optional(),
});

// Group schemas
export const groupSchema = z.object({
  name: z.string().min(2, 'اسم المجموعة يجب أن يكون حرفين على الأقل'),
  subject: z.string().min(1, 'المادة مطلوبة'),
  grade_level: z.string().min(1, 'المرحلة الدراسية مطلوبة'),
  description: z.string().optional(),
  monthly_fee: z.number().min(0, 'الرسوم الشهرية يجب أن تكون صفر أو أكثر'),
  max_students: z.number().int().positive().optional(),
  status: z.enum(['active', 'inactive', 'completed']).default('active'),
});

// Session schemas
export const sessionSchema = z.object({
  group_id: z.number().int().positive('يجب اختيار المجموعة'),
  session_date: z.string().min(1, 'تاريخ الجلسة مطلوب'),
  start_time: z.string().min(1, 'وقت البداية مطلوب'),
  end_time: z.string().min(1, 'وقت النهاية مطلوب'),
  topic: z.string().optional(),
  notes: z.string().optional(),
  location: z.string().optional(),
});

// Payment schemas
export const paymentSchema = z.object({
  student_id: z.number().int().positive('يجب اختيار الطالب'),
  group_id: z.number().int().positive().optional(),
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  method: z.enum(['cash', 'bank_transfer', 'wallet']).default('cash'),
  payment_date: z.string().min(1, 'تاريخ الدفع مطلوب'),
  notes: z.string().optional(),
});

// Exam schemas
export const examSchema = z.object({
  group_id: z.number().int().positive('يجب اختيار المجموعة'),
  title: z.string().min(2, 'العنوان يجب أن يكون حرفين على الأقل'),
  description: z.string().optional(),
  type: z.enum(['quiz', 'midterm', 'final', 'assignment']).default('quiz'),
  total_marks: z.number().positive('الدرجة الكلية يجب أن تكون أكبر من صفر'),
  exam_date: z.string().min(1, 'تاريخ الاختبار مطلوب'),
  start_time: z.string().optional(),
  duration_minutes: z.number().int().positive().optional(),
});

// Announcement schemas
export const announcementSchema = z.object({
  title: z.string().min(2, 'العنوان يجب أن يكون حرفين على الأقل'),
  content: z.string().min(10, 'المحتوى يجب أن يكون 10 أحرف على الأقل'),
  type: z.enum(['general', 'exam', 'payment', 'schedule', 'important']).default('general'),
  target: z.enum(['all', 'group', 'student']).default('all'),
  group_id: z.number().int().positive().optional(),
  is_pinned: z.boolean().default(false),
  publish_at: z.string().optional(),
  expires_at: z.string().optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type GroupInput = z.infer<typeof groupSchema>;
export type SessionInput = z.infer<typeof sessionSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type ExamInput = z.infer<typeof examSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
