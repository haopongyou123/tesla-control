import { test, expect } from '@playwright/test';

test.describe('租户管理 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tenants');
  });

  test.describe('租户列表', () => {
    test('displays default tenants', async ({ page }) => {
      await expect(page.locator('h2')).toContainText('租户列表');
      await expect(page.locator('td:has-text("Tesla 中国")')).toBeVisible();
    });

    test('shows current tenant in sidebar', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('[data-testid="tenant-switcher"] select')).toHaveValue('t-001');
    });
  });

  test.describe('租户创建', () => {
    test('navigate to create tenant flow', async ({ page }) => {
      await page.getByRole('button', { name: '+ 新建租户' }).click();
      await expect(page.locator('form')).toBeVisible();
    });

    test('create successful tenant', async ({ page }) => {
      await page.getByRole('button', { name: '+ 新建租户' }).click();
      await page.fill('input[placeholder="租户名称"]', 'Test Tenant');
      await page.getByRole('button', { name: '创建' }).click();
      await page.waitForTimeout(500);
      await expect(page.locator('td:has-text("Test Tenant")')).toBeVisible();
    });
  });

  test.describe('租户详情', () => {
    test('view tenant details', async ({ page }) => {
      await page.locator('button', { name: '查看详情' }).first().click();
      await page.waitForURL(/\/tenants\/t-001/);
      await expect(page.locator('h2')).toContainText('租户详情');
    });
  });

  test.describe('租户切换', () => {
    test('switch between tenants', async ({ page }) => {
      await page.goto('/');
      await page.locator('select').selectOption('t-002');
      await expect(page.locator('h1')).toContainText('Tesla US');
    });

    test('tenant persists after reload', async ({ page }) => {
      await page.goto('/');
      await page.locator('select').selectOption('t-003');
      await page.reload();
      await expect(page.locator('[data-testid="tenant-switcher"] select')).toHaveValue('t-003');
    });
  });
});