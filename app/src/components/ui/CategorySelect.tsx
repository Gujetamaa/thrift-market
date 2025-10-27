import "../../css/components/category-select.css";

const CATS = ["tops", "bottoms", "shoes", "accessories", "other"] as const;

export default function CategorySelect({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  return (
    <select className="category-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {CATS.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
