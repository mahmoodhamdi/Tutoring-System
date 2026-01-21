import { test, expect } from '../fixtures/auth.fixture';

test.describe('Sessions Management', () => {
  test('should display sessions list', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/sessions');
    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('h1:has-text("الجلسات"), h1:has-text("Sessions"), [data-testid="sessions-title"]')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should create new session', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/sessions');
    await page.waitForLoadState('networkidle');

    // Click add button
    await page.click(
      'button:has-text("إضافة جلسة"), button:has-text("Add Session"), a:has-text("إضافة"), [data-testid="add-session"]'
    );

    // Select group
    const groupSelect = page.locator('select[name="group_id"], [data-testid="group-select"]');
    if (await groupSelect.isVisible()) {
      await groupSelect.selectOption({ index: 1 });
    }

    // Set date
    const dateInput = page.locator('input[name="session_date"], input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await dateInput.fill(tomorrow.toISOString().split('T')[0]);

    // Set time
    const startTimeInput = page.locator('input[name="start_time"], input[name="time"]');
    if (await startTimeInput.isVisible()) {
      await startTimeInput.fill('10:00');
    }

    const endTimeInput = page.locator('input[name="end_time"]');
    if (await endTimeInput.isVisible()) {
      await endTimeInput.fill('11:00');
    }

    // Optional: Location
    const locationInput = page.locator('input[name="location"]');
    if (await locationInput.isVisible()) {
      await locationInput.fill('Room 101');
    }

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success
    await expect(
      page.locator('text=تم الإضافة, text=تم الحفظ, text=created, text=successfully')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should take attendance - mark present', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/sessions');
    await page.waitForLoadState('networkidle');

    // Click on first session or attendance button
    const attendanceBtn = page.locator(
      '[data-testid="take-attendance"], button:has-text("الحضور"), button:has-text("Attendance"), a:has-text("الحضور")'
    ).first();

    if (await attendanceBtn.isVisible()) {
      await attendanceBtn.click();
    } else {
      await page.locator('table tbody tr').first().click();
      await page.waitForLoadState('networkidle');

      const attendanceTab = page.locator(
        'button:has-text("الحضور"), a:has-text("الحضور"), [data-testid="attendance-tab"]'
      );
      if (await attendanceTab.isVisible()) {
        await attendanceTab.click();
      }
    }

    await page.waitForLoadState('networkidle');

    // Mark first student as present
    const presentBtn = page.locator(
      'button:has-text("حاضر"), button:has-text("Present"), [data-testid="mark-present"]'
    ).first();

    if (await presentBtn.isVisible()) {
      await presentBtn.click();

      await expect(
        page.locator('text=تم الحفظ, text=saved, text=recorded')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should take attendance - mark absent', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/sessions');
    await page.waitForLoadState('networkidle');

    const attendanceBtn = page.locator(
      '[data-testid="take-attendance"], button:has-text("الحضور"), button:has-text("Attendance")'
    ).first();

    if (await attendanceBtn.isVisible()) {
      await attendanceBtn.click();
      await page.waitForLoadState('networkidle');

      // Mark student as absent
      const absentBtn = page.locator(
        'button:has-text("غائب"), button:has-text("Absent"), [data-testid="mark-absent"]'
      ).first();

      if (await absentBtn.isVisible()) {
        await absentBtn.click();

        await expect(
          page.locator('text=تم الحفظ, text=saved, text=recorded')
        ).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('should view session details', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/sessions');
    await page.waitForLoadState('networkidle');

    // Click on first session
    const viewButton = page.locator(
      '[data-testid="view-session"], a:has-text("عرض"), a:has-text("View"), table tbody tr'
    ).first();
    await viewButton.click();

    // Should show session details
    await expect(
      page.locator('text=تفاصيل الجلسة, text=Session Details, h1, h2')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should cancel session', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/sessions');
    await page.waitForLoadState('networkidle');

    // Click cancel on a session
    const cancelBtn = page.locator(
      '[data-testid="cancel-session"], button:has-text("إلغاء"), button:has-text("Cancel")'
    ).first();

    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();

      // Confirm cancellation
      const confirmBtn = page.locator(
        'button:has-text("تأكيد"), button:has-text("Confirm"), button:has-text("نعم")'
      );
      await confirmBtn.click();

      await expect(
        page.locator('text=تم الإلغاء, text=cancelled, text=successfully')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should show today sessions', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/sessions');
    await page.waitForLoadState('networkidle');

    // Click on today tab/filter
    const todayFilter = page.locator(
      'button:has-text("اليوم"), button:has-text("Today"), [data-testid="today-filter"]'
    );

    if (await todayFilter.isVisible()) {
      await todayFilter.click();
      await page.waitForLoadState('networkidle');

      // Should show today's sessions or empty message
      await expect(
        page.locator('table, text=لا توجد جلسات, text=No sessions')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should show upcoming sessions', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/sessions');
    await page.waitForLoadState('networkidle');

    const upcomingFilter = page.locator(
      'button:has-text("القادمة"), button:has-text("Upcoming"), [data-testid="upcoming-filter"]'
    );

    if (await upcomingFilter.isVisible()) {
      await upcomingFilter.click();
      await page.waitForLoadState('networkidle');

      await expect(
        page.locator('table, text=لا توجد جلسات, text=No sessions')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should filter sessions by group', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/sessions');
    await page.waitForLoadState('networkidle');

    const groupFilter = page.locator(
      'select[name="group_id"], [data-testid="group-filter"]'
    );

    if (await groupFilter.isVisible()) {
      await groupFilter.selectOption({ index: 1 });
      await page.waitForTimeout(500);

      await expect(page.locator('table, [data-testid="sessions-list"]')).toBeVisible();
    }
  });
});
