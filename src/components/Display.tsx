import React from "react";

interface DisplayProps {
  value: string;
}

const Display: React.FC<DisplayProps> = ({ value }) => {
  return (
    <div style={{
      background: "rgba(0, 0, 0, 0.4)",
      borderRadius: "8px",
      padding: "16px",
      textAlign: "right",
      marginBottom: "20px",
      boxShadow: "inset 0 2px 4px #0004",
      border: "1px solid rgba(255, 255, 255, 0.2)"
    }}>
      <div style={{
        color: "white",
        fontSize: "36px",
        fontWeight: "bold",
        letterSpacing: "1px",
        fontFamily: '"Orbitron", sans-serif'
      }}>
        {value}
      </div>
    </div>
  );
};

export default Display;