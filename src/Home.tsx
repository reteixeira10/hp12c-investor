import React, { useState } from "react";

const buttonLabels = [
  ["N", "i", "PV", "PMT", "FV"],
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "Enter", "CHS", "+"],
  ["C"],
];

type TVMRegisters = {
  N: number;
  IYR: number;
  PV: number;
  PMT: number;
  FV: number;
};

function rpnCalculate(stack: number[], op: string): number[] {
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

// TVM calculation helpers
function computeFV({ N, IYR, PV, PMT }: TVMRegisters): number {
  const i = IYR / 100;
  let fv: number;
  if (i === 0) {
    // no interest case
    fv = PV + PMT * N;
  } else {
    fv = PV * Math.pow(1 + i, N) + PMT * ((Math.pow(1 + i, N) - 1) / i);
  }

  // HP 12C cash-flow sign convention:
  // - If there are no periodic payments, show FV with opposite sign of PV.
  // - If PV and PMT have the same sign (both outflows or both inflows),
  //   show FV with opposite sign (so an investment PV<0 with PMT<=0 yields FV>0).
  if (PMT === 0 || (PV < 0 && PMT < 0) || (PV > 0 && PMT > 0)) {
    fv = -fv;
  }

  return fv;
}

function computePV({ N, IYR, FV, PMT }: TVMRegisters): number {
  const i = IYR / 100;
  if (i === 0) {
    // PV + PMT*N + FV = 0 => PV = - (PMT*N + FV)
    return - (PMT * N + FV);
  } else {
    const A = Math.pow(1 + i, N);
    // PV*A + PMT*(A - 1)/i + FV = 0 => PV = - (PMT*(A - 1)/i + FV) / A
    return - (PMT * ((A - 1) / i) + FV) / A;
  }
}

function computePMT({ N, IYR, PV, FV }: TVMRegisters): number {
  const i = IYR / 100;
  if (N === 0) return 0;
  if (i === 0) {
    // PV + PMT*N + FV = 0 => PMT = - (PV + FV) / N
    return - (PV + FV) / N;
  } else {
    const A = Math.pow(1 + i, N);
    // PV*A + PMT*(A - 1)/i + FV = 0 => PMT = - (PV*A + FV) * i / (A - 1)
    return - (PV * A + FV) * i / (A - 1);
  }
}

function computeN({ IYR, PV, PMT, FV }: TVMRegisters): number {
  const i = IYR / 100;
  if (i === 0) {
    // PV + PMT*N + FV = 0 => N = - (PV + FV) / PMT
    if (PMT === 0) return 0;
    return - (PV + FV) / PMT;
  }
  // Solve for N in: PV*(1+i)^N + PMT*((1+i)^N - 1)/i + FV = 0
  // Rearranged: PV*(1+i)^N + PMT*((1+i)^N - 1)/i = -FV
  // Let X = (1+i)^N
  // PV*X + PMT*(X - 1)/i = -FV
  // PV*X + PMT*X/i - PMT/i = -FV
  // (PV + PMT/i)*X = -FV + PMT/i
  // X = (-FV + PMT/i) / (PV + PMT/i)
  const denom = PV + PMT / i;
  if (denom === 0) return 0;
  const X = (-FV + PMT / i) / denom;
  if (X <= 0) return 0;
  return Math.log(X) / Math.log(1 + i);
}

// Newton-Raphson for i
function computeIYR({ N, PV, PMT, FV }: TVMRegisters): number {
  let guess = 0.05; // 5% initial guess
  let i = guess;
  for (let iter = 0; iter < 100; iter++) {
    const f = PV * Math.pow(1 + i, N) + PMT * ((Math.pow(1 + i, N) - 1) / i) + FV;
    // Derivative
    const df = PV * N * Math.pow(1 + i, N - 1)
      + PMT * (
        ((Math.pow(1 + i, N) - 1) / (i * i))
        + (N * Math.pow(1 + i, N - 1) / i)
      );
    const newI = i - f / df;
    if (Math.abs(newI - i) < 1e-8) break;
    i = newI;
  }
  return i * 100;
}

const Home: React.FC = () => {
  const [stack, setStack] = useState<number[]>([]);
  const [input, setInput] = useState<string>("");
  const [tvm, setTVM] = useState<TVMRegisters>({
    N: 0,
    IYR: 0,
    PV: 0,
    PMT: 0,
    FV: 0,
  });
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleButton = (label: string) => {
    if (/\d|\./.test(label)) {
      setInput((prev) => prev + label);
    } else if (label === "Enter") {
      if (input !== "") {
        setStack((prev) => [...prev, parseFloat(input)]);
        setInput("");
      }
    } else if (["+", "-", "*", "/"].includes(label)) {
      let newStack = [...stack];
      if (input !== "") {
        newStack.push(parseFloat(input));
        setInput("");
      }
      newStack = rpnCalculate(newStack, label);
      setStack(newStack);
    } else if (label === "C") {
      setStack([]);
      setInput("");
      setTVM({ N: 0, IYR: 0, PV: 0, PMT: 0, FV: 0 });
    }
    // CHS key
    else if (label === "CHS") {
      if (input !== "") {
        if (input.startsWith("-")) {
          setInput(input.substring(1));
        } else {
          setInput("-" + input);
        }
      }
    }
    // TVM keys
    else if (["N", "i", "PV", "PMT", "FV"].includes(label)) {
      if (input !== "") {
        // Store input value in TVM register
        const value = parseFloat(input);
        setTVM((prev) => {
          const updated = { ...prev };
          if (label === "N") updated.N = value;
          if (label === "i") updated.IYR = value;
          if (label === "PV") updated.PV = value;
          if (label === "PMT") updated.PMT = value;
          if (label === "FV") updated.FV = value;
          return updated;
        });
        setInput("");
      } else {
        // Calculate value for the pressed TVM key
        let newValue = 0;
        if (label === "FV") newValue = computeFV(tvm);
        if (label === "PV") newValue = computePV(tvm);
        if (label === "PMT") newValue = computePMT(tvm);
        if (label === "N") newValue = computeN(tvm);
        if (label === "i") newValue = computeIYR(tvm);
        setTVM((prev) => ({ ...prev, [label.replace("/", "")]: newValue }));
        setInput(Number(newValue).toFixed(2)); // <-- format here
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#222"
    }}>
      <div style={{ display: "flex", gap: "32px" }}>
        <div style={{
          background: "#c2b280",
          borderRadius: "12px",
          boxShadow: "0 4px 24px #0008",
          padding: "32px",
          width: "340px"
        }}>
          <div style={{
            background: "#222",
            color: "#0f0",
            fontFamily: "monospace",
            fontSize: "2rem",
            textAlign: "right",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "18px"
          }}>
            {(input !== "")
              ? input
              : (stack.length > 0
                  ? Number(stack[stack.length - 1]).toFixed(2)
                  : "0.00")}
          </div>
          <div>
            {buttonLabels.map((row, i) => (
              <div key={i} style={{ display: "flex", marginBottom: "8px" }}>
                {row.map((label) => (
                  <button
                    key={label}
                    onClick={() => {
                      setPressedKey(label);
                      handleButton(label);
                      setTimeout(() => setPressedKey(null), 120);
                    }}
                    style={{
                      flex: 1,
                      margin: "2px",
                      padding: "16px",
                      fontSize: "1.1rem",
                      background: ["N", "i", "PV", "PMT", "FV"].includes(label) ? "#b8860b" : "#444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      boxShadow: pressedKey === label ? "0 0 0 3px #fff" : undefined,
                      opacity: pressedKey === label ? 0.7 : 1,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{
          background: "#333",
          color: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 24px #0008",
          padding: "24px",
          minWidth: "120px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{
            fontWeight: "bold",
            marginBottom: "12px",
            fontSize: "1.1rem",
            letterSpacing: "1px"
          }}>
            RPN Stack
          </div>
          <div style={{
            fontFamily: "monospace",
            fontSize: "1.2rem",
            width: "100%",
            textAlign: "right"
          }}>
            {stack.length === 0 ? (
              <div style={{ color: "#888" }}>Empty</div>
            ) : (
              [...stack].reverse().map((val, idx) => (
                <div key={idx}>{Number(val).toFixed(2)}</div>
              ))
            )}
          </div>
          <div style={{
            fontWeight: "bold",
            marginTop: "24px",
            marginBottom: "8px",
            fontSize: "1.1rem",
            letterSpacing: "1px"
          }}>
            TVM Registers
          </div>
          <div style={{
            fontFamily: "monospace",
            fontSize: "1rem",
            width: "100%",
            textAlign: "right"
          }}>
            <div>N: {Number(tvm.N).toFixed(2)}</div>
            <div>i: {Number(tvm.IYR).toFixed(2)}</div>
            <div>PV: {Number(tvm.PV).toFixed(2)}</div>
            <div>PMT: {Number(tvm.PMT).toFixed(2)}</div>
            <div>FV: {Number(tvm.FV).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;