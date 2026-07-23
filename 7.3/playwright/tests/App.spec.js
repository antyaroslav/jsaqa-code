const { test, expect } = require("@playwright/test");
const { email, password } = require("../user");

const loginUrl = "https://netology.ru/?modal=sign_in";

async function openEmailLoginForm(page) {
  await page.goto(loginUrl);
  await page
    .locator('text="Войти по почте"')
    .evaluate((element) => element.click());
}

async function submitLoginForm(page) {
  await page
    .locator('[data-testid="login-submit-btn"]')
    .evaluate((element) => element.click());
}

test("Успешная авторизация", async ({ page }) => {
  await openEmailLoginForm(page);

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await submitLoginForm(page);

  await expect(page).toHaveURL("https://netology.ru/profile");

  const profileHeading = page.locator("h2").first();
  await expect(profileHeading).toBeVisible();
  await expect(profileHeading).toContainText(/\S+/);
});

test("Неуспешная авторизация", async ({ page }) => {
  await openEmailLoginForm(page);

  await page.fill('input[name="email"]', "invalid-email");
  await page.fill('input[name="password"]', "invalid-password");
  await submitLoginForm(page);

  await expect(page.locator("text=Неверный email")).toBeVisible();
});
