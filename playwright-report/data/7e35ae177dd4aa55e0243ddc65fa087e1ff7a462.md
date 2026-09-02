# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows.spec.ts >> Legal Aid Clinic - Full E2E Flow >> Create Account, Login, and Dashboard Flow
- Location: tests\core-flows.spec.ts:5:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/Full Name/i)

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - link "TLC." [ref=e5] [cursor=pointer]:
          - /url: /
        - generic [ref=e6]:
          - link "Our Mission" [ref=e7] [cursor=pointer]:
            - /url: /about
          - link "Know Your Rights" [ref=e8] [cursor=pointer]:
            - /url: /know-your-rights
          - link "FAQ" [ref=e9] [cursor=pointer]:
            - /url: /faq
          - link "Volunteers" [ref=e10] [cursor=pointer]:
            - /url: /volunteers
      - generic [ref=e11]:
        - link "Sign In" [ref=e12] [cursor=pointer]:
          - /url: /login
        - link [ref=e13] [cursor=pointer]:
          - /url: /login?mode=register
          - button "Get Help" [ref=e14]
  - main [ref=e15]:
    - main [ref=e16]:
      - generic [ref=e17]:
        - generic [ref=e18]:
          - heading "Join TLC" [level=3] [ref=e19]
          - paragraph [ref=e20]: Create a new account
        - generic [ref=e21]:
          - generic [ref=e22]:
            - generic [ref=e23]:
              - text: Full Name
              - textbox "John Doe" [ref=e24]: Anubhav
            - generic [ref=e25]:
              - text: Role
              - combobox [ref=e26]:
                - option "Seeking Help" [selected]
                - option "Legal Advisor"
            - generic [ref=e27]:
              - text: Email
              - textbox "m@example.com" [ref=e28]: anubhav@gmail.com
            - generic [ref=e29]:
              - text: Password
              - textbox [ref=e30]: "11223344"
            - button "Register" [active] [ref=e31]
          - button "Already have an account? Sign in" [ref=e33]
  - contentinfo [ref=e34]:
    - generic [ref=e35]:
      - generic [ref=e36]:
        - link "TLC." [ref=e37] [cursor=pointer]:
          - /url: /
        - paragraph [ref=e38]: Connecting people who need legal help with verified volunteer lawyers via public Q&A and private consultations.
      - generic [ref=e39]:
        - heading "Legal" [level=4] [ref=e40]
        - link "Privacy Policy" [ref=e41] [cursor=pointer]:
          - /url: /privacy
        - link "Terms of Use" [ref=e42] [cursor=pointer]:
          - /url: /terms
      - generic [ref=e43]:
        - heading "Support" [level=4] [ref=e44]
        - link "FAQ" [ref=e45] [cursor=pointer]:
          - /url: /faq
        - link "Contact / Report Concern" [ref=e46] [cursor=pointer]:
          - /url: /contact
    - generic [ref=e47]:
      - paragraph [ref=e48]: "Legal Disclaimer: This is legal information, not formal legal representation."
      - paragraph [ref=e49]: © 2026 The Legal Aid Clinic. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e55] [cursor=pointer]
  - alert [ref=e59]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Legal Aid Clinic - Full E2E Flow', () => {
  4  | 
  5  |   test('Create Account, Login, and Dashboard Flow', async ({ page }) => {
  6  |     // 1. Go to homepage
  7  |     await page.goto('/');
  8  |     await page.waitForTimeout(1000);
  9  |     
  10 |     // 2. Navigate to Registration
  11 |     await page.getByRole('link', { name: 'Get Help' }).first().click();
  12 |     await expect(page).toHaveURL(/.*login\?mode=register/);
  13 |     await page.waitForTimeout(1000);
  14 | 
  15 |     // 3. Fill out Registration Form
  16 |     const randomEmail = `testuser_${Date.now()}@example.com`;
  17 |     
  18 |     // Fill full name
> 19 |     await page.getByLabel(/Full Name/i).fill('Automated Tester');
     |                                         ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  20 |     
  21 |     // Fill email
  22 |     await page.getByLabel(/Email Address/i).fill(randomEmail);
  23 |     
  24 |     // Fill password
  25 |     await page.getByLabel(/Password/i).fill('SecurePass123!');
  26 |     
  27 |     await page.waitForTimeout(1000);
  28 |     
  29 |     // 4. Submit Registration
  30 |     await page.getByRole('button', { name: /Create Account/i }).click();
  31 |     
  32 |     // Should redirect to dashboard
  33 |     await page.waitForURL(/.*dashboard/);
  34 |     await page.waitForTimeout(1000);
  35 |     
  36 |     // 5. Verify Dashboard
  37 |     await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
  38 |     await expect(page.getByText('Automated Tester')).toBeVisible();
  39 |     
  40 |     // 6. Sign Out
  41 |     await page.getByRole('button', { name: /Sign Out/i }).click();
  42 |     await expect(page).toHaveURL(/.*login/);
  43 |     await page.waitForTimeout(1000);
  44 |   });
  45 | 
  46 | });
  47 | 
```