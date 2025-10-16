// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { get } = require("http");
const { chromium } = require("playwright");

// get all articles
const getArticleDates = async () => {
  const articleTimes = await page
    .locator("td.subtext span.age")
    .evaluateAll((elements) => elements.map((el) => el.getAttribute("title")));
  const extractedArticleDates = articleTimes.map((time) => time.split(" ")[1]);
  return extractedArticleDates;
};

// validate if the set of articles on the current page is sorted from newest to oldest
const isSorted = (articleDates, isNextPage) => {
  for (let i = 0; i < articleDates.length - 2; i++) {
    if (articleDates[i] - articleDates[i + 1] < 0) {
      isNextPage = false;
      return false;
    }
  }

  return true;
};

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
  await page.waitForLoadState("networkidle");

  let totalArticles = 0;
  const maxArticles = 100;
  isNextPage = true;

  // get article times

  while (isNextPage && totalArticles < maxArticles) {
    const articleDates = await getArticleDates();
    if (!isSorted(articleDates, totalArticles, maxArticles, isNextPage)) {
      console.log("Articles are not sorted from newest to oldest properly.");
      return;
    }
    totalArticles += articleDates.length;
    const moreLink = page.locator('a.morelink:has-text("More")');
    await moreLink.click();
  }

  // validate if that the first 30 articles are sorted from newest to oldest
  let isNextSet = true;
  // for (let i = 0; i < articleTimes.length - 1; i++) {
  //   if (
  //     compareDates(
  //       parseInt(articleTimes[i][1]),
  //       parseInt(articleTimes[i + 1][1])
  //     ) > 0
  //   ) {
  //     isNextSet = false;
  //     console.log(articleTimes[i], articleTimes[i + 1]);
  //     console.log("Articles are not sorted from newest to oldest properly.");
  //     return;
  //   }
  //   totalArticles++;
  // }

  // if (isNextSet) {
  //   const moreLink = page.locator('a.morelink:has-text("More")');
  //   await moreLink.click();
  //   await page.waitForLoadState("networkidle");

  //   const newArticleTimes = await page
  //     .locator("td.subtext span.age")
  //     .evaluateAll((elements) =>
  //       elements.map((el) => el.getAttribute("title"))
  //     );

  //   for (let i = 0; i < newArticleTimes.length - 1; i++) {
  //     if (totalArticles < 100) {
  //       if (
  //         compareDates(
  //           parseInt(newArticleTimes[i][1]),
  //           parseInt(newArticleTimes[i + 1][1])
  //         ) > 0
  //       ) {
  //         console.log(newArticleTimes[i], newArticleTimes[i + 1]);
  //         console.log("Articles are not sorted from newest to oldest properly.");
  //       }
  //     }
  //     totalArticles++;
  //   }
  // }

  //
}

(async () => {
  await sortHackerNewsArticles();
})();
