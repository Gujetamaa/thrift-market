import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./lib/firebase";

function App() {
  const [msg, setMsg] = useState("Connecting...");

  useEffect(() => {
    (async () => {
      try {
        await getDocs(collection(db, "test"));
        setMsg("✅ Firebase connected successfully! Hello Thrift Market!");
      } catch (e) {
        console.error(e);
        setMsg("❌ Firebase connection failed. Check .env and rules.");
      }
    })();
  }, []);

  return (
    <div style={{ padding: 20, color: "#fff" }}>
      <h1>{msg}</h1>
    </div>
  );
}

export default App;
