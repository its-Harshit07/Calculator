import React from 'react'
import { CalcButton } from '../ui/Button'
import { useCalculatorStore } from '../../store/calculatorStore'
import { Delete } from 'lucide-react'

export const ProgrammerPad = () => {
  const { 
    inputDigit, inputOperator, calculate, clear, backspace,
    base, setBase, display
  } = useCalculatorStore()

  let hex = '0', dec = '0', oct = '0', bin = '0'
  try {
    const val = parseInt(display, base === 'HEX' ? 16 : base === 'OCT' ? 8 : base === 'BIN' ? 2 : 10)
    if (!isNaN(val)) {
      hex = val.toString(16).toUpperCase()
      dec = val.toString(10)
      oct = val.toString(8)
      bin = val.toString(2)
    }
  } catch (e) {}

  return (
    <div className="flex flex-col w-full h-full p-2">
      <div className="flex flex-col gap-1 mb-4 text-sm font-mono p-2 bg-black/10 rounded-lg">
        <div 
          className={`flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white/5 ${base === 'HEX' ? 'text-blue-500' : ''}`}
          onClick={() => setBase('HEX')}
        >
          <span className="w-8">HEX</span> <span>{hex}</span>
        </div>
        <div 
          className={`flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white/5 ${base === 'DEC' ? 'text-blue-500' : ''}`}
          onClick={() => setBase('DEC')}
        >
          <span className="w-8">DEC</span> <span>{dec}</span>
        </div>
        <div 
          className={`flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white/5 ${base === 'OCT' ? 'text-blue-500' : ''}`}
          onClick={() => setBase('OCT')}
        >
          <span className="w-8">OCT</span> <span>{oct}</span>
        </div>
        <div 
          className={`flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white/5 ${base === 'BIN' ? 'text-blue-500' : ''}`}
          onClick={() => setBase('BIN')}
        >
          <span className="w-8">BIN</span> <span>{bin}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1 flex-1 text-sm">
        <CalcButton variant="action" disabled>Lsh</CalcButton>
        <CalcButton variant="action" disabled>Rsh</CalcButton>
        <CalcButton variant="action" disabled>Or</CalcButton>
        <CalcButton variant="action" disabled>Xor</CalcButton>
        <CalcButton variant="action" disabled>Not</CalcButton>

        <CalcButton variant="action" disabled>↑</CalcButton>
        <CalcButton variant="action" disabled>Mod</CalcButton>
        <CalcButton variant="action" onClick={clear}>CE</CalcButton>
        <CalcButton variant="action" onClick={clear}>C</CalcButton>
        <CalcButton variant="action" onClick={backspace}><Delete className="w-4 h-4" /></CalcButton>

        <CalcButton onClick={() => inputDigit('A')} disabled={base !== 'HEX'}>A</CalcButton>
        <CalcButton onClick={() => inputDigit('B')} disabled={base !== 'HEX'}>B</CalcButton>
        <CalcButton onClick={() => inputDigit('7')} disabled={base === 'BIN'}>7</CalcButton>
        <CalcButton onClick={() => inputDigit('8')} disabled={base === 'BIN' || base === 'OCT'}>8</CalcButton>
        <CalcButton onClick={() => inputDigit('9')} disabled={base === 'BIN' || base === 'OCT'}>9</CalcButton>

        <CalcButton onClick={() => inputDigit('C')} disabled={base !== 'HEX'}>C</CalcButton>
        <CalcButton onClick={() => inputDigit('D')} disabled={base !== 'HEX'}>D</CalcButton>
        <CalcButton onClick={() => inputDigit('4')} disabled={base === 'BIN'}>4</CalcButton>
        <CalcButton onClick={() => inputDigit('5')} disabled={base === 'BIN'}>5</CalcButton>
        <CalcButton onClick={() => inputDigit('6')} disabled={base === 'BIN'}>6</CalcButton>

        <CalcButton onClick={() => inputDigit('E')} disabled={base !== 'HEX'}>E</CalcButton>
        <CalcButton onClick={() => inputDigit('F')} disabled={base !== 'HEX'}>F</CalcButton>
        <CalcButton onClick={() => inputDigit('1')}>1</CalcButton>
        <CalcButton onClick={() => inputDigit('2')} disabled={base === 'BIN'}>2</CalcButton>
        <CalcButton onClick={() => inputDigit('3')} disabled={base === 'BIN'}>3</CalcButton>

        <CalcButton variant="action" disabled>(</CalcButton>
        <CalcButton variant="action" disabled>)</CalcButton>
        <CalcButton variant="action" disabled>+/-</CalcButton>
        <CalcButton onClick={() => inputDigit('0')}>0</CalcButton>
        <CalcButton variant="equals" onClick={() => {}}>=</CalcButton>
      </div>
    </div>
  )
}
