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
  lastOperator: string | null
  lastOperand: string | null

  
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

export const useCalculatorStore = create<CalculatorState>((set) => ({
  mode: 'Standard',
  converterType: 'Length',
  isDarkMode: true,
  display: '0',
  equation: '',
  history: [],
  memory: 0,
  programmerMode: 'QWORD',
  base: 'DEC',
  lastOperator: null,
  lastOperand: null,

  setMode: (mode) => set({ mode, display: '0', equation: '' }),
  setConverterType: (converterType) => set({ converterType }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  inputDigit: (digit) => set((state) => {
    if (state.display === '0' || state.display === 'Error') {
      return { display: digit, ...(state.equation.trim().endsWith('=') ? { equation: '' } : {}) }
    }
    if (state.equation.trim().endsWith('=')) {
      return { display: digit, equation: '' }
    }
    return { display: state.display + digit }
  }),

  inputDecimal: () => set((state) => {
    if (state.display === 'Error') return { display: '0.', equation: '' }
    if (state.equation.trim().endsWith('=')) {
      return { display: '0.', equation: '' }
    }
    if (!state.display.includes('.')) {
      return { display: state.display + '.' }
    }
    return state
  }),

  inputOperator: (op) => set((state) => {
    if (state.display === 'Error') return state
    
    let baseEquation = state.equation;
    let baseDisplay = state.display;
    
    if (baseEquation.trim().endsWith('=')) {
      baseEquation = '';
    }
    
    let appendStr = baseDisplay + ' ' + op + ' '
    
    if (baseDisplay === '0') {
      if (op === '(') {
        appendStr = op + ' '
      } else if (baseEquation !== '' && baseEquation.trim().endsWith(')')) {
        appendStr = op + ' '
      }
    }

    if (baseEquation === '' && baseDisplay === '0' && op === '(') {
       appendStr = '( '
    }

    return {
      equation: baseEquation + appendStr,
      display: '0'
    }
  }),

  calculate: () => set((state) => {
    try {
      if (state.display === 'Error') return state
      
      let fullEquation = state.equation
      let newLastOperator = state.lastOperator
      let newLastOperand = state.lastOperand
      
      if (state.equation.trim().endsWith('=')) {
        if (state.lastOperator && state.lastOperand) {
           fullEquation = state.display + ' ' + state.lastOperator + ' ' + state.lastOperand;
        } else {
           return state;
        }
      } else {
        if (!(state.display === '0' && state.equation.trim().endsWith(')'))) {
          fullEquation += state.display
        }
        
        const opRegex = /(?:^|\s)([+\-×÷])\s+((?:(?!\s[+\-×÷]\s).)*)$/;
        const match = fullEquation.match(opRegex);
        if (match) {
          newLastOperator = match[1];
          let operand = match[2].trim();
          if (!operand.includes('(')) {
             operand = operand.replace(/\)+$/, '');
          }
          newLastOperand = operand;
        }
      }
      
      if (!fullEquation.trim()) return state
      
      const openBrackets = (fullEquation.match(/\(/g) || []).length
      const closeBrackets = (fullEquation.match(/\)/g) || []).length
      let closedEquation = fullEquation;
      for (let i = 0; i < openBrackets - closeBrackets; i++) {
        closedEquation += ' )'
      }
      
      const result = math.evaluate(closedEquation.replace(/×/g, '*').replace(/÷/g, '/'))
      let formattedResult = math.format(result, { precision: 14 })
      
      return {
        display: String(formattedResult),
        equation: closedEquation + ' =',
        lastOperator: newLastOperator,
        lastOperand: newLastOperand,
        history: [...state.history, `${closedEquation} = ${formattedResult}`]
      }
    } catch (error) {
      return { display: 'Error', equation: '' }
    }
  }),

  clear: () => set({ display: '0', equation: '', lastOperator: null, lastOperand: null }),

  backspace: () => set((state) => {
    if (state.display === 'Error') return { display: '0', equation: '' }
    if (state.equation.trim().endsWith('=')) {
      return { equation: '' }
    }
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

  bitwiseOp: () => set((state) => {
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
