import { useEffect } from 'react'
import { CalcButton } from '../ui/Button'
import { useCalculatorStore } from '../../store/calculatorStore'
import { Delete } from 'lucide-react'

export const StandardPad = () => {
  const { 
    inputDigit, 
    inputOperator, 
    calculate, 
    clear, 
    backspace, 
    toggleSign, 
    inputDecimal,
    calculatePercentage,
    memoryClear,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    memoryStore,
    memory
  } = useCalculatorStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key
      if (/[0-9]/.test(key)) inputDigit(key)
      if (['+', '-', '*', '/'].includes(key)) {
        e.preventDefault()
        inputOperator(key === '*' ? '×' : key === '/' ? '÷' : key)
      }
      if (key === 'Enter' || key === '=') {
        e.preventDefault()
        calculate()
      }
      if (key === 'Backspace') backspace()
      if (key === 'Escape') clear()
      if (key === '.') inputDecimal()
      if (key === '%') calculatePercentage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputDigit, inputOperator, calculate, clear, backspace, inputDecimal, calculatePercentage])

  return (
    <div className="flex flex-col gap-1 w-full h-full p-2">
      {/* Memory Pad */}
      <div className="grid grid-cols-6 gap-1 mb-2">
        <CalcButton variant="action" size="sm" onClick={memoryClear} disabled={memory === 0} className="text-xs">MC</CalcButton>
        <CalcButton variant="action" size="sm" onClick={memoryRecall} disabled={memory === 0} className="text-xs">MR</CalcButton>
        <CalcButton variant="action" size="sm" onClick={memoryAdd} className="text-xs">M+</CalcButton>
        <CalcButton variant="action" size="sm" onClick={memorySubtract} className="text-xs">M-</CalcButton>
        <CalcButton variant="action" size="sm" onClick={memoryStore} className="text-xs">MS</CalcButton>
        <CalcButton variant="action" size="sm" disabled={memory === 0} className="text-xs font-semibold">M&#711;</CalcButton>
      </div>

      <div className="grid grid-cols-4 gap-1 flex-1">
        <CalcButton variant="action" onClick={calculatePercentage}>%</CalcButton>
        <CalcButton variant="action" onClick={clear} className="text-destructive">CE</CalcButton>
        <CalcButton variant="action" onClick={clear} className="text-destructive">C</CalcButton>
        <CalcButton variant="action" onClick={backspace}><Delete className="w-5 h-5" /></CalcButton>

        <CalcButton variant="action" onClick={() => {
          useCalculatorStore.getState().scientificFunc('1/x')
        }}>1/x</CalcButton>
        <CalcButton variant="action" onClick={() => {
          useCalculatorStore.getState().scientificFunc('sqr')
        }}>x²</CalcButton>
        <CalcButton variant="action" onClick={() => {
          useCalculatorStore.getState().scientificFunc('sqrt')
        }}>²√x</CalcButton>
        <CalcButton variant="action" onClick={() => inputOperator('÷')}>÷</CalcButton>

        <CalcButton size="lg" onClick={() => inputDigit('7')}>7</CalcButton>
        <CalcButton size="lg" onClick={() => inputDigit('8')}>8</CalcButton>
        <CalcButton size="lg" onClick={() => inputDigit('9')}>9</CalcButton>
        <CalcButton variant="action" onClick={() => inputOperator('×')}>×</CalcButton>

        <CalcButton size="lg" onClick={() => inputDigit('4')}>4</CalcButton>
        <CalcButton size="lg" onClick={() => inputDigit('5')}>5</CalcButton>
        <CalcButton size="lg" onClick={() => inputDigit('6')}>6</CalcButton>
        <CalcButton variant="action" onClick={() => inputOperator('-')}>-</CalcButton>

        <CalcButton size="lg" onClick={() => inputDigit('1')}>1</CalcButton>
        <CalcButton size="lg" onClick={() => inputDigit('2')}>2</CalcButton>
        <CalcButton size="lg" onClick={() => inputDigit('3')}>3</CalcButton>
        <CalcButton variant="action" onClick={() => inputOperator('+')}>+</CalcButton>

        <CalcButton size="lg" onClick={toggleSign}>+/-</CalcButton>
        <CalcButton size="lg" onClick={() => inputDigit('0')}>0</CalcButton>
        <CalcButton size="lg" onClick={inputDecimal}>.</CalcButton>
        <CalcButton variant="equals" size="lg" onClick={calculate}>=</CalcButton>
      </div>
    </div>
  )
}
