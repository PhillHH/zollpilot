import { test, expect } from '@playwright/test';

test.describe('IAA Wizard Flow', () => {
  test('should create declaration and navigate wizard', async ({ page }) => {
    // Start at dashboard
    await page.goto('/declarations');

    // Create new
    await page.click('text=+ Neue Anmeldung');
    await expect(page).toHaveURL(/\/wizard\/parties/);

    // Step 2: Parties
    await page.fill('input[name="exporter.name"]', 'Test Exporter');
    await page.fill('input[name="exporter.address.street"]', 'Musterstr 1');
    await page.fill('input[name="exporter.address.city"]', 'Berlin');
    await page.fill('input[name="exporter.address.country"]', 'DE');

    await page.fill('input[name="recipient.name"]', 'Test Recipient');
    await page.fill('input[name="recipient.address.street"]', 'Main St 1');
    await page.fill('input[name="recipient.address.city"]', 'New York');
    await page.fill('input[name="recipient.address.country"]', 'US');

    await page.click('button:has-text("Weiter")');
    await expect(page).toHaveURL(/\/wizard\/transport/);

    // Step 3: Transport
    await page.fill('input[name="general.exportCountry"]', 'DE');
    await page.fill('input[name="general.destinationCountry"]', 'US');
    await page.selectOption('select[name="transport.mode"]', '3');
    await page.fill('input[name="transport.identity"]', 'TEST-TRUCK');

    await page.click('button:has-text("Weiter")');
    await expect(page).toHaveURL(/\/wizard\/items/);

    // Step 4: Items
    await page.click('text=+ Position hinzufügen');
    await page.fill('input[name="description"]', 'Test Widget');
    await page.fill('input[name="commodityCode"]', '12345678');
    await page.fill('input[name="grossMass"]', '10');
    await page.fill('input[name="netMass"]', '9');
    await page.fill('input[name="invoiceAmount.value"]', '100');
    await page.click('button:has-text("Hinzufügen")');

    await expect(page.locator('text=#1 Test Widget')).toBeVisible();

    await page.click('button:has-text("Zum Abschluss")');
    await expect(page).toHaveURL(/\/wizard\/review/);

    // Step 5: Review
    await expect(page.locator('text=Test Exporter')).toBeVisible();
    await expect(page.locator('text=Test Widget')).toBeVisible();

    // Complete
    await page.click('button:has-text("Kostenpflichtig Abschließen")');
    await expect(page).toHaveURL(/\/export/);

    await expect(page.locator('text=Anmeldung erfolgreich abgeschlossen!')).toBeVisible();
  });
});
