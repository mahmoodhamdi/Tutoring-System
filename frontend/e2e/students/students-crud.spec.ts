import { test, expect } from '../fixtures/auth.fixture';

test.describe('Students Management', () => {
  test('should display students list', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/students');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page title or heading
    await expect(
      page.locator('h1:has-text("الطلاب"), h1:has-text("Students"), [data-testid="students-title"]')
    ).toBeVisible({ timeout: 10000 });

    // Check for table or list
    await expect(
      page.locator('table, [data-testid="students-list"], .students-grid')
    ).toBeVisible();
  });

  test('should create new student', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/students');
    await page.waitForLoadState('networkidle');

    // Click add button
    await page.click(
      'button:has-text("إضافة طالب"), button:has-text("Add Student"), a:has-text("إضافة"), [data-testid="add-student"]'
    );

    // Fill form
    const timestamp = Date.now();
    const studentName = `Test Student ${timestamp}`;
    const studentPhone = `010${timestamp.toString().slice(-8)}`;

    await page.fill('input[name="name"]', studentName);
    await page.fill('input[name="phone"]', studentPhone);
    await page.fill('input[name="password"]', 'password123');

    // Optional fields
    const emailInput = page.locator('input[name="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill(`test${timestamp}@example.com`);
    }

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success
    await expect(
      page.locator('text=تم الإضافة, text=تم الحفظ, text=successfully, [data-testid="toast-success"]')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should edit student', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/students');
    await page.waitForLoadState('networkidle');

    // Click edit on first student
    const editButton = page.locator(
      '[data-testid="edit-student"], button:has-text("تعديل"), button:has-text("Edit"), .edit-button'
    ).first();
    await editButton.click();

    // Update name
    const nameInput = page.locator('input[name="name"]');
    await nameInput.clear();
    await nameInput.fill('Updated Student Name');

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success
    await expect(
      page.locator('text=تم التحديث, text=تم الحفظ, text=updated, text=successfully')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should delete student with confirmation', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/students');
    await page.waitForLoadState('networkidle');

    // Get initial count
    const initialRows = await page.locator('table tbody tr, [data-testid="student-row"]').count();

    // Click delete on last student (to avoid deleting important test data)
    const deleteButton = page.locator(
      '[data-testid="delete-student"], button:has-text("حذف"), button:has-text("Delete"), .delete-button'
    ).last();
    await deleteButton.click();

    // Confirm deletion
    const confirmButton = page.locator(
      'button:has-text("تأكيد"), button:has-text("Confirm"), button:has-text("نعم"), button:has-text("Yes"), [data-testid="confirm-delete"]'
    );
    await confirmButton.click();

    // Wait for success
    await expect(
      page.locator('text=تم الحذف, text=deleted, text=successfully')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should search students', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/students');
    await page.waitForLoadState('networkidle');

    // Find search input
    const searchInput = page.locator(
      'input[placeholder*="بحث"], input[placeholder*="Search"], input[name="search"], [data-testid="search-input"]'
    );
    await searchInput.fill('Ahmed');

    // Wait for results to update
    await page.waitForTimeout(500);

    // Results should be filtered
    const rows = page.locator('table tbody tr, [data-testid="student-row"]');
    const count = await rows.count();

    // Either we have filtered results or "no results" message
    if (count === 0) {
      await expect(
        page.locator('text=لا توجد نتائج, text=No results')
      ).toBeVisible();
    }
  });

  test('should filter students by grade', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/students');
    await page.waitForLoadState('networkidle');

    // Find grade filter
    const gradeFilter = page.locator(
      'select[name="grade"], select[name="grade_level"], [data-testid="grade-filter"]'
    );

    if (await gradeFilter.isVisible()) {
      await gradeFilter.selectOption({ index: 1 });
      await page.waitForTimeout(500);

      // Page should still show students list
      await expect(page.locator('table, [data-testid="students-list"]')).toBeVisible();
    }
  });

  test('should show student details', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/students');
    await page.waitForLoadState('networkidle');

    // Click on first student to view details
    const viewButton = page.locator(
      '[data-testid="view-student"], a:has-text("عرض"), a:has-text("View"), table tbody tr'
    ).first();
    await viewButton.click();

    // Should show student details
    await expect(
      page.locator('text=بيانات الطالب, text=Student Details, h1, h2')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should paginate students list', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/students');
    await page.waitForLoadState('networkidle');

    // Look for pagination
    const pagination = page.locator(
      '.pagination, [data-testid="pagination"], nav[aria-label="pagination"]'
    );

    if (await pagination.isVisible()) {
      // Click next page
      const nextButton = page.locator(
        'button:has-text("التالي"), button:has-text("Next"), [aria-label="next page"]'
      );
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForLoadState('networkidle');

        // Page should update
        await expect(page.locator('table tbody tr')).toBeVisible();
      }
    }
  });
});
