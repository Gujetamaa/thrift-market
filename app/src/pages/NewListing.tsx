import ListingForm from "../components/listings/ListingForm";
import "../css/pages/new-listing.css";

export default function NewListing() {
  return (
    <div className="new-listing-container">
      <h1 className="new-listing-title">Create a Listing</h1>
      <div className="new-listing-form">
        <ListingForm />
      </div>
    </div>
  );
}
