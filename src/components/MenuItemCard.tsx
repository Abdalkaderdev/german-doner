import { motion } from "framer-motion";
import { Heart, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";

// Brand colors
const BRAND_RED = "#C62828";
const BRAND_GOLD = "#FFD54F";

// Props for MenuItemCard
interface MenuItemCardProps {
  item: any;
  currency: string;
  isRTL: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, type: "spring", stiffness: 120, damping: 12 }
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 10 }
  }
};

const cardImageVariants = {
  hover: {
    scale: 1.1,
    transition: { duration: 0.4, type: "spring", stiffness: 200, damping: 15 }
  }
};

const formatPrice = (price: number, currency: string) => {
  if (currency === "IQD") {
    return `${price.toLocaleString()} ${currency}`;
  }
  return `${currency}${(price / 1000).toFixed(2)}`;
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, currency, isRTL, isFavorite, onFavoriteToggle }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      className="h-full"
    >
      <Card className="overflow-hidden rounded-xl shadow-md bg-white flex flex-col h-full border border-gray-100">
        <CardContent className="p-0">
          {/* Image Section */}
          <div className="w-full h-48 relative overflow-hidden bg-gray-100 flex-shrink-0">
            {item.image ? (
              <motion.img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                variants={cardImageVariants}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            {/* Placeholder if no image */}
            <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${item.image ? 'hidden' : ''}`}>
              <img src="/images/placeholder.png" alt="No Image" className="w-16 h-16 object-contain opacity-60 mb-2" />
              <ImageOff className="h-8 w-8 text-gray-400 absolute bottom-2 right-2" />
            </div>
          </div>

          {/* Content Section */}
          <div className={`flex-1 flex flex-col p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900 flex-1" style={{ color: BRAND_RED }}>{item.name}</h3>
              {onFavoriteToggle && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onFavoriteToggle(item.id)}
                  className="ml-2 p-2 hover:scale-110 transition-transform"
                  aria-label="Toggle favorite"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {item.popular && <Badge className="bg-[${BRAND_GOLD}] text-gray-900">Popular</Badge>}
              {item.spicy && <Badge className="bg-red-600 text-white">🌶️ Spicy</Badge>}
              {item.vegetarian && <Badge className="bg-green-600 text-white">🌱 Vegetarian</Badge>}
              {item.vegan && <Badge className="bg-green-700 text-white">🌿 Vegan</Badge>}
              {item.glutenFree && <Badge className="bg-purple-600 text-white">🌾 Gluten Free</Badge>}
            </div>
            <p className="text-gray-600 text-sm mb-4 min-h-[2.5em]">{item.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xl font-bold" style={{ color: BRAND_GOLD }}>{formatPrice(item.price, currency)}</span>
              {item.isSpecial && (
                <Badge className="bg-[${BRAND_GOLD}] text-gray-900 ml-2">Special!</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MenuItemCard; 