import { test, expect } from '@playwright/test';

// 无需后端/本地服务器的冒烟测试（服务未就绪时也可在 CI 运行）
test('sanity: playwright runner works', async ({ page }) => {
  await page.setContent('<h1>Tesla Control</h1>');
  await expect(page.locator('h1')).toHaveText('Tesla Control');
});
