import React, { useState } from "react";
import { TVMRegisters } from "../types";
import { computeFV, computePV, computePMT, computeN, computeIYR } from "../utils/tvm";
import { rpnCalculate } from "../utils/rpn";
import { Display } from "./Display";
import { Keypad } from "./Keypad";
import { SidePanel } from "./SidePanel";

const buttonLabels = [
  ["N", "i", "PV", "PMT", "FV"],
  ["→i%yr", "→i%mo"],
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "Enter", "CHS", "+"],
  ["C"],
];

export const Calculator: React.FC = () => {
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
    // Interest conversion keys
    else if (label === "→i%mo") {
      if (input !== "") {
        const iyr = parseFloat(input);
        const imo = (Math.pow(1 + iyr / 100, 1 / 12) - 1) * 100;
        setInput(imo.toFixed(6));
      }
    }
    else if (label === "→i%yr") {
      if (input !== "") {
        const imo = parseFloat(input);
        const iyr = (Math.pow(1 + imo / 100, 12) - 1) * 100;
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