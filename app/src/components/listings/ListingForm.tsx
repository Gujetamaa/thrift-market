import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUploader from "./ImageUploader";
import PriceInput from "../ui/PriceInput";
import CategorySelect from "../ui/CategorySelect";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../store/useAuth";
import "../../css/components/listing-form.css";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(0),
  category: z.enum(["tops", "bottoms", "shoes", "accessories", "other"]),
  photos: z.array(z.string().url()).min(1),
});

type FormData = z.infer<typeof schema>;

export default function ListingForm() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { photos: [], category: "other", price: 0 },
  });

  const photos = watch("photos");

  async function onSubmit(data: FormData) {
    await addDoc(collection(db, "listings"), {
      ...data,
      createdAt: serverTimestamp(),
      sellerId: user!.uid,
      sellerName: user!.displayName || user!.email,
      isActive: true,
    });
    alert("Listing created!");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="listing-form">
      <input placeholder="Title" {...register("title")} />
      <textarea placeholder="Description" rows={4} {...register("description")} />
      <PriceInput
        value={watch("price")}
        onChange={(n) => setValue("price", n, { shouldValidate: true })}
      />
      <CategorySelect
        value={watch("category")}
        onChange={(v) => setValue("category", v as any, { shouldValidate: true })}
      />

      <ImageUploader
        onDone={(urls) =>
          setValue("photos", [...photos, ...urls], { shouldValidate: true })
        }
      />
      <div className="image-preview-container">
        {photos.map((u) => (
          <img key={u} src={u} />
        ))}
      </div>

      {errors.title && <p style={{ color: "#f87171" }}>{errors.title.message}</p>}
      {errors.description && (
        <p style={{ color: "#f87171" }}>{errors.description.message}</p>
      )}
      {errors.photos && (
        <p style={{ color: "#f87171" }}>At least one photo is required</p>
      )}

      <button type="submit">Publish</button>
    </form>
  );
}
