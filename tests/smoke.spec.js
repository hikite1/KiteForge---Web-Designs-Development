import { test, expect } from "@playwright/test";

test("homepage loads with no console errors", async ({ page }) => {
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    // Ignore noise from third-party embeds (YouTube); only care about our own origin.
    const url = msg.location()?.url ?? "";
    if (url && !url.includes("localhost:8080")) return;
    errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  const response = await page.goto("/");
  expect(response.status()).toBeLessThan(400);
  await expect(page).toHaveTitle(/KiteForge/);
  expect(errors).toEqual([]);
});

test("key sections and nav are present", async ({ page }) => {
  await page.goto("/");
  for (const name of [
    "What we do",
    "Who it’s for",
    "Recent work",
    "Straightforward pricing",
    "Common questions",
    "How it goes",
    "Content creation",
    "Who you’re working with",
    "Follow along",
    "Start a project",
  ]) {
    await expect(page.getByRole("heading", { name })).toBeVisible();
  }
  for (const link of ["Services", "Work", "Pricing", "FAQ", "About"]) {
    await expect(page.locator("#site-nav").getByRole("link", { name: link })).toBeVisible();
  }
});

test("contact points at the business email, not the personal one", async ({ page }) => {
  await page.goto("/");
  const mailtos = page.locator('a[href^="mailto:"]');
  await expect(mailtos.first()).toBeVisible();
  const count = await mailtos.count();
  for (let i = 0; i < count; i++) {
    const href = await mailtos.nth(i).getAttribute("href");
    expect(href).toContain("kiteforge1@gmail.com");
    expect(href).not.toContain("hikite1@gmail.com");
  }
});

test("no leftover WordPress / PHP assumptions in the markup", async ({ page }) => {
  await page.goto("/");
  // Ignore external embed URLs (e.g. Facebook's page.php plugin) - only our own markup matters.
  const html = (await page.content()).replace(/https:\/\/[^"'\s]*facebook\.com\/[^"'\s]*/gi, "");
  expect(html).not.toMatch(/wp-content|wp-json|wp-includes|wp-admin|wp-login|xmlrpc\.php|admin-ajax/i);
});

test("pricing reflects the JAMstack model, not the old WordPress tiers", async ({ page }) => {
  await page.goto("/");
  const pricing = page.locator("#pricing");
  for (const name of ["Custom website", "Care plans", "Social media"]) {
    await expect(pricing.getByRole("heading", { name })).toBeVisible();
  }
  await expect(pricing).toContainText("from $15");
  await expect(pricing).not.toContainText("Template site");

  await expect(pricing.getByRole("link", { name: "full price list" })).toHaveAttribute(
    "href",
    /docs\.google\.com\/document\//,
  );
});

test("recent work lists the two client bar sites", async ({ page }) => {
  await page.goto("/");
  const work = page.locator("#work");
  await expect(work.getByRole("link", { name: "mollystoulouse.com" })).toBeVisible();
  await expect(work.getByRole("link", { name: "toulousedive.com" })).toBeVisible();
});

test("social section has the Facebook feed and both follow links", async ({ page }) => {
  await page.goto("/");
  const social = page.locator("#social");

  await expect(social.locator("iframe.fb-embed")).toHaveAttribute(
    "src",
    /facebook\.com\/plugins\/page\.php/,
  );
  await expect(social.locator("iframe.fb-embed")).toHaveAttribute("loading", "lazy");

  await expect(social.getByRole("link", { name: /Facebook/ })).toHaveAttribute(
    "href",
    "https://www.facebook.com/kiteforgewebdesigns/",
  );
  await expect(social.getByRole("link", { name: /Instagram/ })).toHaveAttribute(
    "href",
    "https://www.instagram.com/kiteforge1/",
  );
});

test("content creation section sits above contact with an embedded video", async ({ page }) => {
  await page.goto("/");
  const content = page.locator("#content");

  await expect(content.getByRole("heading", { name: "AcererakNRoll" })).toBeVisible();
  await expect(content.getByRole("link", { name: "acereraknroll.com" })).toBeVisible();

  const frame = content.locator("iframe");
  await expect(frame).toHaveAttribute("src", /youtube(-nocookie)?\.com\/embed\/BiHni7EkMdQ/);
  await expect(frame).toHaveAttribute("loading", "lazy");

  // #content comes before #contact in the DOM
  const order = await page.$$eval("main section", (els) => els.map((e) => e.id));
  expect(order.indexOf("content")).toBeGreaterThan(-1);
  expect(order.indexOf("content")).toBeLessThan(order.indexOf("contact"));
});

test("contact form is wired for Netlify with a honeypot", async ({ page }) => {
  await page.goto("/");
  const form = page.locator("form.contact-form");

  await expect(form).toHaveAttribute("data-netlify", "true");
  await expect(form).toHaveAttribute("netlify-honeypot", "bot-field");
  await expect(form.locator('input[name="form-name"][value="contact"]')).toHaveCount(1);
  await expect(form.locator('input[name="bot-field"]')).toHaveCount(1);

  for (const field of ["name", "email", "details"]) {
    await expect(form.locator(`[name="${field}"]`)).toHaveAttribute("required", "");
  }
  // Honeypot must not be visible to humans
  await expect(form.locator('input[name="bot-field"]')).not.toBeInViewport();
});

test("faq section renders expandable questions", async ({ page }) => {
  await page.goto("/");
  const faq = page.locator("#faq");
  const items = faq.locator("details.faq-item");
  expect(await items.count()).toBeGreaterThanOrEqual(4);
  await expect(faq.getByText("Do I own my website?")).toBeVisible();
});

test("who-it's-for section shows optimized industry images", async ({ page }) => {
  await page.goto("/");
  const imgs = page.locator("#who .industry img");
  expect(await imgs.count()).toBe(4);
  for (let i = 0; i < 4; i++) {
    await expect(imgs.nth(i)).toHaveAttribute("src", /\.webp$/);
  }
});

test("about section has a photo and appears before contact", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#about img.about-photo")).toBeVisible();
  const order = await page.$$eval("main section", (els) => els.map((e) => e.id));
  expect(order.indexOf("about")).toBeLessThan(order.indexOf("contact"));
});

test("privacy policy page loads and is linked from the footer", async ({ page }) => {
  await page.goto("/");
  const link = page.locator("footer").getByRole("link", { name: "Privacy" });
  await expect(link).toHaveAttribute("href", "/privacy.html");

  const res = await page.goto("/privacy.html");
  expect(res.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
  await expect(page.getByText(/Cloudflare Web Analytics/)).toBeVisible();
});

test("mobile nav toggle opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Menu" });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");

  await page.locator("#site-nav").getByRole("link", { name: "Work" }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("unknown paths 404 and a custom 404 page exists", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res.status()).toBe(404);

  // Netlify serves this for unknown paths; verify it renders and links home.
  await page.goto("/404.html");
  await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
});
