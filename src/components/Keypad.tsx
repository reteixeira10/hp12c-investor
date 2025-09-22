type KeypadProps = {
  buttonLabels: string[][];
  onButtonClick: (label: string) => void;
  pressedKey: string | null;
};
export const Keypad = ({ buttonLabels, onButtonClick, pressedKey }: KeypadProps) => (
  <div>
    {buttonLabels.map((row, i) => (
      <div key={i} style={{ display: "flex", marginBottom: "8px" }}>
        {row.map((label) => (
          <button
            key={label}
            onClick={() => onButtonClick(label)}
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
);