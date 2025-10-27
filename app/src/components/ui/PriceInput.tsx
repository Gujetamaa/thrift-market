// components/ui/PriceInput.tsx
import { useEffect, useMemo, useState } from "react";

export default function PriceInput({
  value,
  onChange,
  placeholder = "0",
  min = 0,
  max,
  showPesoPrefix = true, // set to false if you don't want the ₱
}: {
  value?: number;
  onChange: (n: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  showPesoPrefix?: boolean;
}) {
  const nf = useMemo(() => new Intl.NumberFormat("en-PH"), []);
  const [text, setText] = useState(format(value ?? 0, nf));

  useEffect(() => {
    setText(format(value ?? 0, nf));
  }, [value, nf]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;

    // Keep only digits to derive the numeric value
    const digits = raw.replace(/[^\d]/g, "");
    const trimmed = digits.replace(/^0+(?=\d)/, ""); // no leading zeros
    const numeric = trimmed === "" ? 0 : Number(trimmed);

    const clamped =
      typeof max === "number" ? Math.max(min, Math.min(numeric, max)) : Math.max(min, numeric);

    // Display with commas only
    setText(format(clamped, nf));
    onChange(clamped);
  }

  function handleBlur() {
    const digits = text.replace(/[^\d]/g, "");
    const numeric = digits === "" ? 0 : Number(digits.replace(/^0+(?=\d)/, ""));
    const clamped =
      typeof max === "number" ? Math.max(min, Math.min(numeric, max)) : Math.max(min, numeric);

    setText(format(clamped, nf));
    onChange(clamped);
  }

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {/* change this to other monetary sign if needed */}
      {showPesoPrefix && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 12,
            opacity: 0.8,
            pointerEvents: "none",
          }}
        >
          ₱ 
        </span>
      )}
      <input
        type="text"
        inputMode="numeric"       // mobile numeric keypad
        autoComplete="off"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label="Price"
        // add left padding so the ₱ doesn't overlap the text
        style={{ paddingLeft: showPesoPrefix ? 28 : undefined }}
        onWheel={(e) => (e.target as HTMLInputElement).blur()}
      />
    </div>
  );
}

function format(n: number, nf: Intl.NumberFormat) {
  return n === 0 ? "0" : nf.format(n); // e.g., 1500 -> "1,500"
}
