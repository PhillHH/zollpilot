import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Home Page
 *
 * Smoke tests for the public portal homepage.
 * Tests navigation to admin area and basic content visibility.
 */

test.describe('Home Page', () => {
  test('should load home page and display ZollPilot heading', async ({
    page,
  }) => {
    await page.goto('/')

    // Check for main heading
    const heading = page.getByRole('heading', { name: /zollpilot/i })
    await expect(heading).toBeVisible()

    // Check for description text
    await expect(
      page.getByText(/structured customs data management platform/i)
    ).toBeVisible()
  })

  test('should navigate from home to admin page', async ({ page }) => {
    await page.goto('/')

    // Click the Admin link
    const adminLink = page.getByRole('link', { name: /admin/i })
    await expect(adminLink).toBeVisible()
    await adminLink.click()

    // Verify we're on admin page
    await expect(page).toHaveURL('/admin')

    // Check for admin heading
    const adminHeading = page.getByRole('heading', { name: /^admin$/i })
    await expect(adminHeading).toBeVisible()

    // Check for Phase 2 text
    await expect(
      page.getByText(/administrative features coming in phase 2/i)
    ).toBeVisible()
  })

  test('should have link to admin area', async ({ page }) => {
    await page.goto('/')

    // Verify admin link exists and has correct href
    const adminLink = page.getByRole('link', { name: /admin/i })
    await expect(adminLink).toHaveAttribute('href', '/admin')
  })
})
