const puppeteer = require("puppeteer");

const url = "https://www.reddit.com/r/CryptoCurrency/new/";

const fetchData = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);

    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector(
      "#main-content > div:nth-child(3) > shreddit-feed > faceplate-batch"
    );

    const feed = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        "#main-content > div:nth-child(3) > shreddit-feed > faceplate-batch > article > shreddit-post > div > div:nth-child(2) > div:nth-child(2) > a"
      );
      // return elements;
      return Array.from(elements).map((element) => element.innerHTML);
    });

    await browser.close();
    // console.log(feed);
    // return feed;
  } catch (err) {
    console.error(err);
  }
};

// ^ this gives me an array of all of the titles for each post.
fetchData();

// TODO:
// 1. Count the occurunces against a sorted list of each crypto name mentioned
// 2. make everything lowercase
