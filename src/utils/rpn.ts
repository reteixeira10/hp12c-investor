export function rpnCalculate(stack: number[], op: string): number[] {
  // ...existing logic...
  if (stack.length < 2) return stack;
  const b = stack.pop()!;
  const a = stack.pop()!;
  let result = 0;
  switch (op) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/": result = a / b; break;
    default: return stack;
  }
  stack.push(result);
  return stack;
}