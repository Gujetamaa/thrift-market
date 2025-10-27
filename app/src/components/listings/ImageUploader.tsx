import { useState } from "react";
import { storage } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../../css/components/image-uploader.css";

export default function ImageUploader({ onDone }: { onDone: (urls: string[]) => void }) {
  const [busy, setBusy] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    const urls: string[] = [];
    for (const f of files) {
      const r = ref(storage, `listings/${Date.now()}-${f.name}`);
      await uploadBytes(r, f);
      urls.push(await getDownloadURL(r));
    }
    setBusy(false);
    onDone(urls);
  }

  return (
    <div className="image-uploader">
      <input type="file" multiple accept="image/*" onChange={handleFiles} />
      {busy && <p>Uploading…</p>}
      <div className="image-preview-container" />
    </div>
  );
}
