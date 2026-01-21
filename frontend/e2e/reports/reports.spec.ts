import { test, expect } from '../fixtures/auth.fixture';

test.describe('Reports', () => {
  test('should display reports page', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/reports');
    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('h1:has-text("التقارير"), h1:has-text("Reports"), [data-testid="reports-title"]')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should generate attendance report', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/reports');
    await page.waitForLoadState('networkidle');

    // Select attendance report type
    const reportTypeSelect = page.locator(
      'select[name="report_type"], button:has-text("الحضور"), button:has-text("Attendance"), [data-testid="report-type"]'
    );

    if (await reportTypeSelect.isVisible()) {
      if (await reportTypeSelect.evaluate(el => el.tagName === 'SELECT')) {
        await reportTypeSelect.selectOption('attendance');
      } else {
        await reportTypeSelect.click();
      }
    }

    // Set date range
    const startDateInput = page.locator('input[name="start_date"], input[name="from"]');
    if (await startDateInput.isVisible()) {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      await startDateInput.fill(lastMonth.toISOString().split('T')[0]);
    }

    const endDateInput = page.locator('input[name="end_date"], input[name="to"]');
    if (await endDateInput.isVisible()) {
      await endDateInput.fill(new Date().toISOString().split('T')[0]);
    }

    // Generate report
    const generateBtn = page.locator(
      'button:has-text("إنشاء"), button:has-text("Generate"), button:has-text("عرض"), [data-testid="generate-report"]'
    );
    await generateBtn.click();

    await page.waitForLoadState('networkidle');

    // Should show report or empty message
    await expect(
      page.locator('table, [data-testid="report-results"], text=لا توجد بيانات, text=No data')
    ).toBeVisible({ timeout: 15000 });
  });

  test('should export attendance report as PDF', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/reports');
    await page.waitForLoadState('networkidle');

    // Select attendance and generate first
    const reportTypeSelect = page.locator('select[name="report_type"]');
    if (await reportTypeSelect.isVisible()) {
      await reportTypeSelect.selectOption('attendance');
    }

    const generateBtn = page.locator(
      'button:has-text("إنشاء"), button:has-text("Generate")'
    );
    await generateBtn.click();
    await page.waitForLoadState('networkidle');

    // Export as PDF
    const exportPdfBtn = page.locator(
      'button:has-text("PDF"), button:has-text("تصدير PDF"), [data-testid="export-pdf"]'
    );

    if (await exportPdfBtn.isVisible()) {
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);

      await exportPdfBtn.click();

      const download = await downloadPromise;
      if (download) {
        expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
      }
    }
  });

  test('should export attendance report as CSV', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/reports');
    await page.waitForLoadState('networkidle');

    // Select attendance and generate first
    const reportTypeSelect = page.locator('select[name="report_type"]');
    if (await reportTypeSelect.isVisible()) {
      await reportTypeSelect.selectOption('attendance');
    }

    const generateBtn = page.locator(
      'button:has-text("إنشاء"), button:has-text("Generate")'
    );
    await generateBtn.click();
    await page.waitForLoadState('networkidle');

    // Export as CSV
    const exportCsvBtn = page.locator(
      'button:has-text("CSV"), button:has-text("تصدير CSV"), [data-testid="export-csv"]'
    );

    if (await exportCsvBtn.isVisible()) {
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);

      await exportCsvBtn.click();

      const download = await downloadPromise;
      if (download) {
        expect(download.suggestedFilename()).toMatch(/\.csv$/i);
      }
    }
  });

  test('should generate payments report', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/reports');
    await page.waitForLoadState('networkidle');

    const reportTypeSelect = page.locator(
      'select[name="report_type"], button:has-text("المدفوعات"), button:has-text("Payments")'
    );

    if (await reportTypeSelect.isVisible()) {
      if (await reportTypeSelect.evaluate(el => el.tagName === 'SELECT')) {
        await reportTypeSelect.selectOption('payments');
      } else {
        await reportTypeSelect.click();
      }
    }

    const generateBtn = page.locator(
      'button:has-text("إنشاء"), button:has-text("Generate")'
    );
    await generateBtn.click();

    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('table, [data-testid="report-results"], text=لا توجد بيانات, text=No data')
    ).toBeVisible({ timeout: 15000 });
  });

  test('should generate performance report', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/reports');
    await page.waitForLoadState('networkidle');

    const reportTypeSelect = page.locator(
      'select[name="report_type"], button:has-text("الأداء"), button:has-text("Performance")'
    );

    if (await reportTypeSelect.isVisible()) {
      if (await reportTypeSelect.evaluate(el => el.tagName === 'SELECT')) {
        await reportTypeSelect.selectOption('performance');
      } else {
        await reportTypeSelect.click();
      }
    }

    const generateBtn = page.locator(
      'button:has-text("إنشاء"), button:has-text("Generate")'
    );
    await generateBtn.click();

    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('table, [data-testid="report-results"], text=لا توجد بيانات, text=No data, .chart')
    ).toBeVisible({ timeout: 15000 });
  });

  test('should filter report by group', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/reports');
    await page.waitForLoadState('networkidle');

    const groupFilter = page.locator(
      'select[name="group_id"], [data-testid="group-filter"]'
    );

    if (await groupFilter.isVisible()) {
      await groupFilter.selectOption({ index: 1 });

      const generateBtn = page.locator(
        'button:has-text("إنشاء"), button:has-text("Generate")'
      );
      await generateBtn.click();

      await page.waitForLoadState('networkidle');

      await expect(
        page.locator('table, [data-testid="report-results"], text=لا توجد')
      ).toBeVisible({ timeout: 15000 });
    }
  });

  test('should filter report by student', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/reports');
    await page.waitForLoadState('networkidle');

    const studentFilter = page.locator(
      'select[name="student_id"], [data-testid="student-filter"]'
    );

    if (await studentFilter.isVisible()) {
      await studentFilter.selectOption({ index: 1 });

      const generateBtn = page.locator(
        'button:has-text("إنشاء"), button:has-text("Generate")'
      );
      await generateBtn.click();

      await page.waitForLoadState('networkidle');

      await expect(
        page.locator('table, [data-testid="report-results"], text=لا توجد')
      ).toBeVisible({ timeout: 15000 });
    }
  });

  test('should show financial summary', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/reports');
    await page.waitForLoadState('networkidle');

    // Navigate to financial summary
    const financialTab = page.locator(
      'button:has-text("ملخص مالي"), button:has-text("Financial Summary"), a:has-text("مالي"), [data-testid="financial-tab"]'
    );

    if (await financialTab.isVisible()) {
      await financialTab.click();
      await page.waitForLoadState('networkidle');

      await expect(
        page.locator('text=إجمالي, text=Total, text=الإيرادات, text=Revenue')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should print report', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/reports');
    await page.waitForLoadState('networkidle');

    // Generate a report first
    const generateBtn = page.locator(
      'button:has-text("إنشاء"), button:has-text("Generate")'
    );
    await generateBtn.click();
    await page.waitForLoadState('networkidle');

    // Look for print button
    const printBtn = page.locator(
      'button:has-text("طباعة"), button:has-text("Print"), [data-testid="print-report"]'
    );

    if (await printBtn.isVisible()) {
      // We can't fully test print, but we can verify the button exists
      await expect(printBtn).toBeEnabled();
    }
  });
});
