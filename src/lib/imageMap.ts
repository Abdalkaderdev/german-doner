export const fallbackLogo = "/images/optimized/logo.webp";

// Known local images mapped by item id - now using optimized versions
export const localImageByItemId: Record<string, string> = {
  // Pizzas
  "pepperoni-pizza": "/images/optimized/IMG_3781.PNG.webp",
  "salmon-pizza": "/images/optimized/IMG_2864.webp",
  "turkey-beef-salami-pizza": "/images/optimized/IMG_1168_TIF.webp",
  // salami-pizza intentionally unmapped to use logo fallback
  // mix pizza intentionally unmapped to use logo fallback
  "vegetarian-pizza": "/images/optimized/IMG_1156_TIF.webp",
  "diavolo-pizza": "/images/optimized/IMG_1169_TIF.webp",
  "pizza-mix": "/images/optimized/IMG_3777.PNG.webp",
  "four-cheese-pizza": "/images/optimized/IMG_3779.PNG.webp",
  "calzone-pizza": "/images/optimized/IMG_3782.PNG.webp",
  "tuna-pizza": "/images/optimized/IMG_3780.PNG.webp",
  // turkey-pizza intentionally unmapped to use logo fallback

  // Pide
  "sucuk-pide": "/images/optimized/IMG_1158_TIF.webp",
  "cheese-pide": "/images/optimized/IMG_3772.PNG.webp",
  "lahmacun-plate": "/images/optimized/IMG_3775.PNG.webp",

  // Doner/Yufka
  "doner-kebap-chicken": "/images/optimized/IMG_1098_TIF.webp",
  "doner-kebap-beef": "/images/optimized/IMG_1098_TIF.webp",
  "yufka-kebap-chicken": "/images/optimized/IMG_3773.PNG.webp",
  "yufka-kebap-beef": "/images/optimized/IMG_3774.PNG.webp",
  "doner-pizza": "/images/optimized/IMG_3778.PNG.webp",
  // yufka kebap items intentionally unmapped to use logo fallback
  "kebap-plate-chicken": "/images/optimized/IMG_1100_TIF.webp",
  "kebap-plate-beef": "/images/optimized/IMG_1093_TIF.webp",

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


