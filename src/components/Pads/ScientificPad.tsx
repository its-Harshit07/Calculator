import { CalcButton } from '../ui/Button'
import { useCalculatorStore } from '../../store/calculatorStore'
import { Delete } from 'lucide-react'

export const ScientificPad = () => {
  const { 
    inputDigit, inputOperator, calculate, clear, backspace, toggleSign, inputDecimal,
    scientificFunc
  } = useCalculatorStore()

  return (
    <div className="flex flex-col gap-1 w-full h-full p-2">
      <div className="grid grid-cols-5 gap-1 flex-1 text-sm">
        <CalcButton variant="action" onClick={() => scientificFunc('2nd')}>2nd</CalcButton>
        <CalcButton variant="action" onClick={() => scientificFunc('pi')}>π</CalcButton>
        <CalcButton variant="action" onClick={() => scientificFunc('e')}>e</CalcButton>
        <CalcButton variant="action" onClick={() => clear()}>C</CalcButton>
        <CalcButton variant="action" onClick={() => backspace()}><Delete className="w-4 h-4" /></CalcButton>

        <CalcButton variant="action" onClick={() => scientificFunc('sqr')}>x²</CalcButton>
        <CalcButton variant="action" onClick={() => scientificFunc('1/x')}>1/x</CalcButton>
        <CalcButton variant="action" onClick={() => scientificFunc('abs')}>|x|</CalcButton>
        <CalcButton variant="action" onClick={() => scientificFunc('exp')}>exp</CalcButton>
        <CalcButton variant="action" onClick={() => inputOperator('mod')}>mod</CalcButton>

        <CalcButton variant="action" onClick={() => scientificFunc('sqrt')}>²√x</CalcButton>
        <CalcButton variant="action" onClick={() => inputOperator('(')}>(</CalcButton>
        <CalcButton variant="action" onClick={() => inputOperator(')')}>)</CalcButton>
        <CalcButton variant="action" onClick={() => scientificFunc('fact')}>n!</CalcButton>
        <CalcButton variant="action" onClick={() => inputOperator('÷')}>÷</CalcButton>

        <CalcButton variant="action" onClick={() => scientificFunc('pow')}>x^y</CalcButton>
        <CalcButton onClick={() => inputDigit('7')}>7</CalcButton>
        <CalcButton onClick={() => inputDigit('8')}>8</CalcButton>
        <CalcButton onClick={() => inputDigit('9')}>9</CalcButton>
        <CalcButton variant="action" onClick={() => inputOperator('×')}>×</CalcButton>

        <CalcButton variant="action" onClick={() => scientificFunc('10x')}>10^x</CalcButton>
        <CalcButton onClick={() => inputDigit('4')}>4</CalcButton>
        <CalcButton onClick={() => inputDigit('5')}>5</CalcButton>
        <CalcButton onClick={() => inputDigit('6')}>6</CalcButton>
        <CalcButton variant="action" onClick={() => inputOperator('-')}>-</CalcButton>

        <CalcButton variant="action" onClick={() => scientificFunc('log')}>log</CalcButton>
        <CalcButton onClick={() => inputDigit('1')}>1</CalcButton>
        <CalcButton onClick={() => inputDigit('2')}>2</CalcButton>
        <CalcButton onClick={() => inputDigit('3')}>3</CalcButton>
        <CalcButton variant="action" onClick={() => inputOperator('+')}>+</CalcButton>

        <CalcButton variant="action" onClick={() => scientificFunc('ln')}>ln</CalcButton>
        <CalcButton onClick={toggleSign}>+/-</CalcButton>
        <CalcButton onClick={() => inputDigit('0')}>0</CalcButton>
        <CalcButton onClick={inputDecimal}>.</CalcButton>
        <CalcButton variant="equals" onClick={calculate}>=</CalcButton>
      </div>
    </div>
  )
}
