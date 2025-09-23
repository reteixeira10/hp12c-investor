import React, { useState } from "react";
import Display from "./Display";
import Keypad from "./Keypad";
import SidePanel from "./SidePanel";
import { TVM } from "../types";
import { rpn } from "../utils/rpn";
import { computeFV, computeIYR, computeN, computePMT, computePV } from "../utils/tvm";
import { toMonthlyRate, toYearlyRate } from "../utils/misc";

const buttonLabels = [
  ["N", "i", "PV", "PMT", "FV"],
  ["x⇔y", "CLx", "R↓", "%", "→i%mo"],
  ["y^x", "1/x", "√x", "CHS", "→i%yr"],
  ["EEX", "ENTER", "7", "8", "9"],
  ["STO", "RCL", "4", "5", "6"],
  ["+", "-", "1", "2", "3"],
  ["÷", "×", "0", ".", "RESET"],
];

const Calculator: React.FC = () => {
  const [stack, setStack] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [tvm, setTVM] = useState<TVM>({ N: 0, IYR: 0, PV: 0, PMT: 0, FV: 0 });
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleButton = (label: string) => {
    if (label >= "0" && label <= "9") {
      setInput(input + label);
    } else if (label === ".") {
      if (!input.includes(".")) {
        setInput(input + ".");
      }
    } else if (label === "ENTER") {
      if (input !== "") {
        setStack([...stack, input]);
        setInput("");
      }
    } else if (label === "CLx") {
      setInput("");
    } else if (label === "CHS") {
      if (input !== "") {
        setInput((prev) => (prev.startsWith("-") ? prev.slice(1) : `-${prev}`));
      }
    } else if (label === "RESET") {
      setStack([]);
      setInput("");
      setTVM({ N: 0, IYR: 0, PV: 0, PMT: 0, FV: 0 });
    } else if (["+", "-", "×", "÷", "y^x", "x⇔y", "R↓", "1/x", "√x"].includes(label)) {
      // Unary operators require an input value
      if (["1/x", "√x"].includes(label) && input === "") {
        return; // Do nothing if there's no input for unary ops
      }
      // Binary and stack operators require at least one item on the stack
      if (["+", "-", "×", "÷", "y^x", "x⇔y", "R↓"].includes(label) && stack.length < 1) {
        return; // Do nothing if stack is empty for these ops
      }

      const [newStack, result] = rpn(stack, label, input);
      setStack(newStack);
      // After an RPN operation, the result is in the input, and we should clear the stack entry just used.
      if (!["x⇔y", "R↓"].includes(label)) { // These operations manage the stack differently
          setInput(result);
          if (["+", "-", "×", "÷", "y^x"].includes(label)) {
            // The RPN function I wrote already returns the new stack
            // and the result. The component just needs to set them.
          }
      } else {
        setInput(result)
      }
    }
    // Change of interest rate
    else if (label === "→i%mo") {
      if (input !== "") {
        const iyr = parseFloat(input);
        const imo = toMonthlyRate(iyr);
        setInput(imo.toFixed(6));
      }
    }
    else if (label === "→i%yr") {
      if (input !== "") {
        const imo = parseFloat(input);
        const iyr = toYearlyRate(imo);
        setInput(iyr.toFixed(6));
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
        setTVM((prev) => ({ ...prev, [label === "i" ? "IYR" : label]: newValue }));
        setInput(Number(newValue).toFixed(2));
      }
    }
  };

  return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #434343 0%, black 100%)"
      }}>
        <div style={{ display: "flex", gap: "32px" }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            boxShadow: "0 4px 24px #0008",
            padding: "32px",
            width: "340px"
          }}>
            <Display value={input !== "" ? input : (stack.length > 0 ? Number(stack[stack.length - 1]).toFixed(2) : "0.00")} />
            <Keypad buttonLabels={buttonLabels} onButtonClick={(label) => {
              setPressedKey(label);
              handleButton(label);
              setTimeout(() => setPressedKey(null), 120);
            }} pressedKey={pressedKey} />
          </div>
          <SidePanel stack={stack} tvm={tvm} />
        </div>
      </div>
    );
  };

export default Calculator;