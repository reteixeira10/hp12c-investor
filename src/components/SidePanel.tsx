import React from "react";
import { TVM } from "../types";

interface SidePanelProps {
  stack: string[];
  tvm: TVM;
}

const SidePanel: React.FC<SidePanelProps> = ({ stack, tvm }) => {
    return (
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        boxShadow: "0 4px 24px #0008",
        padding: "32px",
        width: "280px",
        color: "white"
      }}>
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "8px", marginBottom: "12px" }}>Stack</h3>
          <div style={{
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            padding: "12px",
            minHeight: "120px"
          }}>
            {stack.map((item, index) => <div key={index}>{`x${index + 1}: ${Number(item).toFixed(2)}`}</div>)}
          </div>
        </div>
        <div>
          <h3 style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.3)", paddingBottom: "8px", marginBottom: "12px" }}>TVM Registers</h3>
          <div style={{
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            padding: "12px"
          }}>
            <div>N: {tvm.N.toFixed(2)}</div>
            <div>i: {tvm.IYR.toFixed(2)}</div>
            <div>PV: {tvm.PV.toFixed(2)}</div>
            <div>PMT: {tvm.PMT.toFixed(2)}</div>
            <div>FV: {tvm.FV.toFixed(2)}</div>
          </div>
        </div>
      </div>
    );
  };

export default SidePanel;