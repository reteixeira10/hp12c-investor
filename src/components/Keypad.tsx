import React from "react";

interface KeypadProps {
  buttonLabels: string[][];
  onButtonClick: (label: string) => void;
  pressedKey: string | null;
}

const Keypad: React.FC<KeypadProps> = ({ buttonLabels, onButtonClick, pressedKey }) => {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
        {buttonLabels.flat().map((label, index) => (
          <button
            key={index}
            onClick={() => onButtonClick(label)}
            style={{
              background: label === pressedKey ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "8px",
              color: "white",
              padding: "16px 0",
              textAlign: "center",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "bold",
              transition: "background 0.2s ease-in-out",
              boxShadow: "0 2px 8px #0004",
              transform: label === pressedKey ? "scale(0.95)" : "scale(1)"
            }}
          >
            {label}
          </button>
        ))}
      </div>
    );
  };

export default Keypad;