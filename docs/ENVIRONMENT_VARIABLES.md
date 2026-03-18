# متغيرات البيئة | Environment Variables

## Backend (.env)

### Application
| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `APP_NAME` | Tutoring System | Yes | اسم التطبيق |
| `APP_ENV` | local | Yes | البيئة (local/staging/production) |
| `APP_KEY` | - | Yes | مفتاح التشفير (generate with `php artisan key:generate`) |
| `APP_DEBUG` | true | Yes | وضع التصحيح (false in production) |
| `APP_URL` | http://localhost:8001 | Yes | رابط التطبيق |

### Database
| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `DB_CONNECTION` | mysql | Yes | نوع قاعدة البيانات (mysql/sqlite) |
| `DB_HOST` | 127.0.0.1 | Yes | خادم قاعدة البيانات |
| `DB_PORT` | 3306 | Yes | منفذ قاعدة البيانات |
| `DB_DATABASE` | tutoring_system | Yes | اسم قاعدة البيانات |
| `DB_USERNAME` | root | Yes | اسم المستخدم |
| `DB_PASSWORD` | - | Yes | كلمة المرور |

### Session & Cache
| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `SESSION_DRIVER` | database | Yes | مشغل الجلسات |
| `SESSION_LIFETIME` | 120 | No | مدة الجلسة (دقائق) |
| `SESSION_DOMAIN` | localhost | Yes | نطاق الجلسة |
| `CACHE_STORE` | database | Yes | مخزن التخزين المؤقت |

### Redis (Optional)
| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `REDIS_HOST` | 127.0.0.1 | No | خادم Redis |
| `REDIS_PORT` | 6379 | No | منفذ Redis |
| `REDIS_PASSWORD` | null | No | كلمة مرور Redis |

### Sanctum (Authentication)
| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `SANCTUM_STATEFUL_DOMAINS` | localhost:3000 | Yes | النطاقات المسموح بها لـ SPA |

### Mail
| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `MAIL_MAILER` | smtp | No | مشغل البريد |
| `MAIL_HOST` | smtp.gmail.com | No | خادم SMTP |
| `MAIL_PORT` | 587 | No | منفذ SMTP |
| `MAIL_USERNAME` | - | No | اسم مستخدم SMTP |
| `MAIL_PASSWORD` | - | No | كلمة مرور SMTP |
| `MAIL_ENCRYPTION` | tls | No | تشفير SMTP |

### Google OAuth (Optional)
| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `GOOGLE_CLIENT_ID` | - | No | معرف عميل Google |
| `GOOGLE_CLIENT_SECRET` | - | No | سر عميل Google |
| `GOOGLE_REDIRECT_URI` | - | No | رابط إعادة التوجيه |

### Firebase (Optional)
| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `FIREBASE_PROJECT_ID` | - | No | معرف مشروع Firebase |
| `FIREBASE_CREDENTIALS_PATH` | storage/app/firebase-credentials.json | No | مسار بيانات الاعتماد |

### SMS (Optional)
| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `SMS_PROVIDER` | log | No | مزود الرسائل (twilio/vonage/gateway_sa/log) |
| `SMS_API_KEY` | - | No | مفتاح API |
| `SMS_API_SECRET` | - | No | سر API |
| `SMS_SENDER_ID` | TUTORING | No | معرف المرسل |

### Sentry (Optional)
| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `SENTRY_LARAVEL_DSN` | - | No | رابط Sentry DSN |
| `SENTRY_TRACES_SAMPLE_RATE` | 0.1 | No | معدل تتبع الأداء |
| `SENTRY_PROFILES_SAMPLE_RATE` | 0.1 | No | معدل التنميط |

---

## Frontend (.env.local)

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | http://localhost:8001/api | Yes | رابط API الخلفي |

---

## Docker (.env.docker)

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `MYSQL_ROOT_PASSWORD` | - | Yes | كلمة مرور MySQL root |
| `MYSQL_DATABASE` | tutoring_system | Yes | اسم قاعدة البيانات |
| `MYSQL_USER` | tutoring | Yes | مستخدم MySQL |
| `MYSQL_PASSWORD` | - | Yes | كلمة مرور MySQL |

---

## الإعداد السريع | Quick Setup

```bash
# Backend
cd backend
cp .env.example .env
php artisan key:generate

# Frontend
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8001/api" > .env.local
```
