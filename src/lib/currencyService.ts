import { CONVERTER_DATA } from './converterData'

let lastFetchTime = 0
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

export const updateCurrencyRates = async (): Promise<boolean> => {
  const now = Date.now()
  if (now - lastFetchTime < CACHE_DURATION) return true

  try {
    const res = await fetch('https://api.frankfurter.app/latest?base=USD')
    if (!res.ok) throw new Error('API failed')
    const data = await res.json()
    
    if (data && data.rates) {
      const liveRates = { USD: 1, ...data.rates }
      
      // Update the constant directly so it's globally available
      // By replacing the object entirely or merging, we can add new currencies too
      const currentUnits = CONVERTER_DATA.Currency.units as Record<string, number>
      
      // Merge live rates with fallback rates (so unsupported currencies still exist)
      CONVERTER_DATA.Currency.units = {
        ...currentUnits,
        ...liveRates
      }
      
      lastFetchTime = now
      return true
    }
  } catch (error) {
    console.warn('Using fallback static currency rates due to API failure', error)
    return false
  }
  return false
}
