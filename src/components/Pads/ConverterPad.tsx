import { useEffect, useState, useRef } from 'react'
import { useCalculatorStore } from '../../store/calculatorStore'
import { CalcButton } from '../ui/Button'
import { Delete, ChevronDown, Search, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CONVERTER_DATA } from '../../lib/converterData'
import { updateCurrencyRates } from '../../lib/currencyService'

const UnitSelect = ({ value, onChange, units }: { value: string, onChange: (val: string) => void, units: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredUnits = units.filter(u => u.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      const currentIndex = units.indexOf(value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, units, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => {
        const next = prev < filteredUnits.length - 1 ? prev + 1 : prev;
        scrollToItem(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => {
        const next = prev > 0 ? prev - 1 : prev;
        scrollToItem(next);
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredUnits[highlightedIndex]) {
        onChange(filteredUnits[highlightedIndex]);
        setIsOpen(false);
      }
    }
  };

  const scrollToItem = (index: number) => {
    if (!listRef.current) return;
    const item = listRef.current.children[index] as HTMLElement;
    if (item) {
      item.scrollIntoView({ block: 'nearest' });
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-transparent border-none text-muted-foreground outline-none text-sm mb-1 hover:text-foreground transition-colors py-1 group"
      >
        <span className="truncate pr-4">{value}</span>
        <ChevronDown className={`w-4 h-4 opacity-50 group-hover:opacity-100 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 w-full z-50 mt-1 rounded-xl glass-panel shadow-2xl overflow-hidden origin-top"
          >
            <div className="p-2 border-b border-white/10 flex items-center gap-2 bg-black/5 dark:bg-black/20">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="Search units..."
                className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div ref={listRef} className="max-h-60 overflow-y-auto overflow-x-hidden p-1 custom-scrollbar">
              {filteredUnits.length > 0 ? (
                filteredUnits.map((u, i) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => {
                      onChange(u);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    onMouseEnter={() => setHighlightedIndex(i)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center justify-between transition-all duration-150 ${
                      highlightedIndex === i
                        ? 'bg-primary/20 text-primary font-medium'
                        : value === u 
                          ? 'text-primary'
                          : 'hover:bg-white/5 text-foreground'
                    }`}
                  >
                    <span className="truncate">{u}</span>
                    {value === u && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No units found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ConverterPad = () => {
  const { converterType } = useCalculatorStore()
  
  const typeData = CONVERTER_DATA[converterType] || CONVERTER_DATA.Length
  const units = Object.keys(typeData.units)

  const [fromUnit, setFromUnit] = useState(typeData.defaultFrom)
  const [toUnit, setToUnit] = useState(typeData.defaultTo)
  const [value, setValue] = useState('0')
  const [currentCategory, setCurrentCategory] = useState(converterType)
  const [, setRatesUpdated] = useState(0)

  if (currentCategory !== converterType) {
    setCurrentCategory(converterType)
    setFromUnit(typeData.defaultFrom)
    setToUnit(typeData.defaultTo)
    setValue('0')
  }

  useEffect(() => {
    if (converterType === 'Currency') {
      updateCurrencyRates().then(updated => {
        if (updated) setRatesUpdated(Date.now())
      })
    }
  }, [converterType])

  const handleInput = (digit: string) => {
    setValue((prev: string) => {
      if (prev === '0' || prev === '') return digit
      if (prev === '-0' || prev === '-') return '-' + digit
      return prev + digit
    })
  }

  const handleBackspace = () => {
    setValue((prev: string) => prev.length > 1 ? prev.slice(0, -1) : '0')
  }

  const handleClear = () => {
    setValue('0')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement || 
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (/[0-9]/.test(e.key)) handleInput(e.key)
      if (e.key === '.') {
        setValue((prev: string) => prev.includes('.') ? prev : prev + '.')
      }
      if (e.key === 'Backspace') handleBackspace()
      if (e.key === 'Escape' || e.key === 'Delete') handleClear()
      if (e.key === '-') {
        setValue((prev: string) => prev.startsWith('-') ? prev.slice(1) : '-' + prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [value]) // dependency on value is safe enough here for basic input

  const numericValue = parseFloat(value) || 0
  
  const fromConfig = typeData.units[fromUnit]
  const toConfig = typeData.units[toUnit]

  let baseValue = 0
  if (typeof fromConfig === 'number') {
    baseValue = numericValue * fromConfig
  } else if (fromConfig) {
    baseValue = fromConfig.toBase(numericValue)
  }

  let resultValue = 0
  if (typeof toConfig === 'number') {
    resultValue = baseValue / toConfig
  } else if (toConfig) {
    resultValue = toConfig.fromBase(baseValue)
  }

  const formattedResult = isNaN(resultValue) || !isFinite(resultValue) 
    ? 'Error' 
    : Number(resultValue.toPrecision(10)).toString()

  return (
    <div className="flex flex-col w-full h-full p-2">
      <div className="flex flex-col gap-4 mb-4 p-4">
        <div>
          <UnitSelect value={fromUnit} onChange={setFromUnit} units={units} />
          <input 
            type="text"
            value={value}
            onChange={(e) => {
              let val = e.target.value;
              if (!/^[0-9.\-eE]*$/.test(val)) return;
              val = val.replace(/^(-?)0+(?=\d)/, '$1');
              setValue(val);
            }}
            onFocus={() => {
              if (value === '0') setValue('');
            }}
            onBlur={() => {
              if (value === '' || value === '-' || value === '.') setValue('0');
            }}
            className="text-4xl font-semibold bg-transparent border-none outline-none w-full p-0"
          />
        </div>
        
        <div className="h-px w-full bg-white/10" />

        <div>
          <UnitSelect value={toUnit} onChange={setToUnit} units={units} />
          <div className="text-4xl font-semibold">{formattedResult}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 flex-1">
        <CalcButton size="lg" onClick={() => handleInput('7')}>7</CalcButton>
        <CalcButton size="lg" onClick={() => handleInput('8')}>8</CalcButton>
        <CalcButton size="lg" onClick={() => handleInput('9')}>9</CalcButton>
        
        <CalcButton size="lg" onClick={() => handleInput('4')}>4</CalcButton>
        <CalcButton size="lg" onClick={() => handleInput('5')}>5</CalcButton>
        <CalcButton size="lg" onClick={() => handleInput('6')}>6</CalcButton>
        
        <CalcButton size="lg" onClick={() => handleInput('1')}>1</CalcButton>
        <CalcButton size="lg" onClick={() => handleInput('2')}>2</CalcButton>
        <CalcButton size="lg" onClick={() => handleInput('3')}>3</CalcButton>
        
        <CalcButton size="lg" variant="action" onClick={handleClear}>CE</CalcButton>
        <CalcButton size="lg" onClick={() => handleInput('0')}>0</CalcButton>
        <CalcButton size="lg" variant="action" onClick={handleBackspace}><Delete className="w-6 h-6" /></CalcButton>
      </div>
    </div>
  )
}
