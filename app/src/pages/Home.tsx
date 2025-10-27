import "../css/pages/home.css";

export default function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">Discover Pre-Loved Fashion</h1>
      </header>

      <section className="home-section">
        <div>
          <h2>Buy Secondhand</h2>
          <p>Browse listings from local sellers and find your next favorite outfit sustainably.</p>
        </div>
        <div>
          <h2>Sell What You Don’t Use</h2>
          <p>Post your own listings and earn from clothes you no longer wear.</p>
        </div>
      </section>
    </div>
  );
}
