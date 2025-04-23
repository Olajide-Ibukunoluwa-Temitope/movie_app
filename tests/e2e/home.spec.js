import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("shows movie grid with content", async ({ page }) => {
    // Wait for grid to be visible
    await expect(page.locator(".grid")).toBeVisible();

    // Wait for movies to load
    await page.waitForSelector(".grid > div");

    // Get first movie card
    const firstMovie = page.locator(".grid > div").first();

    // Verify movie card content
    await expect(firstMovie.locator("img")).toBeVisible();
    await expect(firstMovie.locator("h2")).toBeVisible();
    await expect(firstMovie.locator(".text-gray-400")).toBeVisible();
    await expect(firstMovie.locator(".absolute.top-2.right-2")).toBeVisible();

    // Verify link format
    const movieLink = firstMovie.locator("a");
    const href = await movieLink.getAttribute("href");
    expect(href).toMatch(/^\/movie\/\d+$/);
  });
});
