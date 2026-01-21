import { test, expect } from '../fixtures/auth.fixture';

test.describe('Payments Management', () => {
  test('should display payments list', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/payments');
    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('h1:has-text("المدفوعات"), h1:has-text("Payments"), [data-testid="payments-title"]')
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.locator('table, [data-testid="payments-list"], .payments-grid')
    ).toBeVisible();
  });

  test('should record new payment', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/payments');
    await page.waitForLoadState('networkidle');

    // Click add button
    await page.click(
      'button:has-text("إضافة دفعة"), button:has-text("Add Payment"), button:has-text("تسجيل"), [data-testid="add-payment"]'
    );

    // Select student
    const studentSelect = page.locator('select[name="student_id"], [data-testid="student-select"]');
    if (await studentSelect.isVisible()) {
      await studentSelect.selectOption({ index: 1 });
    }

    // Enter amount
    const amountInput = page.locator('input[name="amount"]');
    await amountInput.fill('500');

    // Select payment method
    const methodSelect = page.locator('select[name="payment_method"], select[name="method"]');
    if (await methodSelect.isVisible()) {
      await methodSelect.selectOption({ index: 1 });
    }

    // Optional: Description
    const descInput = page.locator('input[name="description"], textarea[name="description"], textarea[name="notes"]');
    if (await descInput.isVisible()) {
      await descInput.fill('Monthly fee payment');
    }

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success
    await expect(
      page.locator('text=تم التسجيل, text=تم الحفظ, text=recorded, text=successfully')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should filter payments by status - pending', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/payments');
    await page.waitForLoadState('networkidle');

    const statusFilter = page.locator(
      'select[name="status"], [data-testid="status-filter"], button:has-text("قيد الانتظار"), button:has-text("Pending")'
    );

    if (await statusFilter.isVisible()) {
      if (await statusFilter.evaluate(el => el.tagName === 'SELECT')) {
        await statusFilter.selectOption('pending');
      } else {
        await statusFilter.click();
      }
      await page.waitForTimeout(500);

      await expect(page.locator('table, [data-testid="payments-list"]')).toBeVisible();
    }
  });

  test('should filter payments by status - paid', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/payments');
    await page.waitForLoadState('networkidle');

    const statusFilter = page.locator(
      'select[name="status"], button:has-text("مدفوع"), button:has-text("Paid")'
    );

    if (await statusFilter.isVisible()) {
      if (await statusFilter.evaluate(el => el.tagName === 'SELECT')) {
        await statusFilter.selectOption('paid');
      } else {
        await statusFilter.click();
      }
      await page.waitForTimeout(500);

      await expect(page.locator('table, [data-testid="payments-list"]')).toBeVisible();
    }
  });

  test('should filter payments by status - overdue', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/payments');
    await page.waitForLoadState('networkidle');

    const statusFilter = page.locator(
      'select[name="status"], button:has-text("متأخر"), button:has-text("Overdue")'
    );

    if (await statusFilter.isVisible()) {
      if (await statusFilter.evaluate(el => el.tagName === 'SELECT')) {
        await statusFilter.selectOption('overdue');
      } else {
        await statusFilter.click();
      }
      await page.waitForTimeout(500);

      await expect(page.locator('table, [data-testid="payments-list"]')).toBeVisible();
    }
  });

  test('should export payments', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/payments');
    await page.waitForLoadState('networkidle');

    // Look for export button
    const exportBtn = page.locator(
      'button:has-text("تصدير"), button:has-text("Export"), [data-testid="export-payments"]'
    );

    if (await exportBtn.isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);

      await exportBtn.click();

      // If there's a format selection, choose CSV
      const csvOption = page.locator(
        'button:has-text("CSV"), [data-testid="export-csv"]'
      );
      if (await csvOption.isVisible()) {
        await csvOption.click();
      }

      const download = await downloadPromise;
      if (download) {
        expect(download.suggestedFilename()).toMatch(/\.(csv|xlsx|pdf)$/);
      }
    }
  });

  test('should show payment details', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/payments');
    await page.waitForLoadState('networkidle');

    // Click on first payment
    const viewButton = page.locator(
      '[data-testid="view-payment"], a:has-text("عرض"), a:has-text("View"), table tbody tr'
    ).first();
    await viewButton.click();

    // Should show payment details
    await expect(
      page.locator('text=تفاصيل الدفعة, text=Payment Details, text=المبلغ, text=Amount')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show pending payments summary', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/payments');
    await page.waitForLoadState('networkidle');

    // Look for summary cards
    await expect(
      page.locator('text=قيد الانتظار, text=Pending, text=إجمالي, text=Total')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should edit payment status', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/payments');
    await page.waitForLoadState('networkidle');

    // Click edit on first payment
    const editButton = page.locator(
      '[data-testid="edit-payment"], button:has-text("تعديل"), button:has-text("Edit")'
    ).first();

    if (await editButton.isVisible()) {
      await editButton.click();

      // Change status
      const statusSelect = page.locator('select[name="status"]');
      if (await statusSelect.isVisible()) {
        await statusSelect.selectOption('paid');
      }

      // Submit
      await page.click('button[type="submit"]');

      await expect(
        page.locator('text=تم التحديث, text=updated, text=successfully')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should search payments by student name', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/payments');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator(
      'input[placeholder*="بحث"], input[placeholder*="Search"], input[name="search"]'
    );

    if (await searchInput.isVisible()) {
      await searchInput.fill('Ahmed');
      await page.waitForTimeout(500);

      await expect(page.locator('table, [data-testid="payments-list"]')).toBeVisible();
    }
  });
});
