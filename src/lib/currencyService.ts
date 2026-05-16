import { CONVERTER_DATA } from './converterData'

class CurrencyService {
  private lastFetchTime = 0;
  private isFetching = false;
  private readonly CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
  
  // Professional, highly reliable free APIs
  private readonly FALLBACK_URLS = [
    'https://open.er-api.com/v6/latest/USD',
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    'https://api.frankfurter.app/latest?from=USD'
  ];

  private async fetchWithTimeout(url: string, timeout = 4000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  public async fetchLatestRates(): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastFetchTime < this.CACHE_DURATION) return true;
    if (this.isFetching) return true;

    this.isFetching = true;

    try {
      let success = false;
      let rawRates: Record<string, number> | null = null;

      for (const url of this.FALLBACK_URLS) {
        try {
          const res = await this.fetchWithTimeout(url);
          if (!res.ok) continue;
          
          const data = await res.json();
          
          if (data && data.rates) {
            rawRates = data.rates;
            success = true;
            break;
          } else if (data && data.usd) {
            rawRates = {};
            for (const [key, val] of Object.entries(data.usd)) {
              rawRates[key.toUpperCase()] = Number(val);
            }
            success = true;
            break;
          }
        } catch {
          // Silent retry with next fallback
          continue;
        }
      }

      if (success && rawRates) {
        const liveRates: Record<string, number> = { USD: 1 };
        
        // Critical Fix: 
        // APIs return rates as 1 USD = X Target (e.g. 1 USD = 83 INR)
        // Our converterData expects 1 Target = X Base (e.g. 1 INR = 0.012 USD)
        // We MUST mathematically invert the API rates before injecting them.
        for (const [currency, rate] of Object.entries(rawRates)) {
          if (typeof rate === 'number' && rate > 0) {
            liveRates[currency.toUpperCase()] = 1 / rate;
          }
        }

        const currentUnits = CONVERTER_DATA.Currency.units as Record<string, number>;
        
        CONVERTER_DATA.Currency.units = {
          ...currentUnits,
          ...liveRates
        };
        
        this.lastFetchTime = now;
        this.isFetching = false;
        return true;
      }
    } catch {
      // Complete silent failure - preserve functional UI using static cached data
    }
    
    this.isFetching = false;
    return false; // Tells UI that live update failed
  }
}

export const currencyService = new CurrencyService();
export const updateCurrencyRates = () => currencyService.fetchLatestRates();
