import { TVMRegisters } from "../types";
type SidePanelProps = { stack: number[]; tvm: TVMRegisters };
export const SidePanel = ({ stack, tvm }: SidePanelProps) => (
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
);