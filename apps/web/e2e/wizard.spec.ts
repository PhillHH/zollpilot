import { test, expect } from '@playwright/test';

test.describe('IAA Wizard Flow', () => {
  test('should create declaration, save draft, and complete flow', async ({ page }) => {
    // Start at dashboard
    await page.goto('/declarations');

    // Create new
    await page.click('text=+ Neue Anmeldung');
    await expect(page).toHaveURL(/\/wizard\/parties/);

    // Step 2: Parties
    await page.getByTestId('input-exporter-name').fill('Test Exporter');
    await page.getByTestId('input-exporter-street').fill('Musterstr 1');
    await page.getByTestId('input-exporter-city').fill('Berlin');
    await page.getByTestId('input-exporter-country').fill('DE');

    await page.getByTestId('input-recipient-name').fill('Test Recipient');
    await page.getByTestId('input-recipient-street').fill('Main St 1');
    await page.getByTestId('input-recipient-city').fill('New York');
    await page.getByTestId('input-recipient-country').fill('US');

    await page.getByTestId('btn-next').click();
    await expect(page).toHaveURL(/\/wizard\/transport/);

    // Verify Draft Persistence: Reload and Go Back
    await page.reload();
    await expect(page).toHaveURL(/\/wizard\/transport/);
    await page.click('button:has-text("← Zurück")'); // We didn't add testid for back button, but text is stable enough or we can add it. Text is fine for now as per prompt "Robuste Selektoren" mostly for inputs/actions.
    await expect(page).toHaveURL(/\/wizard\/parties/);
    await expect(page.getByTestId('input-exporter-name')).toHaveValue('Test Exporter');
    await page.getByTestId('btn-next').click();

    // Step 3: Transport
    await page.getByTestId('input-general-exportCountry').fill('DE');
    await page.getByTestId('input-general-destinationCountry').fill('US');
    await page.getByTestId('select-transport-mode').selectOption('3');
    await page.getByTestId('input-transport-identity').fill('TEST-TRUCK');

    await page.getByTestId('btn-next').click();
    await expect(page).toHaveURL(/\/wizard\/items/);

    // Step 4: Items
    // Check if "Add Item" button is visible
    await page.getByTestId('btn-add-item').click();

    await page.getByTestId('input-item-description').fill('Test Widget');
    await page.getByTestId('input-item-commodityCode').fill('12345678');
    await page.getByTestId('input-item-grossMass').fill('10');
    await page.getByTestId('input-item-netMass').fill('9');
    await page.getByTestId('input-item-invoiceAmount-value').fill('100');
    await page.getByTestId('input-item-invoiceAmount-currency').fill('EUR'); // Default is EUR but good to be explicit or check default

    await page.getByTestId('btn-add-item-submit').click();

    await expect(page.getByTestId('item-0')).toBeVisible();
    await expect(page.getByTestId('item-0')).toContainText('Test Widget');

    await page.getByTestId('btn-next').click();
    await expect(page).toHaveURL(/\/wizard\/review/);

    // Step 5: Review
    await expect(page.locator('text=Test Exporter')).toBeVisible();
    await expect(page.locator('text=Test Widget')).toBeVisible();

    // Complete
    await page.getByTestId('btn-complete').click();
    await expect(page).toHaveURL(/\/export/);

    await expect(page.locator('text=Anmeldung erfolgreich abgeschlossen!')).toBeVisible();
    await expect(page.getByTestId('link-pdf-download')).toBeVisible();

    // Check PDF Endpoint content-type (light check)
    // We just check the response header directly as verifying the download event requires clicking and handling the new page/context which is more complex in headless
    const response = await page.request.get(await page.getByTestId('link-pdf-download').getAttribute('href') || '');
    expect(response.headers()['content-type']).toBe('application/pdf');
  });
});
