import { useState, useEffect } from "react";
import "../../css/components/filters-sidebar.css";

export type Filters = {
  categories: string[];
  sizes: string[];
  conditions: string[];
  priceMin?: number;
  priceMax?: number;
};

const CATEGORIES = ["tops", "bottoms", "shoes", "accessories", "other"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const CONDITIONS = ["new", "like-new", "good", "fair"];

export default function FiltersSidebar({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (next: Filters) => void;
}) {
  const [local, setLocal] = useState<Filters>(value);

  useEffect(() => setLocal(value), [value]);

  function toggle(listName: keyof Filters, item: string) {
    const list = new Set((local[listName] as string[]) || []);
    list.has(item) ? list.delete(item) : list.add(item);
    const next = { ...local, [listName]: Array.from(list) };
    setLocal(next);
    onChange(next);
  }

  function setNum(field: "priceMin" | "priceMax", v: string) {
    const num = v === "" ? undefined : Number(v);
    const next = { ...local, [field]: num };
    setLocal(next);
    onChange(next);
  }

  function reset() {
    const next: Filters = { categories: [], sizes: [], conditions: [], priceMin: undefined, priceMax: undefined };
    setLocal(next);
    onChange(next);
  }

  return (
    <aside className="filters-sidebar">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Category</label>
        <div>
          {CATEGORIES.map((c) => (
            <label key={c} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={local.categories.includes(c)}
                onChange={() => toggle("categories", c)}
              />{" "}
              {c}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Size</label>
        <div>
          {SIZES.map((s) => (
            <label key={s} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={local.sizes.includes(s)}
                onChange={() => toggle("sizes", s)}
              />{" "}
              {s}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Condition</label>
        <div>
          {CONDITIONS.map((c) => (
            <label key={c} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={local.conditions.includes(c)}
                onChange={() => toggle("conditions", c)}
              />{" "}
              {c}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Price range (₱)</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="number"
            placeholder="Min"
            value={local.priceMin ?? ""}
            onChange={(e) => setNum("priceMin", e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            value={local.priceMax ?? ""}
            onChange={(e) => setNum("priceMax", e.target.value)}
          />
        </div>
      </div>

      <button onClick={reset} style={{ alignSelf: "flex-start" }}>
        Reset
      </button>
    </aside>
  );
}
