import { CONVERTER_DATA } from './converterData'

let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
let isFetching = false;

// Multiple reliable free APIs with no API key required for fallbacks
const FETCH_URLS = [
  'https://open.er-api.com/v6/latest/USD',
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
  'https://api.frankfurter.app/latest?from=USD'
];

const fetchWithTimeout = async (url: string, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, { signal: controller.signal });
  clearTimeout(id);
  return response;
};

export const updateCurrencyRates = async (): Promise<boolean> => {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_DURATION) return true;
  if (isFetching) return true; // prevent duplicate parallel calls

  isFetching = true;

  try {
    let success = false;
    let ratesData: Record<string, number> | null = null;

    // Try APIs sequentially until one succeeds
    for (const url of FETCH_URLS) {
      try {
        const res = await fetchWithTimeout(url, 4000);
        if (!res.ok) continue;
        const data = await res.json();
        
        if (data && data.rates) {
          ratesData = data.rates; // open.er-api or frankfurter format
          success = true;
          break;
        } else if (data && data.usd) {
          // cdn.jsdelivr format has { date: string, usd: { eur: 0.9, ... } }
          // We need to uppercase keys for our system
          ratesData = {};
          for (const [key, val] of Object.entries(data.usd)) {
            ratesData[key.toUpperCase()] = Number(val);
          }
          success = true;
          break;
        }
      } catch {
        // Silently continue to next fallback
        continue;
      }
    }

    if (success && ratesData) {
      const liveRates = { USD: 1, ...ratesData };
      const currentUnits = CONVERTER_DATA.Currency.units as Record<string, number>;
      
      CONVERTER_DATA.Currency.units = {
        ...currentUnits,
        ...liveRates
      };
      
      lastFetchTime = now;
      isFetching = false;
      return true;
    }
  } catch {
    // Ultimate silent failure
  }
  
  isFetching = false;
  return false;
};
