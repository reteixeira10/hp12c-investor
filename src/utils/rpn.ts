export const rpn = (stack: string[], operator: string, input: string): [string[], string] => {
  let newStack = [...stack];
  if (input !== "") {
    newStack.push(input);
  }

  if (newStack.length < 2 && !["1/x", "√x", "x⇔y", "R↓"].includes(operator)) {
    return [newStack, input];
  }

  let result = 0;
  let a = parseFloat(newStack[newStack.length - 1]);
  let b = parseFloat(newStack[newStack.length - 2]);

  switch (operator) {
    case "+":
      result = b + a;
      newStack.pop();
      newStack.pop();
      newStack.push(result.toString());
      break;
    case "-":
      result = b - a;
      newStack.pop();
      newStack.pop();
      newStack.push(result.toString());
      break;
    case "×":
      result = b * a;
      newStack.pop();
      newStack.pop();
      newStack.push(result.toString());
      break;
    case "÷":
      result = b / a;
      newStack.pop();
      newStack.pop();
      newStack.push(result.toString());
      break;
    case "y^x":
      result = Math.pow(b, a);
      newStack.pop();
      newStack.pop();
      newStack.push(result.toString());
      break;
    case "1/x":
      result = 1 / a;
      newStack.pop();
      newStack.push(result.toString());
      break;
    case "√x":
        result = Math.sqrt(a);
        newStack.pop();
        newStack.push(result.toString());
        break;
    case "x⇔y":
      if (newStack.length >= 2) {
        const last = newStack[newStack.length - 1];
        const secondLast = newStack[newStack.length - 2];
        newStack[newStack.length - 1] = secondLast;
        newStack[newStack.length - 2] = last;
      }
      return [newStack, newStack[newStack.length - 1]]
    case "R↓":
      if (newStack.length > 0) {
        const last = newStack.pop();
        if (last) {
            newStack.unshift(last);
        }
      }
      return [newStack, newStack[newStack.length - 1]]
    default:
      break;
  }
  
  if (operator !== "x⇔y" && operator !== "R↓") {
    return [newStack, result.toString()];
  } else {
    // For stack manipulation operators, the logic is different
    // and handled inside their cases.
    return [newStack, input]; // Fallback, should be handled by specific cases
  }  
};