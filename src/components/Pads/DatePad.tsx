import { useState } from 'react'
import { differenceInDays, addDays, format, isValid, parseISO } from 'date-fns'

export const DatePad = () => {
  const [mode, setMode] = useState<'diff' | 'add'>('diff')
  const [date1, setDate1] = useState(new Date().toISOString().split('T')[0])
  const [date2, setDate2] = useState(new Date().toISOString().split('T')[0])
  const [daysToAdd, setDaysToAdd] = useState(0)

  const renderResult = () => {
    if (mode === 'diff') {
      const d1 = parseISO(date1)
      const d2 = parseISO(date2)
      if (!isValid(d1) || !isValid(d2)) return 'Invalid date'
      const diff = Math.abs(differenceInDays(d2, d1))
      
      const years = Math.floor(diff / 365)
      const months = Math.floor((diff % 365) / 30)
      const days = diff - (years * 365) - (months * 30)
      
      let res = ''
      if (years) res += `${years} years `
      if (months) res += `${months} months `
      if (days) res += `${days} days`
      if (!res) res = 'Same date'
      
      return (
        <div>
          <div className="text-3xl font-semibold">{diff} Days</div>
          <div className="text-muted-foreground">{res}</div>
        </div>
      )
    } else {
      const d1 = parseISO(date1)
      if (!isValid(d1)) return 'Invalid date'
      const resDate = addDays(d1, daysToAdd)
      return (
        <div>
          <div className="text-3xl font-semibold">{format(resDate, 'EEEE, MMMM d, yyyy')}</div>
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col w-full h-full p-6">
      <div className="flex gap-4 mb-8">
        <button 
          className={`px-4 py-2 rounded-md ${mode === 'diff' ? 'bg-primary text-primary-foreground' : 'bg-black/10'}`}
          onClick={() => setMode('diff')}
        >
          Difference between dates
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${mode === 'add' ? 'bg-primary text-primary-foreground' : 'bg-black/10'}`}
          onClick={() => setMode('add')}
        >
          Add or subtract days
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-md">
        <div>
          <label className="text-sm font-semibold mb-2 block">From</label>
          <input 
            type="date" 
            value={date1}
            onChange={(e) => setDate1(e.target.value)}
            className="w-full bg-black/10 p-3 rounded-md outline-none"
          />
        </div>

        {mode === 'diff' ? (
          <div>
            <label className="text-sm font-semibold mb-2 block">To</label>
            <input 
              type="date" 
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              className="w-full bg-black/10 p-3 rounded-md outline-none"
            />
          </div>
        ) : (
          <div>
            <label className="text-sm font-semibold mb-2 block">Days</label>
            <input 
              type="number" 
              value={daysToAdd}
              onChange={(e) => setDaysToAdd(parseInt(e.target.value) || 0)}
              className="w-full bg-black/10 p-3 rounded-md outline-none"
            />
          </div>
        )}

        <div className="mt-8">
          <label className="text-sm font-semibold mb-2 block">Result</label>
          {renderResult()}
        </div>
      </div>
    </div>
  )
}
