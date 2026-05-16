import { create } from 'zustand'
import { evaluateExpression } from '../lib/mathEngine'

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
  waitingForOperand: boolean

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
  
  // History
  clearHistory: () => void
  
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
  waitingForOperand: false,

  setMode: (mode) => set({ mode, display: '0', equation: '', waitingForOperand: false }),
  setConverterType: (converterType) => set({ converterType }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  inputDigit: (digit) => set((state) => {
    if (state.display === 'Error') {
      return { display: digit, equation: '', waitingForOperand: false };
    }
    
    if (state.equation.trim().endsWith('=')) {
      return { display: digit, equation: '', waitingForOperand: false, lastOperator: null, lastOperand: null };
    }

    if (state.waitingForOperand) {
      return { display: digit, waitingForOperand: false };
    }

    if (state.display === '0') return { display: digit };
    if (state.display === '-0') return { display: '-' + digit };
    
    return { display: state.display + digit };
  }),

  inputDecimal: () => set((state) => {
    if (state.display === 'Error') {
      return { display: '0.', equation: '', waitingForOperand: false };
    }
    
    if (state.equation.trim().endsWith('=')) {
      return { display: '0.', equation: '', waitingForOperand: false, lastOperator: null, lastOperand: null };
    }

    if (state.waitingForOperand) {
      return { display: '0.', waitingForOperand: false };
    }

    if (!state.display.includes('.')) {
      return { display: state.display + '.' };
    }

    return state;
  }),

  inputOperator: (op) => set((state) => {
    if (state.display === 'Error') return state;
    
    let currentEq = state.equation;
    const isCalculated = currentEq.trim().endsWith('=');
    
    if (isCalculated) {
      currentEq = state.display;
    }
    
    if (op === '(' || op === ')') {
       if (op === '(') {
           if (currentEq === '' || isCalculated) {
               return { equation: '( ', display: '0', waitingForOperand: true };
           }
           if (state.waitingForOperand) {
               return { equation: currentEq + ' ( ', display: '0', waitingForOperand: true };
           }
           return { equation: currentEq + ' ' + state.display + ' × ( ', display: '0', waitingForOperand: true };
       }
       if (op === ')') {
           if (!state.waitingForOperand && state.display !== '0') {
               return { equation: currentEq + ' ' + state.display + ' ) ', waitingForOperand: true };
           }
           return { equation: currentEq + ' ) ', waitingForOperand: true };
       }
    }

    if (state.waitingForOperand) {
        if (currentEq.match(/[+\-×÷]\s*$/)) {
             return { equation: currentEq.replace(/[+\-×÷]\s*$/, `${op} `) };
        }
    }
    
    let newEq = currentEq;
    if (currentEq && !currentEq.endsWith('( ') && !state.waitingForOperand) {
      newEq += ' ' + state.display;
    } else if (!state.waitingForOperand) {
      newEq += state.display;
    }
    
    newEq += ' ' + op + ' ';
    
    return { 
        equation: newEq.trim() + ' ', 
        waitingForOperand: true,
        lastOperator: op
    };
  }),

  calculate: () => set((state) => {
    if (state.display === 'Error') return state;

    try {
      let evalString = '';
      let newLastOp = state.lastOperator;
      let newLastOperand = state.lastOperand;

      if (state.equation.trim().endsWith('=')) {
        if (state.lastOperator && state.lastOperand) {
          evalString = `${state.display} ${state.lastOperator} ${state.lastOperand}`;
        } else {
          return state;
        }
      } else {
         evalString = state.equation + ' ' + (state.waitingForOperand ? '' : state.display);
         evalString = evalString.trim();
         
         const match = evalString.match(/([+\-×÷])\s+([^+\-×÷()]+)\s*\)*$/);
         if (match) {
            newLastOp = match[1];
            newLastOperand = match[2].trim();
         } else if (state.lastOperator) {
            newLastOp = state.lastOperator;
            newLastOperand = state.display;
         }
      }

      if (!evalString.trim()) return state;

      const result = evaluateExpression(evalString);
      const newHistoryItem = `${evalString} = ${result}`;

      return {
        display: result,
        equation: evalString + ' =',
        waitingForOperand: true,
        lastOperator: newLastOp,
        lastOperand: newLastOperand,
        history: [...state.history, newHistoryItem]
      };
    } catch {
      return { display: 'Error', equation: '', waitingForOperand: true };
    }
  }),

  clear: () => set({ display: '0', equation: '', lastOperator: null, lastOperand: null, waitingForOperand: false }),
  
  clearHistory: () => set({ history: [] }),

  backspace: () => set((state) => {
    if (state.display === 'Error') return { display: '0', equation: '', waitingForOperand: false };
    if (state.equation.trim().endsWith('=')) return { equation: '', waitingForOperand: false };
    if (state.waitingForOperand) return state;
    if (state.display.length === 1 || (state.display.length === 2 && state.display.startsWith('-'))) {
       return { display: '0' };
    }
    return { display: state.display.slice(0, -1) };
  }),

  toggleSign: () => set((state) => {
    if (state.display === '0' || state.display === 'Error') return state;
    if (state.equation.trim().endsWith('=')) {
        return { display: state.display.startsWith('-') ? state.display.slice(1) : '-' + state.display, equation: '' };
    }
    if (state.display.startsWith('-')) {
      return { display: state.display.slice(1) };
    }
    return { display: '-' + state.display };
  }),

  calculatePercentage: () => set((state) => {
    if (state.display === 'Error') return state;
    try {
      const val = parseFloat(state.display);
      return { display: String(val / 100), waitingForOperand: true };
    } catch {
      return { display: 'Error', waitingForOperand: true };
    }
  }),

  memoryClear: () => set({ memory: 0 }),
  memoryRecall: () => set((state) => ({ display: String(state.memory), waitingForOperand: true })),
  memoryAdd: () => set((state) => ({ memory: state.memory + parseFloat(state.display || '0') })),
  memorySubtract: () => set((state) => ({ memory: state.memory - parseFloat(state.display || '0') })),
  memoryStore: () => set((state) => ({ memory: parseFloat(state.display || '0') })),

  setProgrammerMode: (programmerMode) => set({ programmerMode }),
  setBase: (base) => set({ base, display: '0' }),

  bitwiseOp: () => set((state) => {
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
        // Need to import mathjs for factorial if we use it here
        case 'fact': res = 1; for(let i=2; i<=val; i++) res*=i; break;
        case 'abs': res = Math.abs(val); break;
      }
      return { display: String(res), waitingForOperand: true }
    } catch {
      return { display: 'Error', waitingForOperand: true }
    }
  })
}))
