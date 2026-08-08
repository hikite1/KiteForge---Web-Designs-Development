import { test, expect } from "@playwright/test";

test("homepage loads with no console errors", async ({ page }) => {
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  const response = await page.goto("/");
  expect(response.status()).toBeLessThan(400);
  await expect(page).toHaveTitle(/KiteForge/);
  expect(errors).toEqual([]);
});

test("nav and key sections are present", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Services" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Services" })).toBeVisible();
  const links = await page.locator("a[href]").count();
  expect(links).toBeGreaterThan(0);
});
