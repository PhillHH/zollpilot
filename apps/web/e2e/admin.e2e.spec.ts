import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Admin Page
 *
 * Smoke tests for the admin area placeholder page.
 * Tests basic content visibility and navigation back to home.
 */

test.describe('Admin Page', () => {
  test('should load admin page and display Admin heading', async ({ page }) => {
    await page.goto('/admin')

    // Check for admin heading
    const heading = page.getByRole('heading', { name: /^admin$/i })
    await expect(heading).toBeVisible()
  })

  test('should display Phase 2 placeholder text', async ({ page }) => {
    await page.goto('/admin')

    // Check for Phase 2 notice
    await expect(
      page.getByText(/administrative features coming in phase 2/i)
    ).toBeVisible()
  })

  test('should display planned features list', async ({ page }) => {
    await page.goto('/admin')

    // Check for feature list items
    await expect(page.getByText(/pricing configuration/i)).toBeVisible()
    await expect(page.getByText(/system logging and monitoring/i)).toBeVisible()
    await expect(page.getByText(/audit trail viewer/i)).toBeVisible()
    await expect(page.getByText(/support tools/i)).toBeVisible()
    await expect(page.getByText(/user management/i)).toBeVisible()
  })

  test('should navigate from admin back to home page', async ({ page }) => {
    await page.goto('/admin')

    // Click the Return to Home link
    const homeLink = page.getByRole('link', { name: /return to home/i })
    await expect(homeLink).toBeVisible()
    await homeLink.click()

    // Verify we're on home page
    await expect(page).toHaveURL('/')

    // Check for home page heading
    const homeHeading = page.getByRole('heading', { name: /zollpilot/i })
    await expect(homeHeading).toBeVisible()
  })
})
