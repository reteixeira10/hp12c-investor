type DisplayProps = { value: string };
export const Display = ({ value }: DisplayProps) => (
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
    {value}
  </div>
);