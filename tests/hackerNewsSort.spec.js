// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
// USE "npx playwright test" to run the test script
import { test, expect, chromium } from "@playwright/test";

test("Verify Hacker News articles are sorted from newest to oldest", async () => {
  // Launch Chrome browser
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Define locators
  const LOCATORS = {
    articleDate: "td.subtext span.age",
    moreLink: "a.morelink",
  };

  // Go to Hacker News website
  await page.goto("https://news.ycombinator.com/newest", {
    waitUntil: "networkidle",
  });

  const maxArticles = 100;
  let totalArticles = 0;
  let allArticleDates = [];

  while (totalArticles < maxArticles) {
    // Extract article dates on the current page
    const articleDates = await getArticleDates(page, LOCATORS.articleDate);

    // Add up to 100 total articles
    const remaining = maxArticles - totalArticles;
    const limitedDates = articleDates.slice(0, remaining);
    allArticleDates = allArticleDates.concat(limitedDates);
    totalArticles = allArticleDates.length;

    // Stop if reached 100
    if (totalArticles >= maxArticles) break;

    // Go to next page if available
    const moreLink = page.locator(LOCATORS.moreLink);
    const hasNext = await moreLink.isVisible();
    if (!hasNext) break;

    await Promise.all([page.waitForLoadState("networkidle"), moreLink.click()]);
  }

  // Assertion using Playwright’s expect
  const sorted = isSorted(allArticleDates);
  expect(sorted).toBeTruthy();

  await browser.close();
});

// Helper function: Extract article dates
async function getArticleDates(page, articleDateLocator) {
  const articleTimes = await page
    .locator(articleDateLocator)
    .evaluateAll((elements) =>
      elements.map((el) => el.getAttribute("title")).filter(Boolean)
    );
  return articleTimes.map((time) => new Date(time));
}

// Helper function: Check sorting order (newest → oldest)
function isSorted(dates) {
  for (let i = 0; i < dates.length - 1; i++) {
    if (dates[i] < dates[i + 1]) {
      return false;
    }
  }
  return true;
}
