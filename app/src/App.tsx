import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import NewListing from "./pages/NewListing";
import Profile from "./pages/Profile";
import AuthGate from "./components/layout/AuthGate";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route
            path="/sell"
            element={
              <AuthGate>
                <NewListing />
              </AuthGate>
            }
          />
          <Route
            path="/me"
            element={
              <AuthGate>
                <Profile />
              </AuthGate>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
