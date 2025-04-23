import { test, expect } from "@playwright/test";

test.describe("Search functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("shows search results for valid query", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search by movie title");
    await searchInput.fill("Avengers");
    // await page.keyboard.press("Enter");

    // Wait for search results to load
    await page.waitForSelector(".grid > a");

    // Check search results appear
    const results = await page.locator(".grid > a").count();
    expect(results).toBeGreaterThan(0);

    // Check for movie title
    await expect(page.getByText(/avengers/i).first()).toBeVisible();
  });
});
