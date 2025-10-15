// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

function compareDates(date1, date2) {
  return new Date(date1) - new Date(date2);
}

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
  await page.waitForLoadState("networkidle");

  // get all articles
  const articleTimes = await page
    .locator("td.subtext span.age")
    .evaluateAll((elements) => elements.map((el) => el.getAttribute("title")));

  // validate if that the first 30 articles are sorted from newest to oldest
  for (let i = 0; i < articleTimes.length - 1; i++) {
    if (
      compareDates(
        parseInt(articleTimes[i][1]),
        parseInt(articleTimes[i + 1][1])
      ) > 0
    ) {
      console.log(articleTimes[i], articleTimes[i + 1]);
      console.log("Articles are not sorted from newest to oldest properly.");
    } else {
      console.log("Articles are sorted from newest to oldest properly.");
      return;
    }
  }
}

(async () => {
  await sortHackerNewsArticles();
})();
