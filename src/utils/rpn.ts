export const rpn = (
  stack: string[],
  op: string,
  input: string
): [string[], string] => {
  const newStack = [...stack];

  // Unary operators that only use the input
  if (["√x", "1/x"].includes(op)) {
    const x = parseFloat(input);
    if (isNaN(x)) return [stack, input]; // Return original if input is not a number

    let result: number;
    switch (op) {
      case "√x":
        result = Math.sqrt(x);
        break;
      case "1/x":
        result = 1 / x;
        break;
      default:
        return [stack, input];
    }
    return [newStack, result.toString()];
  }

  // Stack manipulation
  if (op === "x⇔y") {
    if (newStack.length > 0) {
      const y = newStack.pop() || "0";
      newStack.push(input);
      return [newStack, y];
    }
    return [stack, input]; // no-op if stack is empty
  }

  if (op === "R↓") {
    if (newStack.length > 0) {
      const yValue = newStack.pop() || "0";
      newStack.unshift(input);
      return [newStack, yValue];
    }
    return [stack, input];
  }

  // Binary operators
  let x: number, y: number;

  if (input === "") {
    if (newStack.length < 2) {
      return [stack, input]; // Not enough operands
    }
    x = parseFloat(newStack.pop() || "0");
    y = parseFloat(newStack.pop() || "0");
  } else {
    if (newStack.length < 1) {
      return [stack, input]; // Not enough operands
    }
    x = parseFloat(input);
    y = parseFloat(newStack.pop() || "0");
  }
  
  let result: number;
  switch (op) {
    case "+":
      result = y + x;
      break;
    case "-":
      result = y - x;
      break;
    case "×":
      result = y * x;
      break;
    case "÷":
      result = y / x;
      break;
    case "y^x":
      result = Math.pow(y, x);
      break;
    default:
      return [stack, input];
  }

  // For binary ops, the result becomes the new input (X register)
  // and the stack is effectively popped.
  return [newStack, result.toString()];
};