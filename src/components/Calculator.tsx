import { useState, lazy, Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, History, Trash2 } from 'lucide-react'
import { useCalculatorStore } from '../store/calculatorStore'
import { useKeyboardHandler } from '../lib/useKeyboardHandler'
import { cn } from '../lib/utils'

// Intelligent preloading imports
const importStandard = () => import('./Pads/StandardPad').then(m => ({ default: m.StandardPad }))
const importScientific = () => import('./Pads/ScientificPad').then(m => ({ default: m.ScientificPad }))
const importProgrammer = () => import('./Pads/ProgrammerPad').then(m => ({ default: m.ProgrammerPad }))
const importGraphing = () => import('./Pads/GraphingPad').then(m => ({ default: m.GraphingPad }))
const importDate = () => import('./Pads/DatePad').then(m => ({ default: m.DatePad }))
const importConverter = () => import('./Pads/ConverterPad').then(m => ({ default: m.ConverterPad }))

// Lazy load pads for performance & bundle optimization
const StandardPad = lazy(importStandard)
const ScientificPad = lazy(importScientific)
const ProgrammerPad = lazy(importProgrammer)
const GraphingPad = lazy(importGraphing)
const DatePad = lazy(importDate)
const ConverterPad = lazy(importConverter)

export const Calculator = ({ onOpenSidebar }: { onOpenSidebar: () => void }) => {
  const { mode, converterType, display, equation, history, clearHistory } = useCalculatorStore()
  const [showHistory, setShowHistory] = useState(false)

  // Use separated custom hook for keyboard handling
  useKeyboardHandler();

  // Preload remaining calculator modes slightly after initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode !== 'Scientific') importScientific()
      if (mode !== 'Programmer') importProgrammer()
      if (mode !== 'Graphing') importGraphing()
      if (mode !== 'Date') importDate()
      if (mode !== 'Converter') importConverter()
    }, 500)
    return () => clearTimeout(timer)
  }, [mode])

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

  const handleHistoryClick = (item: string) => {
    const [, result] = item.split('=').map(s => s.trim());
    useCalculatorStore.setState({ display: result, equation: '' });
  }

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden glass rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenSidebar}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
            title="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">{getTitle()}</h1>
        </div>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 rounded-md hover:bg-white/10 transition-colors hidden md:block"
          title="History"
        >
          <History className="w-5 h-5" />
        </button>
      </div>

      {/* Display Area */}
      {mode !== 'Date' && mode !== 'Graphing' && mode !== 'Converter' && mode !== 'Programmer' && (
        <div className="flex-none px-6 py-4 flex flex-col items-end justify-end min-h-[120px] z-10">
          <div className="text-muted-foreground text-sm tracking-wider h-6 mb-1 overflow-hidden whitespace-nowrap text-right w-full font-medium">
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
          <Suspense fallback={<div className="h-full w-full" />}>
            {renderPad()}
          </Suspense>
        </div>

        {/* History Panel (Desktop) */}
        {showHistory && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            className="hidden md:flex flex-col border-l border-white/10 h-full bg-black/10"
          >
            <div className="p-4 font-semibold text-sm flex justify-between items-center border-b border-white/10">
              <span>History</span>
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                  title="Clear History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center mt-4">There's no history yet</div>
              ) : (
                history.map((item, i) => {
                  const parts = item.split('=');
                  const eq = parts[0];
                  const res = parts[1];
                  return (
                    <button 
                      key={i} 
                      onClick={() => handleHistoryClick(item)}
                      className="text-right flex flex-col items-end hover:bg-white/5 p-2 rounded-lg transition-colors w-full"
                    >
                      <div className="text-sm text-muted-foreground">{eq}=</div>
                      <div className="font-semibold text-lg">{res}</div>
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
