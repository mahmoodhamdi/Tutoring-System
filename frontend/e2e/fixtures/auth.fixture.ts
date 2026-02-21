import { test as base, Page } from '@playwright/test';

type TestFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
  studentPage: Page;
};

const TEST_USERS = {
  teacher: {
    phone: '01111111111',
    password: 'password',
  },
  admin: {
    phone: '01000000000',
    password: 'password',
  },
  student: {
    phone: '01122222220',
    password: 'password',
  },
};

async function login(page: Page, phone: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  await page.fill('input[name="phone"], input[type="tel"]', phone);
  await page.fill('input[name="password"], input[type="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL(/\/(dashboard|portal)/, { timeout: 15000 });
}

/* eslint-disable react-hooks/rules-of-hooks */
export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await login(page, TEST_USERS.teacher.phone, TEST_USERS.teacher.password);
    await use(page);
  },

  adminPage: async ({ page }, use) => {
    await login(page, TEST_USERS.admin.phone, TEST_USERS.admin.password);
    await use(page);
  },

  studentPage: async ({ page }, use) => {
    // Student uses portal login
    await page.goto('/portal');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="identifier"], input[name="phone"], input[type="tel"], input[type="email"]', TEST_USERS.student.phone);
    await page.fill('input[name="password"], input[type="password"]', TEST_USERS.student.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/portal/, { timeout: 15000 });
    await use(page);
  },
});
/* eslint-enable react-hooks/rules-of-hooks */

export { expect } from '@playwright/test';
export { TEST_USERS };
