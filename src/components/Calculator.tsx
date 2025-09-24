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
  const [isResultDisplayed, setIsResultDisplayed] = useState<boolean>(false);
  const [tvm, setTVM] = useState<TVM>({ N: 0, IYR: 0, PV: 0, PMT: 0, FV: 0 });
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleButton = (label: string) => {
    if (label >= "0" && label <= "9") {
      if (isResultDisplayed) {
        setInput(label);
        setIsResultDisplayed(false);
      } else {
        setInput(input + label);
      }
    } else if (label === ".") {
      if (isResultDisplayed) {
        setInput("0.");
        setIsResultDisplayed(false);
      } else if (!input.includes(".")) {
        setInput(input + ".");
      }
    } else if (label === "ENTER") {
      if (input !== "") {
        setStack([...stack, input]);
        setInput("");
        setIsResultDisplayed(false);
      }
    } else if (label === "CLx") {
      setInput("");
      setIsResultDisplayed(false);
    } else if (label === "CHS") {
      if (input !== "") {
        setInput((prev) => (prev.startsWith("-") ? prev.slice(1) : `-${prev}`));
      }
    } else if (label === "RESET") {
      setStack([]);
      setInput("");
      setTVM({ N: 0, IYR: 0, PV: 0, PMT: 0, FV: 0 });
      setIsResultDisplayed(false);
    } else if (["+", "-", "×", "÷", "y^x", "x⇔y", "R↓", "1/x", "√x"].includes(label)) {
      if (["1/x", "√x"].includes(label) && input === "") {
        return;
      }
      if (["+", "-", "×", "÷", "y^x", "x⇔y", "R↓"].includes(label) && stack.length < 1) {
        return;
      }

      const [newStack, result] = rpn(stack, label, isResultDisplayed ? "" : input);
      setStack(newStack);
      setInput(result);
      setIsResultDisplayed(true);
    }
    // Change of interest rate
    else if (label === "→i%mo") {
      if (input !== "") {
        const iyr = parseFloat(input);
        const imo = toMonthlyRate(iyr);
        setInput(imo.toString());
        setIsResultDisplayed(true);
      }
    }
    else if (label === "→i%yr") {
      if (input !== "") {
        const imo = parseFloat(input);
        const iyr = toYearlyRate(imo);
        setInput(iyr.toString());
        setIsResultDisplayed(true);
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
        setIsResultDisplayed(false);
      } else {
        // Calculate value for the pressed TVM key
        let newValue: number;
        if (label === "FV") {
          newValue = computeFV(tvm);
        } else if (label === "PV") {
          newValue = computePV(tvm);
        } else if (label === "PMT") {
          newValue = computePMT(tvm);
        } else if (label === "N") {
          newValue = Math.ceil(computeN(tvm));
        } else { // "i"
          newValue = computeIYR(tvm);
        }

        setTVM((prev) => ({ ...prev, [label === "i" ? "IYR" : label]: newValue }));
        setInput(newValue.toString());
        setIsResultDisplayed(true);
      }
    }
  };

  const getDisplayValue = () => {
    if (input === "") {
        if (stack.length > 0) {
            const lastInStack = stack[stack.length - 1];
            const num = parseFloat(lastInStack);
            return Number.isInteger(num) ? num.toString() : num.toFixed(2);
        }
        return "0.00";
    }

    if (isResultDisplayed) {
        const num = parseFloat(input);
        if (isNaN(num)) return "Error";
        if (Number.isInteger(num)) return num.toString();
        return num.toFixed(2);
    }

    return input;
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
            <Display value={getDisplayValue()} />
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
