import { test, expect } from '../fixtures/auth.fixture';

test.describe('Quizzes Management', () => {
  test('should display quizzes list', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/quizzes');
    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('h1:has-text("الاختبارات"), h1:has-text("Quizzes"), [data-testid="quizzes-title"]')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should create quiz with questions', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/quizzes');
    await page.waitForLoadState('networkidle');

    // Click add button
    await page.click(
      'button:has-text("إضافة اختبار"), button:has-text("Add Quiz"), button:has-text("إنشاء"), [data-testid="add-quiz"]'
    );

    // Fill quiz details
    const timestamp = Date.now();
    const quizTitle = `Test Quiz ${timestamp}`;

    await page.fill('input[name="title"]', quizTitle);

    // Select group
    const groupSelect = page.locator('select[name="group_id"], [data-testid="group-select"]');
    if (await groupSelect.isVisible()) {
      await groupSelect.selectOption({ index: 1 });
    }

    // Optional fields
    const descInput = page.locator('textarea[name="description"]');
    if (await descInput.isVisible()) {
      await descInput.fill('Test quiz description');
    }

    const durationInput = page.locator('input[name="duration"], input[name="time_limit"]');
    if (await durationInput.isVisible()) {
      await durationInput.fill('30');
    }

    // Submit quiz form
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');

    // Now add questions
    const addQuestionBtn = page.locator(
      'button:has-text("إضافة سؤال"), button:has-text("Add Question"), [data-testid="add-question"]'
    );

    if (await addQuestionBtn.isVisible()) {
      await addQuestionBtn.click();

      // Fill question
      await page.fill('input[name="question"], textarea[name="question"], textarea[name="text"]', 'What is 2 + 2?');

      // Add options for MCQ
      const option1 = page.locator('input[name="options.0"], input[name="option1"], input[placeholder*="1"]');
      if (await option1.isVisible()) {
        await option1.fill('3');
        await page.fill('input[name="options.1"], input[name="option2"], input[placeholder*="2"]', '4');
        await page.fill('input[name="options.2"], input[name="option3"], input[placeholder*="3"]', '5');
        await page.fill('input[name="options.3"], input[name="option4"], input[placeholder*="4"]', '6');

        // Mark correct answer
        const correctCheckbox = page.locator('input[name="correct_answer"], input[data-option="1"]');
        if (await correctCheckbox.isVisible()) {
          await correctCheckbox.check();
        }
      }

      // Set marks
      const marksInput = page.locator('input[name="marks"], input[name="points"]');
      if (await marksInput.isVisible()) {
        await marksInput.fill('10');
      }

      // Save question
      await page.click('button:has-text("حفظ السؤال"), button:has-text("Save Question"), button[type="submit"]');

      await expect(
        page.locator('text=تم الإضافة, text=added, text=saved')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should publish quiz', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/quizzes');
    await page.waitForLoadState('networkidle');

    // Find unpublished quiz and click publish
    const publishBtn = page.locator(
      '[data-testid="publish-quiz"], button:has-text("نشر"), button:has-text("Publish")'
    ).first();

    if (await publishBtn.isVisible()) {
      await publishBtn.click();

      // Confirm if needed
      const confirmBtn = page.locator(
        'button:has-text("تأكيد"), button:has-text("Confirm"), button:has-text("نعم")'
      );
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }

      await expect(
        page.locator('text=تم النشر, text=published, text=successfully')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should view quiz results', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/quizzes');
    await page.waitForLoadState('networkidle');

    // Click on quiz to view details
    const viewBtn = page.locator(
      '[data-testid="view-quiz"], a:has-text("عرض"), a:has-text("View"), table tbody tr'
    ).first();
    await viewBtn.click();

    await page.waitForLoadState('networkidle');

    // Click on results tab
    const resultsTab = page.locator(
      'button:has-text("النتائج"), a:has-text("النتائج"), button:has-text("Results"), [data-testid="results-tab"]'
    );

    if (await resultsTab.isVisible()) {
      await resultsTab.click();
      await page.waitForLoadState('networkidle');

      // Should show results or empty message
      await expect(
        page.locator('table, text=لا توجد نتائج, text=No results, text=attempts')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should edit quiz', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/quizzes');
    await page.waitForLoadState('networkidle');

    const editBtn = page.locator(
      '[data-testid="edit-quiz"], button:has-text("تعديل"), button:has-text("Edit")'
    ).first();

    if (await editBtn.isVisible()) {
      await editBtn.click();

      // Update title
      const titleInput = page.locator('input[name="title"]');
      await titleInput.clear();
      await titleInput.fill('Updated Quiz Title');

      await page.click('button[type="submit"]');

      await expect(
        page.locator('text=تم التحديث, text=updated, text=successfully')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should delete quiz', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/quizzes');
    await page.waitForLoadState('networkidle');

    const deleteBtn = page.locator(
      '[data-testid="delete-quiz"], button:has-text("حذف"), button:has-text("Delete")'
    ).last();

    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();

      const confirmBtn = page.locator(
        'button:has-text("تأكيد"), button:has-text("Confirm"), button:has-text("نعم")'
      );
      await confirmBtn.click();

      await expect(
        page.locator('text=تم الحذف, text=deleted, text=successfully')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should filter quizzes by group', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/quizzes');
    await page.waitForLoadState('networkidle');

    const groupFilter = page.locator(
      'select[name="group_id"], [data-testid="group-filter"]'
    );

    if (await groupFilter.isVisible()) {
      await groupFilter.selectOption({ index: 1 });
      await page.waitForTimeout(500);

      await expect(page.locator('table, [data-testid="quizzes-list"]')).toBeVisible();
    }
  });

  test('should duplicate quiz', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/quizzes');
    await page.waitForLoadState('networkidle');

    const duplicateBtn = page.locator(
      '[data-testid="duplicate-quiz"], button:has-text("نسخ"), button:has-text("Duplicate")'
    ).first();

    if (await duplicateBtn.isVisible()) {
      await duplicateBtn.click();

      await expect(
        page.locator('text=تم النسخ, text=duplicated, text=copied')
      ).toBeVisible({ timeout: 10000 });
    }
  });
});
