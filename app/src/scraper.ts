import axios from "axios";
import * as cheerio from "cheerio";

export interface ScrapedArticle {
  article: string;
  resolvedUrl: string;
  extractionQuality: "full" | "limited";
}

export class ScrapeError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 502) {
    super(message);
    this.name = "ScrapeError";
    this.statusCode = statusCode;
  }
}

const SCRAPE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
};

function extractParagraphText(html: string): string {
  const $ = cheerio.load(html);
  let text = "";

  $("p").each((_, el) => {
    text += $(el).text() + " ";
  });

  return text.trim();
}

function buildFallbackArticle(url: string): string {
  const parsed = new URL(url);
  const hostname = parsed.hostname.replace(/^www\./, "");
  const pathTerms = parsed.pathname
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment
        .replace(/[-_]+/g, " ")
        .replace(/[0-9]+/g, " ")
        .trim()
    )
    .filter(Boolean)
    .join(". ");

  const queryTerms = parsed.searchParams
    .toString()
    .replace(/[%=&+]/g, " ")
    .trim();

  return [
    `Fallback article generated because the source page could not be fetched in time.`,
    `Original article URL: ${url}.`,
    `Publisher domain: ${hostname}.`,
    pathTerms ? `Headline/path signals: ${pathTerms}.` : "",
    queryTerms ? `Query string signals: ${queryTerms}.` : "",
    `Use domain reputation and URL wording only. This extraction is incomplete and requires manual verification.`,
  ]
    .filter(Boolean)
    .join(" ");
}

async function fetchHtml(url: string): Promise<string> {
  try {
    const response = await axios.get<string>(url, {
      headers: SCRAPE_HEADERS,
      timeout: 30000,
      maxRedirects: 10,
    });
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT")
    ) {
      const retryResponse = await axios.get<string>(url, {
        headers: {
          ...SCRAPE_HEADERS,
          Referer: new URL(url).origin,
        },
        timeout: 45000,
        maxRedirects: 10,
      });

      return retryResponse.data;
    }

    throw error;
  }
}

async function fetchViaReadableProxy(url: string): Promise<string> {
  const proxyUrl = `https://r.jina.ai/http://${url.replace(/^https?:\/\//, "")}`;
  const response = await axios.get<string>(proxyUrl, {
    headers: {
      Accept: "text/plain, text/markdown;q=0.9, */*;q=0.8",
      "User-Agent": SCRAPE_HEADERS["User-Agent"],
    },
    timeout: 20000,
  });

  return response.data;
}

function getResolvedUrl<T>(response: { config?: { url?: string }; request?: unknown }): string | undefined {
  const request = response.request as
    | { res?: { responseUrl?: string }; responseURL?: string }
    | undefined;

  return request?.res?.responseUrl ?? request?.responseURL ?? response.config?.url;
}

async function fetchResolvedHtml(url: string): Promise<ScrapedArticle> {
  try {
    const response = await axios.get<string>(url, {
      headers: SCRAPE_HEADERS,
      timeout: 30000,
      maxRedirects: 10,
    });

    return {
      article: extractParagraphText(response.data).slice(0, 12000),
      resolvedUrl: getResolvedUrl(response) ?? url,
      extractionQuality: "full",
    };
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT")
    ) {
      const retryResponse = await axios.get<string>(url, {
        headers: {
          ...SCRAPE_HEADERS,
          Referer: new URL(url).origin,
        },
        timeout: 45000,
        maxRedirects: 10,
      });

      return {
        article: extractParagraphText(retryResponse.data).slice(0, 12000),
        resolvedUrl: getResolvedUrl(retryResponse) ?? url,
        extractionQuality: "full",
      };
    }

    throw error;
  }
}

export default async function scrapeArticle(url: string): Promise<ScrapedArticle> {
  try {
    const scraped = await fetchResolvedHtml(url);

    if (!scraped.article.trim()) {
      throw new ScrapeError("Article content not found on the page", 422);
    }

    return scraped;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      try {
        const proxyText = await fetchViaReadableProxy(url);
        if (proxyText.trim()) {
          return {
            article: proxyText.slice(0, 12000),
            resolvedUrl: url,
            extractionQuality: "limited",
          };
        }
      } catch {
        return {
          article: buildFallbackArticle(url).slice(0, 12000),
          resolvedUrl: url,
          extractionQuality: "limited",
        };
      }

      if (error.response?.status) {
        throw new ScrapeError(
          `Article URL returned HTTP ${error.response.status}`,
          502
        );
      }

      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        return {
          article: buildFallbackArticle(url).slice(0, 12000),
          resolvedUrl: url,
          extractionQuality: "limited",
        };
      }

      throw new ScrapeError(
        `Could not fetch the article URL${error.code ? ` (${error.code})` : ""}`,
        502
      );
    }

    if (error instanceof ScrapeError) {
      throw error;
    }

    throw new ScrapeError("Unexpected error while scraping article", 500);
  }
}
