export const formatOperand = (operand: string) => {
  if (operand === '-' || operand === '0') return '0';
  return operand;
};

export const sanitizeEquation = (eq: string) => {
  // Prevent multiple consecutive operators
  return eq.replace(/([+\-×÷])\s+([+\-×÷])/g, '$2');
};
