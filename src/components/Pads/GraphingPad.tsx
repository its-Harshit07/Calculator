import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import * as math from 'mathjs'

export const GraphingPad = () => {
  const [equation, setEquation] = useState('sin(x)')
  const { data, error } = useMemo(() => {
    try {
      const compiled = math.compile(equation)
      const points = []
      for (let x = -10; x <= 10; x += 0.5) {
        points.push({ x, y: compiled.evaluate({ x }) })
      }
      return { data: points, error: '' }
    } catch (e) {
      return { data: [], error: 'Invalid equation' }
    }
  }, [equation])

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="mb-4 relative">
        <span className="absolute left-3 top-2.5 font-mono text-muted-foreground">f(x) =</span>
        <input 
          type="text" 
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          className="w-full bg-black/10 border-b-2 border-primary outline-none px-12 py-2 font-mono rounded-t-md"
          placeholder="e.g. x^2 + 2x + 1"
        />
        {error && <span className="text-destructive text-xs mt-1 block">{error}</span>}
      </div>
      
      <div className="flex-1 bg-white/5 rounded-xl p-4 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="x" stroke="#888888" type="number" domain={[-10, 10]} />
            <YAxis stroke="#888888" domain={['auto', 'auto']} />
            <Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
