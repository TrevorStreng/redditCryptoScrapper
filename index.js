const puppeteer = require("puppeteer");
const cryptos = require("./cryptoList.js");

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

    for (let i = 0; i < feed.length; i++) {
      feed[i] = feed[i].split(" ");
    }
    let arr = feed.flat();
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === "" || arr[i] === "\n") {
        arr.splice(i, 1);
        i--;
      }
    }
    arr = arr.map((item) => item.trim());

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < cryptos.length; j++) {
        const word = arr[i].toLowerCase();
        if (word === cryptos[j].name || word === cryptos[j].ticker)
          cryptos[j].cnt++;
      }
    }
    console.log(cryptos);

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
