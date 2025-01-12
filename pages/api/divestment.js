import axios from "axios";
const cheerio = require("cheerio");

export default async function handler(req, res) {
  const url =
    "https://theislamicinformation.com/news/list-of-brands-supporting-israel";

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const brands = [];
    $("figure.wp-block-table table tbody tr").each((index, element) => {
      const brandName = $(element).find("td strong").text().trim();
      const reason = $(element).find("td:nth-child(2) em").text().trim();

      if (brandName && reason) {
        brands.push({ brandName, reason });
      }
    });

    if (brands.length === 0) {
      throw new Error(
        "No data found. Please check the structure of the webpage."
      );
    }

    res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "Error fetching divestment data" });
  }
}
