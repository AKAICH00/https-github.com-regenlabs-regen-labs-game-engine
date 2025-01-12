import { test, expect } from '@playwright/test';

test.describe('Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should start game correctly', async ({ page }) => {
    // Find and click start button
    await page.click('button[data-testid="start-game"]');
    
    // Verify game started
    await expect(page.locator('.game-canvas')).toBeVisible();
    await expect(page.locator('.score-display')).toBeVisible();
  });

  test('should handle player input', async ({ page }) => {
    // Start game
    await page.click('button[data-testid="start-game"]');
    
    // Simulate player input
    await page.keyboard.press('Space');
    
    // Verify game response
    const score = await page.locator('.score-display').textContent();
    expect(score).not.toBe('0');
  });

  test('should end game properly', async ({ page }) => {
    // Start game
    await page.click('button[data-testid="start-game"]');
    
    // Trigger game over condition
    await page.click('button[data-testid="end-game"]');
    
    // Verify game over state
    await expect(page.locator('.game-over-screen')).toBeVisible();
    await expect(page.locator('button[data-testid="restart-game"]')).toBeVisible();
  });

  test('should submit score to leaderboard', async ({ page }) => {
    // Start and play game
    await page.click('button[data-testid="start-game"]');
    await page.click('button[data-testid="end-game"]');
    
    // Submit score
    await page.click('button[data-testid="submit-score"]');
    
    // Verify score submission
    await expect(page.locator('.submission-success')).toBeVisible();
  });
});
