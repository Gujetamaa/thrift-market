export default function SizeSelect({
  category,
  value,
  onChange,
}: {
  category: "tops" | "bottoms" | "shoes" | "accessories" | "other";
  value: string;
  onChange: (v: string) => void;
}) {
  const APPAREL_XS_4XL = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  const SIZES_EU = ["36.5", "37", "38", "38.5", "39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "46", "47", "48"].map((n) => `EU Size ${n}`);

  // Build the option sets per category
  let apparelBlock: string[] = [];
  let includeShoeBlocks = false;

  switch (category) {
    case "shoes":
      apparelBlock = [];                 // no apparel sizes for pure shoes
      includeShoeBlocks = true;
      break;
    case "other":
      apparelBlock = APPAREL_XS_4XL;      // S–4XL
      includeShoeBlocks = true;          // plus EU shoe sizes
      break;
    default:
      // tops, bottoms, accessories
      apparelBlock = APPAREL_XS_4XL;
      includeShoeBlocks = false;
  }

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {/* Apparel sizes (if any) */}
      {apparelBlock.length > 0 && (
        <optgroup label="Apparel">
          {apparelBlock.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </optgroup>
      )}

      {/* Shoe sizes (if included) */}
      {includeShoeBlocks && (
        <>
          <optgroup label="EU Sizes">
            {SIZES_EU.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </optgroup>
        </>
      )}
    </select>
  );
}
