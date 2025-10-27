export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;              // cents or number
  photos: string[];           // download URLs
  category: "tops"|"bottoms"|"shoes"|"accessories"|"other";
  size?: string;
  condition?: "new"|"like-new"|"good"|"fair";
  createdAt: number;          // Date.now()
  sellerId: string;
  sellerName?: string;
  location?: string;
  isActive: boolean;
};
