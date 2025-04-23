import { test, expect } from "@playwright/test";

test.describe("Movie details page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.locator(".grid > div").first().click();
  });

  test("displays basic movie information", async ({ page }) => {
    // Check main movie details
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("Budget:")).toBeVisible();
    await expect(page.getByText("Release date:")).toBeVisible();
    await expect(page.locator("img").first()).toBeVisible();
    await expect(page.getByText("Duration:")).toBeVisible();
  });
});
