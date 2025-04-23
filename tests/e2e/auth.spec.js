import { test, expect } from "@playwright/test";

test.describe("Authentication and User Actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("user can sign in and sign out", async ({ page }) => {
    await page.click('span:has-text("SIGN IN")');

    await page.fill('input[type="email"]', "ibk12mails@gmail.com");
    await page.fill('input[type="password"]', "Password@1");
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('text="SIGN OUT"')).toBeVisible();

    await page.click('button:has-text("SIGN OUT")');

    await expect(page.locator('text="SIGN IN"')).toBeVisible();
  });

  test("signed in user can manage watchlist", async ({ page }) => {
    await page.click('span:has-text("SIGN IN")');
    await page.fill('input[type="email"]', "ibk12mails@gmail.com");
    await page.fill('input[type="password"]', "Password@1");
    await page.click('button:has-text("Sign In")');

    const firstMovieCard = page.locator(".movie-card").first();
    await firstMovieCard.click();

    const addButton = page.locator(
      'button[data-testid="watchlist-button"]:has-text("Add to Watchlist")'
    );
    await addButton.click();

    // Go to watchlist and verify movie is there
    await page.click('[data-testid="watchlist-link"]');
    await expect(page.locator(".movie-card")).toHaveCount(1);

    // go back to movie detail page
    await firstMovieCard.click();

    // Remove from watchlist
    const removeButton = page.locator(
      'button[data-testid="watchlist-button"]:has-text("Remove from Watchlist")'
    );
    await removeButton.click();

    // check if movie is removed
    await page.click('[data-testid="watchlist-link"]');
    await expect(page.locator(".movie-card")).toHaveCount(0);
  });

  test("signed in user can add a review", async ({ page }) => {
    // Sign in
    await page.click('span:has-text("SIGN IN")');
    await page.fill('input[type="email"]', "ibk12mails@gmail.com");
    await page.fill('input[type="password"]', "Password@1");
    await page.click('button:has-text("Sign In")');

    // Go to a movie detail page
    await page.locator(".movie-card").first().click();

    // Click on Reviews tab
    await page.click('button:text("Recent Reviews")');
    await page.waitForTimeout(500);

    // Add a review
    const reviewText = "This is a test review";
    await page.fill('textarea[placeholder="Write your review..."]', reviewText);
    await page.click('button:has-text("Submit Review")');

    // Verify review appears
    await expect(page.locator(".review-item").first()).toContainText(
      reviewText
    );
  });
});
