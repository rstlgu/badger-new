export interface Pattern {
  name: string;
  regex: RegExp;
  description: string;
  category: 'crypto' | 'network' | 'personal' | 'financial' | 'identifiers' | 'security';
}

export const PATTERNS: Pattern[] = [
  // === CRYPTO ===
  {
    name: 'Bitcoin Address',
    regex: /(?:^|[^a-km-zA-HJ-NP-Z0-9])(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{39,59})(?:$|[^a-km-zA-HJ-NP-Z0-9])/g,
    description: 'Legacy, SegWit, Bech32',
    category: 'crypto',
  },
  {
    name: 'Ethereum Address',
    regex: /0x[a-fA-F0-9]{40}/g,
    description: 'Indirizzo ETH',
    category: 'crypto',
  },
  {
    name: 'Ethereum Transaction',
    regex: /0x[a-fA-F0-9]{64}/g,
    description: 'TX Hash ETH',
    category: 'crypto',
  },
  {
    name: 'Monero Address',
    regex: /4[0-9AB][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{93}/g,
    description: 'Indirizzo XMR',
    category: 'crypto',
  },
  {
    name: 'Tron Address',
    regex: /T[A-Za-z1-9]{33}/g,
    description: 'Indirizzo TRX',
    category: 'crypto',
  },
  {
    name: 'Transaction Hash',
    regex: /[a-fA-F0-9]{64}/g,
    description: 'Hash 64 caratteri',
    category: 'crypto',
  },
  
  // === NETWORK ===
  {
    name: 'IP Address',
    regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    description: 'IPv4',
    category: 'network',
  },
  {
    name: 'IPv6 Address',
    regex: /(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|::/g,
    description: 'Indirizzo IPv6',
    category: 'network',
  },
  {
    name: 'MAC Address',
    regex: /(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})/g,
    description: 'Indirizzo MAC',
    category: 'network',
  },
  {
    name: 'URL',
    regex: /https?:\/\/[^\s/$.?#].[^\s]*/g,
    description: 'Link HTTP/HTTPS',
    category: 'network',
  },
  
  // === PERSONAL ===
  {
    name: 'Email',
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    description: 'Indirizzi email',
    category: 'personal',
  },
  {
    name: 'Phone Number (IT)',
    regex: /(?:\+39|0039)?\s?[0-9]{2,3}[\s.-]?[0-9]{6,7}/g,
    description: 'Telefono italiano',
    category: 'personal',
  },
  {
    name: 'Phone Number (International)',
    regex: /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}|(?:\+\d{1,3}[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
    description: 'Telefono internazionale',
    category: 'personal',
  },
  {
    name: 'IMEI',
    regex: /\b\d{15}\b/g,
    description: 'IMEI dispositivo',
    category: 'personal',
  },
  {
    name: 'GPS Coordinates',
    regex: /-?\d+\.\d+,\s*-?\d+\.\d+|latitude[:\s=]+-?\d+\.\d+|longitude[:\s=]+-?\d+\.\d+/gi,
    description: 'Coordinate GPS',
    category: 'personal',
  },
  {
    name: 'Date (DD/MM/YYYY)',
    regex: /\b(0[1-9]|[12][0-9]|3[01])[\/\-](0[1-9]|1[0-2])[\/\-](19|20)\d{2}\b/g,
    description: 'Data formato italiano',
    category: 'personal',
  },
  {
    name: 'Date (YYYY-MM-DD)',
    regex: /\b(19|20)\d{2}[\/\-](0[1-9]|1[0-2])[\/\-](0[1-9]|[12][0-9]|3[01])\b/g,
    description: 'Data formato ISO',
    category: 'personal',
  },
  
  // === FINANCIAL ===
  {
    name: 'Credit Card',
    regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    description: 'Carta di credito',
    category: 'financial',
  },
  {
    name: 'IBAN',
    regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{4,30}\b/g,
    description: 'IBAN bancario',
    category: 'financial',
  },
  {
    name: 'SWIFT Code',
    regex: /\b[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?\b/g,
    description: 'Codice SWIFT',
    category: 'financial',
  },
  
  // === IDENTIFIERS ===
  {
    name: 'Codice Fiscale (IT)',
    regex: /\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b/g,
    description: 'Codice fiscale italiano',
    category: 'identifiers',
  },
  {
    name: 'Partita IVA (IT)',
    regex: /\b\d{11}\b/g,
    description: 'Partita IVA italiana',
    category: 'identifiers',
  },
  {
    name: 'Username (Twitter/X)',
    regex: /@[a-zA-Z0-9_]{1,15}\b/g,
    description: 'Username Twitter/X',
    category: 'identifiers',
  },
  {
    name: 'Username (Instagram)',
    regex: /@[a-zA-Z0-9._]{1,30}\b/g,
    description: 'Username Instagram',
    category: 'identifiers',
  },
  {
    name: 'ISBN',
    regex: /\b(?:ISBN[- ]?)?(?:\d{3}[- ]?)?\d{1,5}[- ]?\d{1,7}[- ]?\d{1,6}[- ]?\d\b/g,
    description: 'ISBN libro',
    category: 'identifiers',
  },
  
  // === SECURITY ===
  {
    name: 'API Key (AWS)',
    regex: /AKIA[0-9A-Z]{16}/g,
    description: 'AWS Access Key',
    category: 'security',
  },
  {
    name: 'API Key (GitHub)',
    regex: /ghp_[a-zA-Z0-9]{36}|gho_[a-zA-Z0-9]{36}|ghu_[a-zA-Z0-9]{36}|ghs_[a-zA-Z0-9]{36}|ghr_[a-zA-Z0-9]{76}/g,
    description: 'GitHub Token',
    category: 'security',
  },
  {
    name: 'JWT Token',
    regex: /eyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g,
    description: 'JWT Token',
    category: 'security',
  },
  {
    name: 'MD5 Hash',
    regex: /\b[a-fA-F0-9]{32}\b/g,
    description: 'Hash MD5',
    category: 'security',
  },
  {
    name: 'SHA1 Hash',
    regex: /\b[a-fA-F0-9]{40}\b/g,
    description: 'Hash SHA1',
    category: 'security',
  },
  {
    name: 'SHA256 Hash',
    regex: /\b[a-fA-F0-9]{64}\b/g,
    description: 'Hash SHA256',
    category: 'security',
  },
  {
    name: 'Private Key (SSH)',
    regex: /-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----[\s\S]*?-----END (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/g,
    description: 'Chiave privata SSH',
    category: 'security',
  },
];

export function analyzeText(text: string, selectedPatterns: string[], customPatterns?: Pattern[]): Map<string, string[]> {
  const results = new Map<string, string[]>();
  
  const allPatterns = customPatterns ? [...PATTERNS, ...customPatterns] : PATTERNS;
  
  for (const pattern of allPatterns) {
    if (!selectedPatterns.includes(pattern.name)) continue;
    
    // Reset regex lastIndex to avoid issues with global flag
    pattern.regex.lastIndex = 0;
    
    const matches = text.match(pattern.regex);
    if (matches) {
      const uniqueMatches = [...new Set(matches.map(m => m.trim()))];
      if (uniqueMatches.length > 0) {
        results.set(pattern.name, uniqueMatches);
      }
    }
  }
  
  return results;
}
