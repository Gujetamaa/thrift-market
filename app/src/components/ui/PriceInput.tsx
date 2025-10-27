import "../../css/components/price-input.css";

export default function PriceInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      className="price-input"
      type="number"
      min={0}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder="Price in PHP"
    />
  );
}
