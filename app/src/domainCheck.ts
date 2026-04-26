interface DomainEntry {
  domain: string;
  name: string;
}

const legitimateDomains: DomainEntry[] = [
  { domain: "ndtv.com", name: "NDTV" },
  { domain: "aajtak.in", name: "Aaj Tak" },
  { domain: "indiatoday.in", name: "India Today" },
  { domain: "timesofindia.indiatimes.com", name: "Times of India" },
  { domain: "hindustantimes.com", name: "Hindustan Times" },
  { domain: "indianexpress.com", name: "The Indian Express" },
  { domain: "thehindu.com", name: "The Hindu" },
  { domain: "livemint.com", name: "Mint" },
  { domain: "bbc.com", name: "BBC" },
  { domain: "bbc.co.uk", name: "BBC" },
  { domain: "reuters.com", name: "Reuters" },
  { domain: "apnews.com", name: "Associated Press" },
  { domain: "npr.org", name: "NPR" },
  { domain: "cnn.com", name: "CNN" },
  { domain: "nytimes.com", name: "The New York Times" },
  { domain: "washingtonpost.com", name: "The Washington Post" },
  { domain: "theguardian.com", name: "The Guardian" },
];

const satireDomains: DomainEntry[] = [
  { domain: "theonion.com", name: "The Onion" },
  { domain: "thedailymash.co.uk", name: "The Daily Mash" },
  { domain: "worldnewsdailyreport.com", name: "World News Daily Report" },
  { domain: "babylonbee.com", name: "The Babylon Bee" },
];

const lowCredibilityDomains: DomainEntry[] = [
  { domain: "infowars.com", name: "InfoWars" },
  { domain: "beforeitsnews.com", name: "Before It's News" },
  { domain: "naturalnews.com", name: "Natural News" },
  { domain: "yournewswire.com", name: "Your News Wire" },
];

export interface DomainSignal {
  hostname: string;
  category: "legitimate" | "satire" | "low_credibility" | "unknown";
  sourceName: string | null;
  reputation: string;
  guidance: string;
}

function matchesDomain(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function normalizeHostname(url: string): string {
  return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
}

export function checkDomain(url: string): DomainSignal {
  const hostname = normalizeHostname(url);
  const satireMatch = satireDomains.find((entry) => matchesDomain(hostname, entry.domain));
  const lowCredibilityMatch = lowCredibilityDomains.find((entry) =>
    matchesDomain(hostname, entry.domain)
  );
  const legitimateMatch = legitimateDomains.find((entry) => matchesDomain(hostname, entry.domain));

  if (satireMatch) {
    return {
      hostname,
      category: "satire",
      sourceName: satireMatch.name,
      reputation: `Known satire publisher (${satireMatch.name})`,
      guidance:
        "Treat this publisher as satire by default. Claims should not be treated as factual reporting unless the article itself clearly indicates otherwise.",
    };
  }

  if (lowCredibilityMatch) {
    return {
      hostname,
      category: "low_credibility",
      sourceName: lowCredibilityMatch.name,
      reputation: `Publisher with a low-credibility or misinformation history (${lowCredibilityMatch.name})`,
      guidance:
        "Use this as a negative trust signal, but still inspect the article for sourcing, attribution, and whether it republishes verifiable information.",
    };
  }

  if (legitimateMatch) {
    return {
      hostname,
      category: "legitimate",
      sourceName: legitimateMatch.name,
      reputation: `Known mainstream news publisher (${legitimateMatch.name})`,
      guidance:
        "Use this as a positive trust signal, but do not assume the article is correct without checking sourcing, specificity, and tone.",
    };
  }

    return {
      hostname,
      category: "unknown",
      sourceName: null,
      reputation: "Publisher not recognized in the current reputation lists",
      guidance:
        "Do not assign a neutral midpoint score just because the publisher is unknown. Judge the article primarily on evidence, attribution, specificity, and tone.",
  };
}
