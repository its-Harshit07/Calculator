import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalculatorStore, type Mode, type ConverterType } from '../store/calculatorStore'
import { 
  Calculator, 
  FlaskConical, 
  Code2, 
  LineChart, 
  CalendarDays, 
  ArrowLeftRight,
  Moon,
  Sun
} from 'lucide-react'
import { cn } from '../lib/utils'

const modes: { name: Mode; icon: React.ElementType }[] = [
  { name: 'Standard', icon: Calculator },
  { name: 'Scientific', icon: FlaskConical },
  { name: 'Graphing', icon: LineChart },
  { name: 'Programmer', icon: Code2 },
  { name: 'Date', icon: CalendarDays },
]

const converters: { name: ConverterType; icon: React.ElementType }[] = [
  { name: 'Currency', icon: ArrowLeftRight },
  { name: 'Volume', icon: ArrowLeftRight },
  { name: 'Length', icon: ArrowLeftRight },
  { name: 'Weight', icon: ArrowLeftRight },
  { name: 'Temperature', icon: ArrowLeftRight },
  { name: 'Energy', icon: ArrowLeftRight },
  { name: 'Area', icon: ArrowLeftRight },
  { name: 'Speed', icon: ArrowLeftRight },
  { name: 'Time', icon: ArrowLeftRight },
  { name: 'Power', icon: ArrowLeftRight },
  { name: 'Data', icon: ArrowLeftRight },
]

export const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) => {
  const { mode, setMode, converterType, setConverterType, isDarkMode, toggleDarkMode } = useCalculatorStore()

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/10 md:bg-transparent rounded-2xl"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-14 left-4 z-50 w-64 max-h-[calc(100%-5rem)] glass-panel flex flex-col rounded-xl border shadow-2xl overflow-hidden"
            >


        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Calculator</p>
            {modes.map((m) => {
              const Icon = m.icon
              const isActive = mode === m.name
              return (
                <button
                  key={m.name}
                  onClick={() => {
                    setMode(m.name)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-white/10 dark:hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {m.name}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="px-3 mt-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Converter</p>
            {converters.map((c) => {
              const Icon = c.icon
              const isActive = mode === 'Converter' && converterType === c.name
              return (
                <button
                  key={c.name}
                  onClick={() => {
                    setMode('Converter')
                    setConverterType(c.name)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-white/10 dark:hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {c.name}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
