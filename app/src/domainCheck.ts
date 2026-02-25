const satireDomains = [
  "theonion.com",
  "thedailymash.co.uk",
  "worldnewsdailyreport.com"
];

const lowCredibilityDomains = [
  "infowars.com"
];

export interface DomainSignal {
  reputation: string;
  reputationScore: number; // 0-100 modifier
}

export function checkDomain(url: string): DomainSignal {
  const hostname = new URL(url).hostname;

  if (satireDomains.some(domain => hostname.includes(domain))) {
    return { reputation: "Known Satire Publisher", reputationScore: 20 };
  }

  if (lowCredibilityDomains.some(domain => hostname.includes(domain))) {
    return { reputation: "Low Credibility History", reputationScore: 30 };
  }

  return { reputation: "No Known Issues", reputationScore: 50 };
}