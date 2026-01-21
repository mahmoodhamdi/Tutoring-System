import { test, expect } from '../fixtures/auth.fixture';

test.describe('Student Portal', () => {
  test('should display student dashboard', async ({ studentPage: page }) => {
    await page.waitForLoadState('networkidle');

    // Should be on portal dashboard
    await expect(page).toHaveURL(/\/portal/);

    // Dashboard should show student info
    await expect(
      page.locator('text=مرحبا, text=Welcome, text=لوحة التحكم, text=Dashboard')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show attendance summary', async ({ studentPage: page }) => {
    await page.waitForLoadState('networkidle');

    // Look for attendance section
    await expect(
      page.locator('text=الحضور, text=Attendance, text=حاضر, text=Present')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should view attendance history', async ({ studentPage: page }) => {
    await page.waitForLoadState('networkidle');

    // Navigate to attendance
    const attendanceLink = page.locator(
      'a:has-text("الحضور"), a:has-text("Attendance"), [data-testid="attendance-link"]'
    );

    if (await attendanceLink.isVisible()) {
      await attendanceLink.click();
      await page.waitForLoadState('networkidle');

      // Should show attendance history
      await expect(
        page.locator('table, [data-testid="attendance-list"], text=سجل الحضور, text=Attendance History')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should view payment history', async ({ studentPage: page }) => {
    await page.waitForLoadState('networkidle');

    // Navigate to payments
    const paymentsLink = page.locator(
      'a:has-text("المدفوعات"), a:has-text("Payments"), [data-testid="payments-link"]'
    );

    if (await paymentsLink.isVisible()) {
      await paymentsLink.click();
      await page.waitForLoadState('networkidle');

      // Should show payment history
      await expect(
        page.locator('table, [data-testid="payments-list"], text=سجل المدفوعات, text=Payment History')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should show payment summary', async ({ studentPage: page }) => {
    await page.waitForLoadState('networkidle');

    // Navigate to payments if not on dashboard
    const paymentsLink = page.locator(
      'a:has-text("المدفوعات"), a:has-text("Payments")'
    );

    if (await paymentsLink.isVisible()) {
      await paymentsLink.click();
      await page.waitForLoadState('networkidle');
    }

    // Should show summary (total paid, pending, overdue)
    await expect(
      page.locator('text=مدفوع, text=Paid, text=إجمالي, text=Total')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should view grades', async ({ studentPage: page }) => {
    await page.waitForLoadState('networkidle');

    // Navigate to grades
    const gradesLink = page.locator(
      'a:has-text("الدرجات"), a:has-text("Grades"), a:has-text("النتائج"), a:has-text("Results"), [data-testid="grades-link"]'
    );

    if (await gradesLink.isVisible()) {
      await gradesLink.click();
      await page.waitForLoadState('networkidle');

      await expect(
        page.locator('text=الدرجات, text=Grades, text=النتائج, text=Results')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should view schedule', async ({ studentPage: page }) => {
    await page.waitForLoadState('networkidle');

    // Navigate to schedule
    const scheduleLink = page.locator(
      'a:has-text("الجدول"), a:has-text("Schedule"), a:has-text("الجلسات"), a:has-text("Sessions"), [data-testid="schedule-link"]'
    );

    if (await scheduleLink.isVisible()) {
      await scheduleLink.click();
      await page.waitForLoadState('networkidle');

      await expect(
        page.locator('text=الجدول, text=Schedule, text=الجلسات القادمة, text=Upcoming Sessions')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should take quiz', async ({ studentPage: page }) => {
    await page.waitForLoadState('networkidle');

    // Navigate to quizzes
    const quizzesLink = page.locator(
      'a:has-text("الاختبارات"), a:has-text("Quizzes"), [data-testid="quizzes-link"]'
    );

    if (await quizzesLink.isVisible()) {
      await quizzesLink.click();
      await page.waitForLoadState('networkidle');

      // Find available quiz
      const startQuizBtn = page.locator(
        'button:has-text("ابدأ"), button:has-text("Start"), button:has-text("بدء"), [data-testid="start-quiz"]'
      ).first();

      if (await startQuizBtn.isVisible()) {
        await startQuizBtn.click();
        await page.waitForLoadState('networkidle');

        // Should show quiz questions
        await expect(
          page.locator('text=سؤال, text=Question, form')
        ).toBeVisible({ timeout: 10000 });

        // Answer first question (if MCQ)
        const option = page.locator('input[type="radio"]').first();
        if (await option.isVisible()) {
          await option.check();
        }

        // Submit quiz
        const submitBtn = page.locator(
          'button:has-text("إرسال"), button:has-text("Submit"), button:has-text("إنهاء"), button:has-text("Finish")'
        );

        if (await submitBtn.isVisible()) {
          await submitBtn.click();

          // Confirm if needed
          const confirmBtn = page.locator(
            'button:has-text("تأكيد"), button:has-text("Confirm")'
          );
          if (await confirmBtn.isVisible()) {
            await confirmBtn.click();
          }

          await expect(
            page.locator('text=تم الإرسال, text=submitted, text=النتيجة, text=Result, text=Score')
          ).toBeVisible({ timeout: 15000 });
        }
      }
    }
  });

  test('should view announcements', async ({ studentPage: page }) => {
    await page.waitForLoadState('networkidle');

    // Navigate to announcements
    const announcementsLink = page.locator(
      'a:has-text("الإعلانات"), a:has-text("Announcements"), [data-testid="announcements-link"]'
    );

    if (await announcementsLink.isVisible()) {
      await announcementsLink.click();
      await page.waitForLoadState('networkidle');

      await expect(
        page.locator('text=الإعلانات, text=Announcements')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should update password', async ({ studentPage: page }) => {
    await page.waitForLoadState('networkidle');

    // Navigate to profile/settings
    const profileLink = page.locator(
      'a:has-text("الملف الشخصي"), a:has-text("Profile"), a:has-text("الإعدادات"), a:has-text("Settings"), [data-testid="profile-link"]'
    );

    if (await profileLink.isVisible()) {
      await profileLink.click();
      await page.waitForLoadState('networkidle');

      // Find change password form
      const currentPasswordInput = page.locator('input[name="current_password"]');

      if (await currentPasswordInput.isVisible()) {
        await currentPasswordInput.fill('password123');
        await page.fill('input[name="new_password"]', 'newpassword123');
        await page.fill('input[name="new_password_confirmation"], input[name="confirm_password"]', 'newpassword123');

        await page.click('button:has-text("تغيير كلمة المرور"), button:has-text("Change Password"), button[type="submit"]');

        await expect(
          page.locator('text=تم التغيير, text=changed, text=updated')
        ).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('should logout from portal', async ({ studentPage: page }) => {
    await page.waitForLoadState('networkidle');

    // Find logout button
    const logoutBtn = page.locator(
      'button:has-text("تسجيل الخروج"), button:has-text("Logout"), [data-testid="logout"]'
    );

    // Open menu if needed
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu');
    if (await userMenu.isVisible()) {
      await userMenu.click();
    }

    await logoutBtn.click();

    // Should redirect to portal login
    await expect(page).toHaveURL(/\/portal\/login|\/login/, { timeout: 10000 });
  });
});
