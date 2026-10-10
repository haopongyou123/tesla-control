import { test, expect } from '@playwright/test';

test.describe('身份管理 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
  });

  test.describe('个人资料', () => {
    test('displays profile form', async ({ page }) => {
      await expect(page.locator('h2')).toContainText('个人资料');
      await expect(page.locator('[data-testid="profile-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="profile-email"]')).toBeVisible();
    });

    test('shows current tenant in profile', async ({ page }) => {
      await expect(page.locator('[data-testid="profile-tenant"]')).toContainText('Tesla');
    });

    test('save profile shows success', async ({ page }) => {
      await page.fill('[data-testid="profile-name"]', '李四');
      await page.click('[data-testid="profile-save"]');
      await expect(page.locator('[data-testid="profile-saved-msg"]')).toBeVisible();
    });
  });
});

test.describe('角色管理 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/roles');
  });

  test.describe('角色列表', () => {
    test('displays default roles', async ({ page }) => {
      await expect(page.locator('h2')).toContainText('角色管理');
      await expect(page.locator('td:has-text("owner")')).toBeVisible();
      await expect(page.locator('td:has-text("admin")')).toBeVisible();
      await expect(page.locator('td:has-text("viewer")')).toBeVisible();
    });

    test('shows current tenant in role management', async ({ page }) => {
      await expect(page.locator('text=当前租户')).toBeVisible();
    });
  });

  test.describe('角色创建', () => {
    test('create new role', async ({ page }) => {
      await page.getByRole('button', { name: '+ 新建角色' }).click();
      await expect(page.locator('[data-testid="role-create-form"]')).toBeVisible();
      await page.fill('[data-testid="role-create-form"] input[placeholder="例如：operator"]', 'operator');
      await page.fill('[data-testid="role-create-form"] input[placeholder="角色职责说明"]', '操作员角色');
      await page.getByRole('button', { name: '创建' }).click();
      await expect(page.locator('td:has-text("operator")')).toBeVisible();
    });
  });

  test.describe('角色删除', () => {
    test('delete custom role', async ({ page }) => {
      // First create a role
      await page.getByRole('button', { name: '+ 新建角色' }).click();
      await page.fill('[data-testid="role-create-form"] input[placeholder="例如：operator"]', 'to-delete');
      await page.getByRole('button', { name: '创建' }).click();
      await expect(page.locator('td:has-text("to-delete")')).toBeVisible();
      // Now delete it
      await page.locator('button', { name: '删除' }).first().click();
      await expect(page.locator('td:has-text("to-delete")')).not.toBeVisible();
    });
  });
});