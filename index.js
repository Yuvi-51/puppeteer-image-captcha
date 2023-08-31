const puppeteer = require("puppeteer");
const Tesseract = require("node-tesseract-ocr");

async function captureCaptchaImage(browser) {
  const page = await browser.newPage();

  try {
    await page.goto("https://freesearchigrservice.maharashtra.gov.in/", {
      timeout: 60000,
    });
    await page.waitForSelector("#imgCaptcha", { timeout: 60000 });

    const captchaImageElement = await page.$("#imgCaptcha");
    await captchaImageElement.screenshot({ path: "captcha.png" });
  } catch (error) {
    console.error("Error capturing CAPTCHA image:", error);
  }
}

async function extractTextFromCaptcha() {
  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  };

  try {
    const text = await Tesseract.recognize("captcha.png", config);

    console.log("CAPTCHA Text:", text);
  } catch (error) {
    console.error("Error recognizing CAPTCHA:", error);
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  await captureCaptchaImage(browser);
  await extractTextFromCaptcha();

  // Close the browser once you're done
  await browser.close();
})();
