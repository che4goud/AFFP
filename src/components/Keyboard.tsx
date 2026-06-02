"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface KeyboardProps {
  onKeyPress: (char: string) => void;
}

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const SPECIAL_KEYS = ["ENTER", "SPACE"];

export default function Keyboard({ onKeyPress }: KeyboardProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handlePress = (key: string) => {
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 120);

    if (key === "⌫") {
      onKeyPress("BACKSPACE");
    } else if (key === "SPACE") {
      onKeyPress(" ");
    } else if (key === "ENTER") {
      onKeyPress("ENTER");
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div
      className="relative rounded-lg px-3 py-3 shadow-md"
      style={{
        backgroundColor: "#d8d4cb",
        border: "2px solid #c4bfb4",
        boxShadow: "0 4px 12px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Keyboard ridge/lip at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 rounded-t-lg"
        style={{ backgroundColor: "#cac5bc" }}
      />

      <div className="flex flex-col gap-1 mt-1">
        {ROWS.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex gap-1 justify-center"
            style={{ paddingLeft: rowIdx === 1 ? "6px" : rowIdx === 2 ? "12px" : "0" }}
          >
            {row.map((key) => (
              <Key
                key={key}
                label={key}
                pressed={pressedKey === key}
                onPress={() => handlePress(key)}
                wide={key === "⌫"}
              />
            ))}
          </div>
        ))}

        {/* Bottom row */}
        <div className="flex gap-1 justify-center mt-0.5">
          <Key
            label="ENTER"
            pressed={pressedKey === "ENTER"}
            onPress={() => handlePress("ENTER")}
            wide
            accent
          />
          <Key
            label="SPACE"
            pressed={pressedKey === "SPACE"}
            onPress={() => handlePress("SPACE")}
            extraWide
          />
        </div>
      </div>
    </div>
  );
}

interface KeyProps {
  label: string;
  pressed: boolean;
  onPress: () => void;
  wide?: boolean;
  extraWide?: boolean;
  accent?: boolean;
}

function Key({ label, pressed, onPress, wide, extraWide, accent }: KeyProps) {
  const width = extraWide ? "w-20" : wide ? "w-10" : "w-6";

  return (
    <motion.button
      onClick={onPress}
      animate={pressed ? { y: 2, scale: 0.96 } : { y: 0, scale: 1 }}
      transition={{ duration: 0.08 }}
      whileHover={{ y: -1 }}
      className={`
        ${width} h-5 rounded-sm flex items-center justify-center
        text-[8px] font-mono font-bold select-none cursor-pointer
        transition-colors duration-75
        ${accent ? "text-white" : "text-[#2a2620]"}
      `}
      style={{
        backgroundColor: accent
          ? "var(--color-military-olive)"
          : pressed
          ? "#ccc8bf"
          : "var(--color-key-bg)",
        border: `1px solid ${pressed ? "#b0ac9f" : "var(--color-key-border)"}`,
        boxShadow: pressed
          ? "0 0px 0px rgba(0,0,0,0.2)"
          : "0 2px 0px rgba(0,0,0,0.2), inset 0 1px 0px rgba(255,255,255,0.6)",
      }}
    >
      {label}
    </motion.button>
  );
}
