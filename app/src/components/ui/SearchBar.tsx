import "../../css/components/search-bar.css";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="search-bar">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search listings…"
      />
      <button type="button">Search</button>
    </div>
  );
}
