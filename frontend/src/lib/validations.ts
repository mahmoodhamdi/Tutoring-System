import { z } from 'zod';

// Common validation schemas

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^\+?[0-9]+$/, 'Invalid phone number format');

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .optional()
  .or(z.literal(''));

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Auth schemas
export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  password_confirmation: z.string(),
  role: z.enum(['teacher', 'student', 'parent']),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  password_confirmation: z.string(),
  token: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  password: passwordSchema,
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

// Student schemas
export const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
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
  name: z.string().min(2, 'Group name must be at least 2 characters'),
  subject: z.string().min(1, 'Subject is required'),
  grade_level: z.string().min(1, 'Grade level is required'),
  description: z.string().optional(),
  monthly_fee: z.number().min(0, 'Monthly fee must be positive'),
  max_students: z.number().int().positive().optional(),
  status: z.enum(['active', 'inactive', 'completed']).default('active'),
});

// Session schemas
export const sessionSchema = z.object({
  group_id: z.number().int().positive('Group is required'),
  session_date: z.string().min(1, 'Session date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  topic: z.string().optional(),
  notes: z.string().optional(),
  location: z.string().optional(),
});

// Payment schemas
export const paymentSchema = z.object({
  student_id: z.number().int().positive('Student is required'),
  group_id: z.number().int().positive().optional(),
  amount: z.number().positive('Amount must be positive'),
  method: z.enum(['cash', 'bank_transfer', 'wallet']).default('cash'),
  payment_date: z.string().min(1, 'Payment date is required'),
  notes: z.string().optional(),
});

// Exam schemas
export const examSchema = z.object({
  group_id: z.number().int().positive('Group is required'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  type: z.enum(['quiz', 'midterm', 'final', 'assignment']).default('quiz'),
  total_marks: z.number().positive('Total marks must be positive'),
  exam_date: z.string().min(1, 'Exam date is required'),
  start_time: z.string().optional(),
  duration_minutes: z.number().int().positive().optional(),
});

// Announcement schemas
export const announcementSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
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
