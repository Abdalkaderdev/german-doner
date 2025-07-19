import { motion } from "framer-motion";
import { Heart, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import logo from "../assets/logo.jpg";

// German Flag colors
const GERMAN_RED = "#FF0000";
const GERMAN_YELLOW = "#FFD700";
const GERMAN_BLACK = "#000000";

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
    transition: { duration: 0.5, type: "spring" as const, stiffness: 120, damping: 12 }
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2, type: "spring" as const, stiffness: 400, damping: 10 }
  }
};

const cardImageVariants = {
  hover: {
    scale: 1.1,
    transition: { duration: 0.4, type: "spring" as const, stiffness: 200, damping: 15 }
  }
};

const formatPrice = (price: number, currency: string) => {
  if (currency === "IQD") {
    return `${price.toLocaleString()} ${currency}`;
  }
  return `${currency}${(price / 1000).toFixed(2)}`;
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, currency, isRTL, isFavorite, onFavoriteToggle }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Disable scroll when modal is open
  React.useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  return (
    <>
      <motion.div
        variants={itemVariants}
        whileHover="hover"
        className="h-full"
      >
        <Card className="overflow-hidden rounded-xl shadow-md bg-german-dark-gray flex flex-col h-full border-2 border-german-red hover:border-german-yellow transition-colors">
          <CardContent className="p-0">
            {/* Image Section */}
            <div className="w-full h-48 relative overflow-hidden bg-german-medium-gray flex-shrink-0 cursor-zoom-in" onClick={() => setModalOpen(true)}>
              <motion.img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover rounded-t-xl"
                variants={cardImageVariants}
              />
            </div>

            {/* Content Section */}
            <div className={`flex-1 flex flex-col p-6 gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-2xl font-extrabold flex-1 text-german-red leading-tight">{item.name}</h3>
                {onFavoriteToggle && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onFavoriteToggle(item.id)}
                    className="ml-2 p-2 hover:scale-110 transition-transform bg-transparent hover:bg-german-medium-gray"
                    aria-label="Toggle favorite"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-german-red text-german-red' : 'text-german-red hover:text-german-yellow'}`} />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {item.popular && <Badge className="bg-german-yellow text-black">Popular</Badge>}
                {item.spicy && <Badge className="bg-german-red text-black">🌶️ Spicy</Badge>}
                {item.vegetarian && <Badge className="bg-german-yellow text-black">🌱 Vegetarian</Badge>}
                {item.vegan && <Badge className="bg-german-yellow text-black">🌿 Vegan</Badge>}
                {item.glutenFree && <Badge className="bg-german-yellow text-black">🌾 Gluten Free</Badge>}
              </div>
              <p className="text-german-yellow text-base mb-6 min-h-[2.5em] leading-relaxed">{item.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-2xl font-bold text-german-yellow">{formatPrice(item.price, currency)}</span>
                {item.isSpecial && (
                  <Badge className="bg-german-yellow text-black ml-2">Special!</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Modal/Lightbox */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="relative bg-german-dark-gray rounded-lg shadow-lg max-w-md w-full mx-4 border-2 border-german-red" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-2xl text-german-red hover:text-german-yellow focus:outline-none"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <img src={logo} alt={item.name} className="w-full h-72 object-contain rounded-t-lg bg-german-medium-gray" />
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-german-red mb-2">{item.name}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard; 