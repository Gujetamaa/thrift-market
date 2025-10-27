import { useState } from "react";
import { storage } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../../css/components/image-uploader.css";

export default function ImageUploader({
  onDone,
  onBusyChange,
  max = 5,
}: {
  onDone: (urls: string[]) => void;
  onBusyChange?: (busy: boolean) => void;
  max?: number;
}) {
  const [busy, setBusy] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const slice = files.slice(0, max); // limit uploads
    setBusy(true);
    onBusyChange?.(true);

    try {
      const urls: string[] = [];
      for (const f of slice) {
        const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}-${f.name}`;
        const r = ref(storage, path);
        await uploadBytes(r, f);
        urls.push(await getDownloadURL(r));
      }
      onDone(urls);
    } catch (err) {
      console.error(err);
      alert("Image upload failed. Please try again.");
    } finally {
      setBusy(false);
      onBusyChange?.(false);
      if (e.target) e.target.value = ""; // allow re-select same files
    }
  }

  return (
    <div className="image-uploader">
      <input type="file" multiple accept="image/*" onChange={handleFiles} />
      {busy && <p>Uploading…</p>}
      <div className="image-preview-container" />
    </div>
  );
}
