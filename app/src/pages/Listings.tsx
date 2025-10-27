import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import type { Listing } from "../types";
import ListingGrid from "../components/listings/ListingGrid";
import SearchBar from "../components/ui/SearchBar";
import FiltersSidebar, { type Filters } from "../components/ui/FiltersSidebar";
import "../css/pages/listings.css";

export default function Listings() {
  const [items, setItems] = useState<Listing[]>([]);
  const [qtext, setQtext] = useState("");
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    sizes: [],
    conditions: [],
    priceMin: undefined,
    priceMax: undefined,
  });

  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, "listings"),
        where("isActive", "==", true),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as any)));
    })();
  }, []);

  const filtered = items.filter((i) => {
    const t = (s: string) => s?.toLowerCase() ?? "";
    const matchesText =
      t(i.title).includes(qtext.toLowerCase()) ||
      t(i.description).includes(qtext.toLowerCase());

    const matchesCategory =
      !filters.categories.length || filters.categories.includes(String(i.category));

    const matchesSize =
      !filters.sizes.length || (i.size ? filters.sizes.includes(String(i.size)) : false) || (!i.size && !filters.sizes.length);

    const matchesCondition =
      !filters.conditions.length || (i.condition ? filters.conditions.includes(String(i.condition)) : false) || (!i.condition && !filters.conditions.length);

    const price = Number(i.price ?? 0);
    const matchesMin = filters.priceMin === undefined || price >= filters.priceMin;
    const matchesMax = filters.priceMax === undefined || price <= filters.priceMax;

    return matchesText && matchesCategory && matchesSize && matchesCondition && matchesMin && matchesMax;
  });

  return (
    <div className="listings-page">
      <header className="listings-header">
        <h1 className="listings-title">All Listings</h1>
        <div className="listings-underline"></div>
      </header>

      <SearchBar value={qtext} onChange={setQtext} />

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.5rem", alignItems: "start", padding: "0 1.5rem" }}>
        <FiltersSidebar value={filters} onChange={setFilters} />
        <div className="listings-grid">
          <ListingGrid items={filtered} />
        </div>
      </div>
    </div>
  );
}
