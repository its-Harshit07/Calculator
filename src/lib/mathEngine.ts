import * as math from 'mathjs';

export const evaluateExpression = (equation: string): string => {
  try {
    if (!equation.trim()) return '0';
    
    // Count brackets
    const openBrackets = (equation.match(/\(/g) || []).length;
    const closeBrackets = (equation.match(/\)/g) || []).length;
    
    // Prevent unmatched closing brackets crashing the logic early
    if (closeBrackets > openBrackets) {
      throw new Error('Mismatched brackets');
    }

    let closedEquation = equation;
    // Balance brackets automatically
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      closedEquation += ')';
    }

    // Replace display operators with mathjs operators safely
    const sanitized = closedEquation
      .replace(/×/g, '*')
      .replace(/÷/g, '/');

    // Safe evaluate
    const result = math.evaluate(sanitized);
    
    if (result === undefined || result === null || typeof result === 'function') {
      throw new Error('Invalid evaluation');
    }

    // Format to avoid floating point issues (e.g. 0.1 + 0.2 = 0.3)
    let formatted = math.format(result, { precision: 14, lowerExp: -12, upperExp: 12 });
    
    // Remove trailing zeros after decimal if any
    if (formatted.includes('.')) {
      formatted = formatted.replace(/\.?0+$/, '');
      if (formatted.endsWith('.')) formatted = formatted.slice(0, -1);
    }
    
    return formatted;
  } catch {
    throw new Error('Invalid expression');
  }
};
