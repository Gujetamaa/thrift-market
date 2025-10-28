import { useEffect, useMemo, useState } from "react";
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


const CONDITION_OPTIONS = ["new", "like-new", "good", "fair"] as const;
const CATEGORY_OPTIONS = ["tops", "bottoms", "shoes", "accessories", "other"] as const;

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be 0 or higher"),
  category: z.enum(CATEGORY_OPTIONS),
  photos: z.array(z.string().url()).min(1, "At least one photo is required"),
  size: z.string().min(1, "Select a size"), // dynamic sizes
  condition: z.enum(CONDITION_OPTIONS),
});

type FormData = z.infer<typeof schema>;
type Category = FormData["category"];


const APPAREL_XS_XXL = ["XS", "S", "M", "L", "XL", "XXL"];
const APPAREL_S_4XL = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];
const SIZES_EU = [
  "36",
  "36.5",
  "37",
  "38",
  "38.5",
  "39",
  "40",
  "40.5",
  "41",
  "42",
  "42.5",
  "43",
  "44",
  "44.5",
  "45",
  "46",
  "47",
  "48",
].map((n) => `EU Size ${n}`);

function getSizeGroups(category: Category) {
  switch (category) {
    case "shoes":
      return {
        apparel: [] as string[],
        shoesizes: SIZES_EU,
      };
    case "other":
      return {
        apparel: APPAREL_S_4XL,
        shoesizes: SIZES_EU,
      };
    default: // tops, bottoms, accessories
      return {
        apparel: APPAREL_XS_XXL,
        shoesizes: [] as string[],
      };
  }
}

function getDefaultSize(category: Category) {
  const groups = getSizeGroups(category);
  if (groups.apparel.length) return groups.apparel.includes("M") ? "M" : groups.apparel[0];
  if (groups.shoesizes.length) return "EU Size 42";
  return "";
}


export default function ListingForm() {
  const { user } = useAuth();
  const [uploadBusy, setUploadBusy] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      photos: [],
      category: "other",
      price: 0,
      size: getDefaultSize("other"),
      condition: "good",
    },
  });

  const category = watch("category");
  const size = watch("size");
  const photos = watch("photos");

  // Ensure size stays valid when category changes
  useEffect(() => {
    const groups = getSizeGroups(category);
    const validValues = new Set([...groups.apparel, ...groups.shoesizes]);
    if (!validValues.has(size)) {
      setValue("size", getDefaultSize(category), { shouldValidate: true });
    }
  }, [category, size, setValue]);

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

  const sizeGroups = useMemo(() => getSizeGroups(category), [category]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="listing-form">
      <input placeholder="Title" {...register("title")} />
      {errors.title && <p style={{ color: "#f87171" }}>{errors.title.message}</p>}

      <textarea placeholder="Description" rows={4} {...register("description")} />
      {errors.description && (
        <p style={{ color: "#f87171" }}>{errors.description.message}</p>
      )}

      <PriceInput
        value={watch("price")}
        onChange={(n) => setValue("price", n, { shouldValidate: true })}
        min={0}
      />
      {errors.price && <p style={{ color: "#f87171" }}>{errors.price.message}</p>}

      <CategorySelect
        value={category}
        onChange={(v) => setValue("category", v as Category, { shouldValidate: true })}
      />

      {/* Size (Dynamic EU-based) */}
      <label className="field-label">Size</label>
      <select
        value={watch("size")}
        onChange={(e) => setValue("size", e.target.value, { shouldValidate: true })}
      >
        {sizeGroups.apparel.length > 0 && (
          <optgroup label="Apparel">
            {sizeGroups.apparel.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </optgroup>
        )}

        {sizeGroups.shoesizes.length > 0 && (
          <optgroup label="EU Sizes">
            {sizeGroups.shoesizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </optgroup>
        )}
      </select>
      {errors.size && <p style={{ color: "#f87171" }}>{errors.size.message}</p>}

      <label className="field-label">Condition</label>
      <select {...register("condition")}>
        {CONDITION_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {errors.condition && (
        <p style={{ color: "#f87171" }}>{errors.condition.message}</p>
      )}

      <ImageUploader
        onDone={(urls) =>
          setValue("photos", [...photos, ...urls], { shouldValidate: true })
        }
        onBusyChange={setUploadBusy}
        max={5}
      />
      <div className="image-preview-container">
        {photos.map((u) => (
          <img key={u} src={u} alt="listing" />
        ))}
      </div>
      {errors.photos && (
        <p style={{ color: "#f87171" }}>At least one photo is required</p>
      )}

      <button type="submit" disabled={uploadBusy}>
        {uploadBusy ? "Uploading photos…" : "Publish"}
      </button>
    </form>
  );
}
