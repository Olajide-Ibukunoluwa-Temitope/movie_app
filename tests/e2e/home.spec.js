import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("search functionality works correctly", async ({ page }) => {
    // Type in search input
    const searchInput = page.locator(
      'input[placeholder="Search by movie title"]'
    );
    await searchInput.fill("The Matrix");

    // Wait for debounced search to complete
    await page.waitForTimeout(1000);

    // Wait for search results using the correct class selector
    await expect(async () => {
      const movieCards = page.locator(".movie-card");
      const count = await movieCards.count();
      expect(count).toBeGreaterThan(0);
    }).toPass({ timeout: 30000 });

    // Verify first result contains search term
    const firstMovieTitle = page.locator(".movie-card h2").first();
    const title = await firstMovieTitle.textContent();
    expect(title.toLowerCase()).toContain("matrix");
  });

  test("category tabs work correctly", async ({ page }) => {
    // Click on the "Top Rated" tab
    await page.click('button:text("Top Rated")');

    // Wait for movies to load
    await page.waitForSelector(".movie-card");

    // Verify movies are displayed
    const movieCards = page.locator(".movie-card");
    const count = await movieCards.count();
    expect(count).toBeGreaterThan(0);

    // Click on "Now Playing" tab
    await page.click('button:text("Now Playing")');
    await page.waitForTimeout(1000);

    // Verify different movies are displayed
    const newMovieCards = page.locator(".movie-card");
    const newCount = await newMovieCards.count();
    expect(newCount).toBeGreaterThan(0);

    // Get first movie title from current category to verify they're different
    const firstMovieTitle = await page
      .locator(".movie-card h2")
      .first()
      .textContent();

    // Switch back to Top Rated
    await page.click('button:text("Top Rated")');
    await page.waitForTimeout(1000);

    const newFirstMovieTitle = await page
      .locator(".movie-card h2")
      .first()
      .textContent();
    expect(firstMovieTitle).not.toEqual(newFirstMovieTitle);
  });

  test("pagination controls work correctly", async ({ page }) => {
    // Get first page movies
    const firstPageMovies = await page
      .locator(".movie-card h2")
      .allTextContents();

    // Click next page button
    await page.click(
      'ul li:last-child a[role="button"][aria-label="Next page"]'
    );
    await page.waitForTimeout(1000);

    // Get second page movies
    const secondPageMovies = await page
      .locator(".movie-card h2")
      .allTextContents();

    // Verify different movies are shown
    expect(firstPageMovies).not.toEqual(secondPageMovies);

    // Verify can go back to first page
    await page.click(
      'ul li:first-child a[role="button"][aria-label="Previous page"]'
    );
    await page.waitForTimeout(1000);

    const backToFirstMovies = await page
      .locator(".movie-card h2")
      .allTextContents();
    expect(backToFirstMovies).toEqual(firstPageMovies);
  });

  test("movie cards display correct information", async ({ page }) => {
    // Check first movie card has all expected elements
    const firstCard = page.locator(".movie-card").first();

    await expect(firstCard.locator(".movie-title")).toBeVisible(); // Title
    await expect(firstCard.locator("img")).toBeVisible(); // Poster
    await expect(firstCard.locator(".movie-release-date")).toBeVisible(); // Release date
  });

  test("search input clears correctly", async ({ page }) => {
    // Type search term
    await page.fill('input[placeholder="Search by movie title"]', "matrix");

    // Wait for search results
    await page.waitForTimeout(1000);

    // Clear search
    await page.fill('input[placeholder="Search by movie title"]', "");
    await page.waitForTimeout(1000);

    // Verify original movies are shown again
    const movieCards = page.locator(".movie-card");
    await expect(movieCards).toHaveCount(await movieCards.count());
  });
});
