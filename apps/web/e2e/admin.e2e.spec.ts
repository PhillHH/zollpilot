import { test, expect } from '@playwright/test'

test('should show admin placeholder text', async ({ page }) => {
  await page.goto('/admin')

  await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible()
  await expect(page.getByText('Administrative features coming in Phase 2')).toBeVisible()
})
