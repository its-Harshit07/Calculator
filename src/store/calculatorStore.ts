import { create } from 'zustand'
import * as math from 'mathjs'

export type Mode = 'Standard' | 'Scientific' | 'Graphing' | 'Programmer' | 'Date' | 'Converter'
export type ConverterType = 'Currency' | 'Volume' | 'Length' | 'Weight' | 'Temperature' | 'Energy' | 'Area' | 'Speed' | 'Time' | 'Power' | 'Data'

interface CalculatorState {
  mode: Mode
  converterType: ConverterType
  isDarkMode: boolean
  display: string
  equation: string
  history: string[]
  memory: number
  programmerMode: 'QWORD' | 'DWORD' | 'WORD' | 'BYTE'
  base: 'HEX' | 'DEC' | 'OCT' | 'BIN'
  
  setMode: (mode: Mode) => void
  setConverterType: (type: ConverterType) => void
  toggleDarkMode: () => void
  
  // Standard actions
  inputDigit: (digit: string) => void
  inputDecimal: () => void
  inputOperator: (op: string) => void
  calculate: () => void
  clear: () => void
  backspace: () => void
  toggleSign: () => void
  calculatePercentage: () => void
  
  // Memory actions
  memoryClear: () => void
  memoryRecall: () => void
  memoryAdd: () => void
  memorySubtract: () => void
  memoryStore: () => void
  
  // Programmer actions
  setProgrammerMode: (mode: 'QWORD' | 'DWORD' | 'WORD' | 'BYTE') => void
  setBase: (base: 'HEX' | 'DEC' | 'OCT' | 'BIN') => void
  bitwiseOp: (op: string) => void
  
  // Scientific actions
  scientificFunc: (func: string) => void
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  mode: 'Standard',
  converterType: 'Length',
  isDarkMode: true,
  display: '0',
  equation: '',
  history: [],
  memory: 0,
  programmerMode: 'QWORD',
  base: 'DEC',

  setMode: (mode) => set({ mode, display: '0', equation: '' }),
  setConverterType: (converterType) => set({ converterType }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  inputDigit: (digit) => set((state) => {
    if (state.display === '0' || state.display === 'Error') {
      return { display: digit }
    }
    return { display: state.display + digit }
  }),

  inputDecimal: () => set((state) => {
    if (state.display === 'Error') return { display: '0.' }
    if (!state.display.includes('.')) {
      return { display: state.display + '.' }
    }
    return state
  }),

  inputOperator: (op) => set((state) => {
    if (state.display === 'Error') return state
    return {
      equation: state.equation + state.display + ' ' + op + ' ',
      display: '0'
    }
  }),

  calculate: () => set((state) => {
    try {
      if (state.display === 'Error') return state
      const fullEquation = state.equation + state.display
      if (!fullEquation.trim()) return state
      
      const result = math.evaluate(fullEquation.replace(/×/g, '*').replace(/÷/g, '/'))
      let formattedResult = math.format(result, { precision: 14 })
      
      return {
        display: String(formattedResult),
        equation: '',
        history: [...state.history, `${fullEquation} = ${formattedResult}`]
      }
    } catch (error) {
      return { display: 'Error', equation: '' }
    }
  }),

  clear: () => set({ display: '0', equation: '' }),

  backspace: () => set((state) => {
    if (state.display === 'Error') return { display: '0' }
    if (state.display.length === 1) return { display: '0' }
    return { display: state.display.slice(0, -1) }
  }),

  toggleSign: () => set((state) => {
    if (state.display === '0' || state.display === 'Error') return state
    if (state.display.startsWith('-')) {
      return { display: state.display.slice(1) }
    }
    return { display: '-' + state.display }
  }),

  calculatePercentage: () => set((state) => {
    if (state.display === 'Error') return state
    try {
      const val = parseFloat(state.display)
      return { display: String(val / 100) }
    } catch {
      return { display: 'Error' }
    }
  }),

  memoryClear: () => set({ memory: 0 }),
  memoryRecall: () => set((state) => ({ display: String(state.memory) })),
  memoryAdd: () => set((state) => ({ memory: state.memory + parseFloat(state.display || '0') })),
  memorySubtract: () => set((state) => ({ memory: state.memory - parseFloat(state.display || '0') })),
  memoryStore: () => set((state) => ({ memory: parseFloat(state.display || '0') })),

  setProgrammerMode: (programmerMode) => set({ programmerMode }),
  setBase: (base) => set({ base, display: '0' }),

  bitwiseOp: (op) => set((state) => {
    // Basic implementation for bitwise, could be expanded
    return state;
  }),

  scientificFunc: (func) => set((state) => {
    try {
      const val = parseFloat(state.display)
      let res = 0
      switch(func) {
        case 'sin': res = Math.sin(val); break;
        case 'cos': res = Math.cos(val); break;
        case 'tan': res = Math.tan(val); break;
        case 'log': res = Math.log10(val); break;
        case 'ln': res = Math.log(val); break;
        case 'sqrt': res = Math.sqrt(val); break;
        case 'sqr': res = Math.pow(val, 2); break;
        case '1/x': res = 1 / val; break;
        case 'fact': res = math.factorial(val) as number; break;
        case 'abs': res = Math.abs(val); break;
      }
      return { display: String(res) }
    } catch {
      return { display: 'Error' }
    }
  })
}))
