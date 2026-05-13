import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, History } from 'lucide-react'
import { useCalculatorStore } from '../store/calculatorStore'
import { StandardPad } from './Pads/StandardPad'
import { ScientificPad } from './Pads/ScientificPad'
import { ProgrammerPad } from './Pads/ProgrammerPad'
import { GraphingPad } from './Pads/GraphingPad'
import { DatePad } from './Pads/DatePad'
import { ConverterPad } from './Pads/ConverterPad'
import { cn } from '../lib/utils'

export const Calculator = ({ onOpenSidebar }: { onOpenSidebar: () => void }) => {
  const { mode, converterType, display, equation, history } = useCalculatorStore()
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (mode === 'Date' || mode === 'Graphing' || mode === 'Converter') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement || 
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key;
      const { 
        inputDigit, inputOperator, calculate, clear, backspace, inputDecimal, calculatePercentage 
      } = useCalculatorStore.getState();

      if (/[0-9]/.test(key)) inputDigit(key);
      if (['+', '-', '*', '/'].includes(key)) {
        e.preventDefault();
        inputOperator(key === '*' ? '×' : key === '/' ? '÷' : key);
      }
      if (key === '(' || key === ')') {
        e.preventDefault();
        inputOperator(key);
      }
      if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
      }
      if (key === 'Backspace') backspace();
      if (key === 'Escape' || key === 'Delete') clear();
      if (key === '.') inputDecimal();
      if (key === '%') calculatePercentage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  const renderPad = () => {
    switch (mode) {
      case 'Standard': return <StandardPad />
      case 'Scientific': return <ScientificPad />
      case 'Programmer': return <ProgrammerPad />
      case 'Graphing': return <GraphingPad />
      case 'Date': return <DatePad />
      case 'Converter': return <ConverterPad />
      default: return <StandardPad />
    }
  }

  const getTitle = () => {
    if (mode === 'Converter') return `${converterType} Converter`
    return mode
  }

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden glass rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenSidebar}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">{getTitle()}</h1>
        </div>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 rounded-md hover:bg-white/10 transition-colors hidden md:block"
        >
          <History className="w-5 h-5" />
        </button>
      </div>

      {/* Display Area */}
      {mode !== 'Date' && mode !== 'Graphing' && mode !== 'Converter' && mode !== 'Programmer' && (
        <div className="flex-none px-6 py-4 flex flex-col items-end justify-end min-h-[120px] z-10">
          <div className="text-muted-foreground text-sm tracking-wider h-6 mb-1 overflow-hidden">
            {equation}
          </div>
          <div className={cn(
            "font-semibold tracking-tight transition-all truncate w-full text-right",
            display.length > 12 ? "text-4xl" : "text-6xl"
          )}>
            {display}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        <div className="flex-1 h-full">
          {renderPad()}
        </div>

        {/* History Panel (Desktop) */}
        {showHistory && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            className="hidden md:flex flex-col border-l border-white/10 h-full bg-black/10"
          >
            <div className="p-4 font-semibold text-sm">History</div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {history.length === 0 ? (
                <div className="text-sm text-muted-foreground">There's no history yet</div>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="text-right">
                    <div className="text-sm text-muted-foreground">{item.split('=')[0]} =</div>
                    <div className="font-semibold text-lg">{item.split('=')[1]}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
