import { Link } from "react-router-dom";
import type { Listing } from "../../types";
import "../../css/components/listing-card.css";

export default function ListingCard({ item }: { item: Listing }) {
  return (
    <Link to={`/listings/${item.id}`} className="listing-card">
      <img src={item.photos[0]} alt={item.title} />
      <div className="listing-card-body">
        <h3 className="listing-card-title">{item.title}</h3>
        <div className="listing-card-category">{item.category}</div>
        <div className="listing-card-price">₱{item.price.toLocaleString()}</div>
      </div>
    </Link>
  );
}
