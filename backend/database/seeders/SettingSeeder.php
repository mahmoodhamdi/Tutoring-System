<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General Settings
            [
                'key' => 'app_name',
                'value' => 'Tutoring System',
                'type' => 'string',
                'group' => 'general',
                'label' => 'اسم التطبيق',
                'description' => 'الاسم الذي سيظهر في واجهة التطبيق',
                'is_public' => true,
            ],
            [
                'key' => 'app_logo',
                'value' => null,
                'type' => 'string',
                'group' => 'general',
                'label' => 'شعار التطبيق',
                'description' => 'رابط صورة الشعار',
                'is_public' => true,
            ],
            [
                'key' => 'app_description',
                'value' => 'نظام إدارة الدروس الخصوصية',
                'type' => 'string',
                'group' => 'general',
                'label' => 'وصف التطبيق',
                'description' => 'وصف قصير للتطبيق',
                'is_public' => true,
            ],
            [
                'key' => 'timezone',
                'value' => 'Africa/Cairo',
                'type' => 'string',
                'group' => 'general',
                'label' => 'المنطقة الزمنية',
                'description' => 'المنطقة الزمنية الافتراضية للتطبيق',
                'is_public' => true,
            ],
            [
                'key' => 'language',
                'value' => 'ar',
                'type' => 'string',
                'group' => 'general',
                'label' => 'اللغة الافتراضية',
                'description' => 'اللغة الافتراضية للتطبيق',
                'is_public' => true,
            ],
            [
                'key' => 'currency',
                'value' => 'EGP',
                'type' => 'string',
                'group' => 'general',
                'label' => 'العملة',
                'description' => 'عملة المدفوعات الافتراضية',
                'is_public' => true,
            ],
            [
                'key' => 'currency_symbol',
                'value' => 'ج.م',
                'type' => 'string',
                'group' => 'general',
                'label' => 'رمز العملة',
                'description' => 'رمز العملة المعروض',
                'is_public' => true,
            ],

            // Session Settings
            [
                'key' => 'session_duration',
                'value' => '60',
                'type' => 'integer',
                'group' => 'sessions',
                'label' => 'مدة الجلسة الافتراضية',
                'description' => 'مدة الجلسة بالدقائق',
                'is_public' => false,
            ],
            [
                'key' => 'session_reminder_before',
                'value' => '30',
                'type' => 'integer',
                'group' => 'sessions',
                'label' => 'التذكير قبل الجلسة',
                'description' => 'إرسال تذكير قبل الجلسة بهذا العدد من الدقائق',
                'is_public' => false,
            ],
            [
                'key' => 'allow_session_cancellation',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'sessions',
                'label' => 'السماح بإلغاء الجلسات',
                'description' => 'السماح للمعلم بإلغاء الجلسات',
                'is_public' => false,
            ],

            // Payment Settings
            [
                'key' => 'payment_due_days',
                'value' => '7',
                'type' => 'integer',
                'group' => 'payments',
                'label' => 'أيام استحقاق الدفع',
                'description' => 'عدد الأيام المسموح بها للدفع قبل اعتباره متأخر',
                'is_public' => false,
            ],
            [
                'key' => 'payment_reminder_enabled',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'payments',
                'label' => 'تفعيل تذكيرات الدفع',
                'description' => 'إرسال تذكيرات تلقائية للمدفوعات المتأخرة',
                'is_public' => false,
            ],
            [
                'key' => 'payment_methods',
                'value' => json_encode(['cash', 'bank_transfer', 'online']),
                'type' => 'json',
                'group' => 'payments',
                'label' => 'طرق الدفع المتاحة',
                'description' => 'طرق الدفع المسموح بها',
                'is_public' => false,
            ],

            // Registration Settings
            [
                'key' => 'allow_student_registration',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'registration',
                'label' => 'السماح بتسجيل الطلاب',
                'description' => 'السماح للطلاب بالتسجيل ذاتياً',
                'is_public' => true,
            ],
            [
                'key' => 'allow_parent_registration',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'registration',
                'label' => 'السماح بتسجيل أولياء الأمور',
                'description' => 'السماح لأولياء الأمور بالتسجيل ذاتياً',
                'is_public' => true,
            ],
            [
                'key' => 'require_email_verification',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'registration',
                'label' => 'التحقق من البريد الإلكتروني',
                'description' => 'إلزام التحقق من البريد الإلكتروني عند التسجيل',
                'is_public' => false,
            ],
            [
                'key' => 'require_phone_verification',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'registration',
                'label' => 'التحقق من رقم الهاتف',
                'description' => 'إلزام التحقق من رقم الهاتف عند التسجيل',
                'is_public' => false,
            ],

            // Email Settings
            [
                'key' => 'smtp_host',
                'value' => 'smtp.gmail.com',
                'type' => 'string',
                'group' => 'email',
                'label' => 'خادم SMTP',
                'description' => 'عنوان خادم البريد الإلكتروني',
                'is_public' => false,
            ],
            [
                'key' => 'smtp_port',
                'value' => '587',
                'type' => 'integer',
                'group' => 'email',
                'label' => 'منفذ SMTP',
                'description' => 'رقم منفذ خادم البريد',
                'is_public' => false,
            ],
            [
                'key' => 'smtp_username',
                'value' => '',
                'type' => 'string',
                'group' => 'email',
                'label' => 'اسم المستخدم SMTP',
                'description' => 'اسم المستخدم لخادم البريد',
                'is_public' => false,
            ],
            [
                'key' => 'smtp_password',
                'value' => '',
                'type' => 'string',
                'group' => 'email',
                'label' => 'كلمة مرور SMTP',
                'description' => 'كلمة مرور خادم البريد',
                'is_public' => false,
            ],
            [
                'key' => 'smtp_encryption',
                'value' => 'tls',
                'type' => 'string',
                'group' => 'email',
                'label' => 'تشفير SMTP',
                'description' => 'نوع التشفير (tls/ssl)',
                'is_public' => false,
            ],
            [
                'key' => 'mail_from_address',
                'value' => 'noreply@tutoring.com',
                'type' => 'string',
                'group' => 'email',
                'label' => 'عنوان المرسل',
                'description' => 'عنوان البريد الإلكتروني للمرسل',
                'is_public' => false,
            ],
            [
                'key' => 'mail_from_name',
                'value' => 'Tutoring System',
                'type' => 'string',
                'group' => 'email',
                'label' => 'اسم المرسل',
                'description' => 'اسم المرسل في رسائل البريد',
                'is_public' => false,
            ],

            // SMS Settings
            [
                'key' => 'sms_provider',
                'value' => 'log',
                'type' => 'string',
                'group' => 'sms',
                'label' => 'مزود خدمة الرسائل',
                'description' => 'مزود خدمة الرسائل القصيرة (twilio/vonage/gateway_sa/log)',
                'is_public' => false,
            ],
            [
                'key' => 'sms_api_key',
                'value' => '',
                'type' => 'string',
                'group' => 'sms',
                'label' => 'مفتاح API للرسائل',
                'description' => 'مفتاح API لمزود خدمة الرسائل',
                'is_public' => false,
            ],
            [
                'key' => 'sms_api_secret',
                'value' => '',
                'type' => 'string',
                'group' => 'sms',
                'label' => 'السر API للرسائل',
                'description' => 'السر الخاص بـ API مزود الرسائل',
                'is_public' => false,
            ],
            [
                'key' => 'sms_sender_id',
                'value' => 'TUTORING',
                'type' => 'string',
                'group' => 'sms',
                'label' => 'معرف المرسل',
                'description' => 'اسم المرسل الذي يظهر في الرسائل',
                'is_public' => false,
            ],
            [
                'key' => 'sms_enabled',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'sms',
                'label' => 'تفعيل الرسائل القصيرة',
                'description' => 'تفعيل إرسال الرسائل القصيرة',
                'is_public' => false,
            ],

            // Appearance Settings
            [
                'key' => 'primary_color',
                'value' => '#3B82F6',
                'type' => 'string',
                'group' => 'appearance',
                'label' => 'اللون الأساسي',
                'description' => 'اللون الأساسي للتطبيق',
                'is_public' => true,
            ],
            [
                'key' => 'secondary_color',
                'value' => '#10B981',
                'type' => 'string',
                'group' => 'appearance',
                'label' => 'اللون الثانوي',
                'description' => 'اللون الثانوي للتطبيق',
                'is_public' => true,
            ],
            [
                'key' => 'dark_mode_enabled',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'appearance',
                'label' => 'تفعيل الوضع الداكن',
                'description' => 'السماح بالتبديل للوضع الداكن',
                'is_public' => true,
            ],

            // Notification Settings
            [
                'key' => 'notification_session_reminder',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'notifications',
                'label' => 'تذكير الجلسات',
                'description' => 'إرسال تذكير قبل الجلسات',
                'is_public' => false,
            ],
            [
                'key' => 'notification_payment_reminder',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'notifications',
                'label' => 'تذكير المدفوعات',
                'description' => 'إرسال تذكير للمدفوعات المستحقة',
                'is_public' => false,
            ],
            [
                'key' => 'notification_new_announcement',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'notifications',
                'label' => 'الإعلانات الجديدة',
                'description' => 'إرسال إشعار عند نشر إعلان جديد',
                'is_public' => false,
            ],
            [
                'key' => 'notification_exam_results',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'notifications',
                'label' => 'نتائج الامتحانات',
                'description' => 'إرسال إشعار عند نشر نتائج الامتحانات',
                'is_public' => false,
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
