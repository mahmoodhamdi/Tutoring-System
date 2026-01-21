import { test, expect } from '../fixtures/auth.fixture';

test.describe('Groups Management', () => {
  test('should display groups list', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/groups');
    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('h1:has-text("المجموعات"), h1:has-text("Groups"), [data-testid="groups-title"]')
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.locator('table, [data-testid="groups-list"], .groups-grid')
    ).toBeVisible();
  });

  test('should create new group', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/groups');
    await page.waitForLoadState('networkidle');

    // Click add button
    await page.click(
      'button:has-text("إضافة مجموعة"), button:has-text("Add Group"), a:has-text("إضافة"), [data-testid="add-group"]'
    );

    // Fill form
    const timestamp = Date.now();
    const groupName = `Test Group ${timestamp}`;

    await page.fill('input[name="name"]', groupName);

    // Optional fields
    const subjectInput = page.locator('input[name="subject"]');
    if (await subjectInput.isVisible()) {
      await subjectInput.fill('Mathematics');
    }

    const gradeLevelInput = page.locator('input[name="grade_level"], select[name="grade_level"]');
    if (await gradeLevelInput.isVisible()) {
      if (await gradeLevelInput.evaluate(el => el.tagName === 'SELECT')) {
        await gradeLevelInput.selectOption({ index: 1 });
      } else {
        await gradeLevelInput.fill('Grade 10');
      }
    }

    const maxStudentsInput = page.locator('input[name="max_students"]');
    if (await maxStudentsInput.isVisible()) {
      await maxStudentsInput.fill('20');
    }

    const monthlyFeeInput = page.locator('input[name="monthly_fee"]');
    if (await monthlyFeeInput.isVisible()) {
      await monthlyFeeInput.fill('500');
    }

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success
    await expect(
      page.locator('text=تم الإضافة, text=تم الحفظ, text=successfully, text=created')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should add students to group', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/groups');
    await page.waitForLoadState('networkidle');

    // Click on first group or manage students button
    const manageButton = page.locator(
      '[data-testid="manage-students"], button:has-text("إدارة الطلاب"), button:has-text("Manage Students"), a:has-text("الطلاب")'
    ).first();

    if (await manageButton.isVisible()) {
      await manageButton.click();
    } else {
      // Click on group row to view details
      await page.locator('table tbody tr').first().click();
    }

    await page.waitForLoadState('networkidle');

    // Look for add students button
    const addStudentsBtn = page.locator(
      'button:has-text("إضافة طلاب"), button:has-text("Add Students"), [data-testid="add-students"]'
    );

    if (await addStudentsBtn.isVisible()) {
      await addStudentsBtn.click();

      // Select students (checkbox or multi-select)
      const studentCheckboxes = page.locator('input[type="checkbox"][name*="student"]');
      if (await studentCheckboxes.first().isVisible()) {
        await studentCheckboxes.first().check();
      }

      // Confirm
      const confirmBtn = page.locator(
        'button:has-text("إضافة"), button:has-text("Add"), button:has-text("حفظ"), button:has-text("Save")'
      ).last();
      await confirmBtn.click();

      await expect(
        page.locator('text=تم الإضافة, text=added, text=successfully')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should edit group', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/groups');
    await page.waitForLoadState('networkidle');

    // Click edit on first group
    const editButton = page.locator(
      '[data-testid="edit-group"], button:has-text("تعديل"), button:has-text("Edit")'
    ).first();
    await editButton.click();

    // Update name
    const nameInput = page.locator('input[name="name"]');
    await nameInput.clear();
    await nameInput.fill('Updated Group Name');

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success
    await expect(
      page.locator('text=تم التحديث, text=updated, text=successfully')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should delete group', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/groups');
    await page.waitForLoadState('networkidle');

    // Click delete on last group
    const deleteButton = page.locator(
      '[data-testid="delete-group"], button:has-text("حذف"), button:has-text("Delete")'
    ).last();
    await deleteButton.click();

    // Confirm deletion
    const confirmButton = page.locator(
      'button:has-text("تأكيد"), button:has-text("Confirm"), button:has-text("نعم"), button:has-text("Yes")'
    );
    await confirmButton.click();

    // Wait for success
    await expect(
      page.locator('text=تم الحذف, text=deleted, text=successfully')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show group details with student count', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/groups');
    await page.waitForLoadState('networkidle');

    // Click on first group
    const viewButton = page.locator(
      '[data-testid="view-group"], a:has-text("عرض"), a:has-text("View"), table tbody tr'
    ).first();
    await viewButton.click();

    // Should show group details including student count
    await expect(
      page.locator('text=عدد الطلاب, text=Students, text=student')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should filter groups by subject', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/groups');
    await page.waitForLoadState('networkidle');

    const subjectFilter = page.locator(
      'select[name="subject"], [data-testid="subject-filter"]'
    );

    if (await subjectFilter.isVisible()) {
      await subjectFilter.selectOption({ index: 1 });
      await page.waitForTimeout(500);

      await expect(page.locator('table, [data-testid="groups-list"]')).toBeVisible();
    }
  });

  test('should show available spots in group', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/groups');
    await page.waitForLoadState('networkidle');

    // Look for available spots indicator
    await expect(
      page.locator('text=متاح, text=available, text=spots, text=/\\d+\\/\\d+/')
    ).toBeVisible({ timeout: 10000 });
  });
});
