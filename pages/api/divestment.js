import puppeteer from "puppeteer";

export default async function handler(req, res) {
  const url =
    "https://theislamicinformation.com/news/list-of-brands-supporting-israel";

  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Wait for the table to be visible before scraping
    await page.waitForSelector("figure.wp-block-table table"); 
    

    const brands = await page.evaluate(() => {
        const brandElements = document.querySelectorAll("figure.wp-block-table table tbody tr");
      const brandList = [];

      brandElements.forEach((element) => {
        const brandName = element.querySelector("td strong")?.textContent?.trim();
        const reason = element.querySelector("td:nth-child(2) em")?.textContent?.trim();

        if (brandName && reason) {
          brandList.push({ brandName, reason });
        }
      });

      return brandList;
    });

    await browser.close();

    if (brands.length === 0) {
      throw new Error("No data found. Please check the structure of the webpage.");
    }

    // Sort brands alphabetically
    brands.sort((a, b) => a.brandName.localeCompare(b.brandName));

    res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "Error fetching divestment data" });
  }
}
