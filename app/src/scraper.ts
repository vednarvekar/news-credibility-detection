import axios from "axios";
import * as cheerio from "cheerio";

export default async function scrapeArticle(url: string): Promise<string> {
  const { data } = await axios.get<string>(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const $ = cheerio.load(data);

  let text = "";

  $("p").each((_, el) => {
    text += $(el).text() + " ";
  });

  if (!text.trim()) {
    throw new Error("Article content not found");
  }

  return text.slice(0, 12000);
}