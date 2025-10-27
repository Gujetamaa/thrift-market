import type { Listing } from "../../types";
import ListingCard from "./ListingCard";
import "../../css/components/listing-grid.css";

export default function ListingGrid({ items }: { items: Listing[] }) {
  return (
    <div className="listing-grid">
      {items.map((l) => (
        <ListingCard key={l.id} item={l} />
      ))}
    </div>
  );
}
