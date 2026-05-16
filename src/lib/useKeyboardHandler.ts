import { useEffect } from 'react'
import { useCalculatorStore } from '../store/calculatorStore'

export const useKeyboardHandler = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent holding a key to spam inputs
      if (e.repeat) return;

      // Don't intercept if user is typing in an input field (e.g. converter)
      if (
        document.activeElement instanceof HTMLInputElement || 
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const state = useCalculatorStore.getState();
      const mode = state.mode;

      if (mode === 'Date' || mode === 'Graphing' || mode === 'Converter') return;

      const key = e.key;
      const { 
        inputDigit, inputOperator, calculate, clear, backspace, inputDecimal, calculatePercentage 
      } = state;

      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        inputDigit(key);
      }
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
      if (key === 'Backspace') {
        e.preventDefault();
        backspace();
      }
      if (key === 'Escape' || key === 'Delete') {
        e.preventDefault();
        clear();
      }
      if (key === '.') {
        e.preventDefault();
        inputDecimal();
      }
      if (key === '%') {
        e.preventDefault();
        calculatePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
