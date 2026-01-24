import { test, expect } from '@playwright/test'

test('should load home page and navigate to admin', async ({ page }) => {
  await page.goto('/')

  // Assert main heading
  await expect(page.getByRole('heading', { name: 'ZollPilot' })).toBeVisible()

  // Navigate to Admin
  await page.locator('nav').getByRole('link', { name: 'Admin' }).click()
  await expect(page).toHaveURL('/admin')
  await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible()
})
