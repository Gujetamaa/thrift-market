import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import type { Listing } from "../types";
import ListingGrid from "../components/listings/ListingGrid";
import SearchBar from "../components/ui/SearchBar";
import FiltersSidebar, { type Filters } from "../components/ui/FiltersSidebar";
import "../css/pages/listings.css";

const formatPHP = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0,
      })
        .format(n)
        .replace("₱", "₱ ")
    : "—";

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
      const base = collection(db, "listings");
      try {
        const q1 = query(
          base,
          where("isActive", "==", true),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q1);
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
        console.log("[Listings] primary query OK:", rows.length, "docs");
        setItems(rows);
      } catch (err) {
        console.error("[Listings] primary query failed — likely needs index:", err);

        // Fallback (no orderBy) so you still see items
        try {
          const q2 = query(base, where("isActive", "==", true));
          const snap2 = await getDocs(q2);
          const rows2 = snap2.docs.map((d) => ({ id: d.id, ...d.data() } as any));
          console.warn("[Listings] fallback query used:", rows2.length, "docs");
          setItems(rows2);
        } catch (err2) {
          console.error("[Listings] fallback query also failed:", err2);
        }
      }
    })();
  }, []);


  const filtered = useMemo(() => {
    return items.filter((i) => {
      const t = (s: string) => s?.toLowerCase?.() ?? "";
      const matchesText =
        t(i.title).includes(qtext.toLowerCase()) ||
        t(i.description).includes(qtext.toLowerCase());

      const matchesCategory =
        !filters.categories.length || filters.categories.includes(String(i.category));

      const matchesSize =
        !filters.sizes.length ||
        (i.size ? filters.sizes.includes(String(i.size)) : false) ||
        (!i.size && !filters.sizes.length);

      const matchesCondition =
        !filters.conditions.length ||
        (i.condition ? filters.conditions.includes(String(i.condition)) : false) ||
        (!i.condition && !filters.conditions.length);

      const price = Number(i.price ?? 0);
      const matchesMin = filters.priceMin === undefined || price >= filters.priceMin;
      const matchesMax = filters.priceMax === undefined || price <= filters.priceMax;

      return (
        matchesText &&
        matchesCategory &&
        matchesSize &&
        matchesCondition &&
        matchesMin &&
        matchesMax
      );
    });
  }, [items, qtext, filters]);

  return (
    <div className="listings-page">
      <header className="listings-header">
        <h1 className="listings-title">All Listings</h1>
        <div className="listings-underline"></div>
      </header>

      <SearchBar value={qtext} onChange={setQtext} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "1.5rem",
          alignItems: "start",
          paddingRight: "1.5rem",
        }}
      >
        <FiltersSidebar value={filters} onChange={setFilters} />
        <div className="listings-grid">
          <ListingGrid
            items={filtered.map((i: any) => ({
              ...i,
              priceDisplay: i.priceDisplay ?? formatPHP(Number(i.price)),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
