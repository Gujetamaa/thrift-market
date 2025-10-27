import { useAuth } from "../store/useAuth";
import "../css/pages/profile.css";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      <div className="profile-info">
        <p><span>Name:</span> {user.displayName || "Anonymous User"}</p>
        <p><span>Email:</span> {user.email}</p>
        <p><span>UID:</span> {user.uid}</p>
      </div>
    </div>
  );
}
