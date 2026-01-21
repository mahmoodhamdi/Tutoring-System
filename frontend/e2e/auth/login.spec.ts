import { test, expect } from '@playwright/test';
import { TEST_USERS } from '../fixtures/auth.fixture';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login with valid credentials and redirect to dashboard', async ({ page }) => {
    await page.fill('input[name="phone"], input[type="tel"]', TEST_USERS.teacher.phone);
    await page.fill('input[name="password"], input[type="password"]', TEST_USERS.teacher.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await expect(page.locator('text=لوحة التحكم, text=Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.fill('input[name="phone"], input[type="tel"]', '01099999999');
    await page.fill('input[name="password"], input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Wait for error message
    await expect(
      page.locator('text=خطأ, text=error, text=incorrect, text=invalid, [role="alert"]')
    ).toBeVisible({ timeout: 10000 });

    // Should stay on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect unauthenticated users to login page', async ({ page }) => {
    // Clear any stored auth
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    // Try to access protected route
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.fill('input[name="phone"], input[type="tel"]', TEST_USERS.teacher.phone);
    await page.fill('input[name="password"], input[type="password"]', TEST_USERS.teacher.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });

    // Find and click logout button
    const logoutButton = page.locator(
      'button:has-text("تسجيل الخروج"), button:has-text("Logout"), [aria-label="logout"], [data-testid="logout"]'
    );

    // If logout is in a dropdown menu, open it first
    const userMenu = page.locator('[data-testid="user-menu"], [aria-label="user menu"], .user-menu');
    if (await userMenu.isVisible()) {
      await userMenu.click();
    }

    await logoutButton.click();

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.click('button[type="submit"]');

    // Check for validation messages
    const phoneInput = page.locator('input[name="phone"], input[type="tel"]');
    const passwordInput = page.locator('input[name="password"], input[type="password"]');

    // Either HTML5 validation or custom validation
    const hasPhoneError = await page.locator('text=مطلوب, text=required').first().isVisible().catch(() => false);
    const isPhoneInvalid = await phoneInput.evaluate((el: HTMLInputElement) => !el.validity.valid).catch(() => false);

    expect(hasPhoneError || isPhoneInvalid).toBeTruthy();
  });

  test('should remember login after page refresh', async ({ page }) => {
    await page.fill('input[name="phone"], input[type="tel"]', TEST_USERS.teacher.phone);
    await page.fill('input[name="password"], input[type="password"]', TEST_USERS.teacher.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });

    // Refresh the page
    await page.reload();

    // Should still be on dashboard (not redirected to login)
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
