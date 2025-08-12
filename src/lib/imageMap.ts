export const fallbackLogo = "/images/optimized/logo.webp";

// Known local images mapped by item id - now using optimized versions
export const localImageByItemId: Record<string, string> = {
  // Pizzas
  "pepperoni-pizza": "/images/optimized/IMG_1144_TIF.webp",
  "salmon-pizza": "/images/optimized/IMG_2864.webp",
  "turkey-beef-salami-pizza": "/images/optimized/IMG_2865.webp",
  "salami-pizza": "/images/optimized/IMG_1145_TIF.webp",
  "pizza-mix": "/images/optimized/IMG_1156_TIF.webp",
  "turkey-pizza": "/images/optimized/IMG_1168_TIF.webp",

  // Pide
  "cheese-pide": "/images/optimized/IMG_1163_TIF.webp",
  "sucuk-pide": "/images/optimized/IMG_1158_TIF.webp",

  // Doner/Yufka
  "doner-kebap-chicken": "/images/optimized/IMG_1098_TIF.webp",
  "doner-kebap-beef": "/images/optimized/IMG_1098_TIF.webp",
  "yufka-kebap-beef": "/images/optimized/IMG_1093_TIF.webp",
  "yufka-kebap-chicken": "/images/optimized/IMG_1100_TIF.webp",

  // Beverages (use a representative image for all)
  "cola": "/images/optimized/assorted-beverages.webp",
  "fanta": "/images/optimized/assorted-beverages.webp",
  "water": "/images/optimized/assorted-beverages.webp",
  "sprite": "/images/optimized/assorted-beverages.webp",
  "cola-diet": "/images/optimized/assorted-beverages.webp",
  "yogurt": "/images/optimized/assorted-beverages.webp",
  "soda": "/images/optimized/assorted-beverages.webp",
  "tea": "/images/optimized/assorted-beverages.webp",
};

export function resolveItemImage(item: { id?: string; image?: string }): string {
  // Use curated images when available; otherwise fall back to logo
  if (item?.id && localImageByItemId[item.id]) return localImageByItemId[item.id];
  return fallbackLogo;
}


