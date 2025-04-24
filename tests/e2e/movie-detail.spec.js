import { test, expect } from "@playwright/test";

test.describe("Movie Detail page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/movie/603");
  });

  test("displays movie details correctly", async ({ page }) => {
    // Check for main movie information
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("img#movie-poster")).toBeVisible();
    await expect(page.locator(".movie-release-date")).toBeVisible();
    await expect(page.locator(".movie-runtime")).toBeVisible();
    await expect(page.locator(".movie-budget")).toBeVisible();
  });

  test("tabs navigation works correctly", async ({ page }) => {
    const tabs = ["Actors", "Recommendations", "Recent Reviews"];

    for (const tab of tabs) {
      await page.click(`button:text("${tab}")`);
      await page.waitForTimeout(500);

      if (tab === "Actors") {
        await expect(page.locator(".cast-card").first()).toBeVisible();
      } else if (tab === "Recommendations") {
        await expect(page.locator(".movie-card").first()).toBeVisible();
      } else if (tab === "Recent Reviews") {
        await expect(page.locator(".no-reviews")).toBeVisible();
      }
    }
  });

  test("back button navigates to home page", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const searchInput = page.locator(
      'input[placeholder="Search by movie title"]'
    );
    await searchInput.fill("The Matrix");
    await page.waitForTimeout(1000);
    await page.locator(".movie-card").first().click();
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL("http://localhost:3000");
  });

  test("watchlist button should not be visible when not logged in", async ({
    page,
  }) => {
    const watchlistButton = page.locator('[data-testid="watchlist-button"]');
    await expect(watchlistButton).not.toBeVisible();
  });

  test("displays movie genres correctly", async ({ page }) => {
    const genres = page.locator('[data-testid="genre-tag"]');
    const count = await genres.count();
    expect(count).toBeGreaterThan(0);

    // Verify each genre tag is visible and has text
    for (let i = 0; i < count; i++) {
      const genre = genres.nth(i);
      await expect(genre).toBeVisible();
      const text = await genre.textContent();
      expect(text).toBeTruthy();
    }
  });

  test("displays movie rating correctly", async ({ page }) => {
    const rating = page.locator('[data-testid="movie-rating"]');
    await expect(rating).toBeVisible();
    const ratingText = await rating.textContent();
    expect(Number(ratingText)).toBeGreaterThanOrEqual(0);
    expect(Number(ratingText)).toBeLessThanOrEqual(10);
  });
});
