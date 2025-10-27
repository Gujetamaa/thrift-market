import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { Listing } from "../types";
import "../css/pages/listing-detail.css";

export default function ListingDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<Listing | null>(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "listings", id!));
      if (snap.exists()) setItem({ id: snap.id, ...snap.data() } as any);
    })();
  }, [id]);

  if (!item) return <p>Loading…</p>;

  return (
    <div className="listing-detail">
      <img src={item.photos[0]} alt={item.title} />
      <div className="listing-detail-info">
        <h1 className="listing-detail-title">{item.title}</h1>
        <p className="listing-detail-price">₱{item.price.toLocaleString()}</p>
        <p>{item.description}</p>
        <p>Seller: {item.sellerName}</p>
      </div>
    </div>
  );
}
