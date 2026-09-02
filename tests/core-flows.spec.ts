import { test, expect } from '@playwright/test';

test.describe('Legal Aid Clinic - Full E2E Flow', () => {

  test('Create Account, Login, and Dashboard Flow', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // 2. Navigate to Registration
    await page.getByRole('link', { name: 'Get Help' }).first().click();
    await expect(page).toHaveURL(/.*login\?mode=register/);
    await page.waitForTimeout(1000);

    // 3. Fill out Registration Form
    const randomEmail = `testuser_${Date.now()}@example.com`;
    
    // Fill full name
    await page.getByLabel(/Full Name/i).fill('Automated Tester');
    
    // Fill email
    await page.getByLabel(/Email Address/i).fill(randomEmail);
    
    // Fill password
    await page.getByLabel(/Password/i).fill('SecurePass123!');
    
    await page.waitForTimeout(1000);
    
    // 4. Submit Registration
    await page.getByRole('button', { name: /Create Account/i }).click();
    
    // Should redirect to dashboard
    await page.waitForURL(/.*dashboard/);
    await page.waitForTimeout(1000);
    
    // 5. Verify Dashboard
    await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
    await expect(page.getByText('Automated Tester')).toBeVisible();
    
    // 6. Sign Out
    await page.getByRole('button', { name: /Sign Out/i }).click();
    await expect(page).toHaveURL(/.*login/);
    await page.waitForTimeout(1000);
  });

});
