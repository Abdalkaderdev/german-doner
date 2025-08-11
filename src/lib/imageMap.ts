export const fallbackLogo = "/images/logo.png";

// Known local images mapped by item id
export const localImageByItemId: Record<string, string> = {
  "pepperoni-pizza": "/images/IMG_2862.jpg",
  "salmon-pizza": "/images/IMG_2864.jpg",
  "turkey-beef-salami-pizza": "/images/IMG_2865.jpg",
  "pizza-mix": "/images/IMG_2876.jpg",
  "cheese-pide": "/images/IMG_2885.jpg",
  "sucuk-pide": "/images/IMG_2893.jpg",
  "doner-kebap-chicken": "/images/IMG_2901.jpg",
  "doner-kebap-beef": "/images/IMG_2903.jpg",
  "yufka-kebap-beef": "/images/IMG_2909.jpg",
  // Beverages (use a representative image for all)
  "cola": "/images/assorted-beverages.jpg",
  "fanta": "/images/assorted-beverages.jpg",
  "water": "/images/assorted-beverages.jpg",
  "sprite": "/images/assorted-beverages.jpg",
  "cola-diet": "/images/assorted-beverages.jpg",
  "yogurt": "/images/assorted-beverages.jpg",
  "soda": "/images/assorted-beverages.jpg",
  "tea": "/images/assorted-beverages.jpg",
};

export function resolveItemImage(item: { id?: string; image?: string }): string {
  // Use ONLY local curated images when known; otherwise fall back to logo
  if (item?.id && localImageByItemId[item.id]) return localImageByItemId[item.id];
  return fallbackLogo;
}


