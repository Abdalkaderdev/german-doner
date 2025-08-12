import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import ImageOptimized from "@/components/ImageOptimized";
import { resolveItemImage } from "@/lib/imageMap";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  popular?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
  available?: boolean;
  stock?: number;
  isSpecial?: boolean;
  specialPrice?: number;
  vegan?: boolean;
  glutenFree?: boolean;
  allergens?: string[];
}

// Props for MenuItemCard
interface MenuItemCardProps {
  item: MenuItem;
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

  // Resolve image source shared with categories
  const imageSrc: string = resolveItemImage(item);
  const isFallbackLogo = imageSrc.endsWith("/images/logo.webp");
  const imageBgClass = isFallbackLogo ? 'bg-[hsl(42_73%_94%)]' : 'bg-[hsl(0_0%_24%)]';
  const imageObjectClass = isFallbackLogo ? 'object-contain p-6' : 'object-cover';

  return (
    <>
      <motion.div
        variants={itemVariants}
        whileHover="hover"
        className="h-full"
      >
        <Card className="overflow-hidden rounded-xl shadow-md bg-card flex flex-col h-full border border-border hover:border-primary transition-colors">
          <CardContent className="p-0">
            {/* Image Section */}
          <div className={`w-full h-48 relative overflow-hidden ${imageBgClass} flex-shrink-0 cursor-zoom-in aspect-[4/3] mb-4`} onClick={() => setModalOpen(true)}>
              <ImageOptimized
                src={imageSrc}
                alt={item?.name || "Menu item"}
                className={`w-full h-full ${imageObjectClass} rounded-t-xl`}
                width={400}
                sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                srcSet={`${imageSrc} 400w, ${imageSrc} 800w, ${imageSrc} 1200w`}
              />
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col p-5 gap-2 items-center text-center">
              <div className="flex flex-col items-center gap-1 mb-1">
                <h3 className="text-2xl font-extrabold text-foreground leading-tight">{item.name}</h3>
              </div>
              <div className="flex items-center justify-center gap-1 mb-2 flex-wrap">
                {item.popular && <Badge className="bg-secondary text-[hsl(0_0%_15%)]">Popular</Badge>}
                {item.spicy && <Badge className="bg-primary text-[hsl(42_73%_94%)]">🌶️ Hot</Badge>}
                {item.vegetarian && <Badge className="bg-[hsl(82_70%_38%)] text-[hsl(42_73%_94%)]">🌱 Vegetarian</Badge>}
                {item.vegan && <Badge className="bg-[hsl(82_70%_38%)] text-[hsl(42_73%_94%)]">🌿 Vegan</Badge>}
                {item.glutenFree && <Badge className="bg-secondary text-[hsl(0_0%_15%)]">🌾 Gluten Free</Badge>}
              </div>
              <p className="text-muted-foreground text-base mb-4 min-h-[2.5em] leading-relaxed text-center">{item.description}</p>
              <div className="flex items-center justify-center mt-auto">
                <span className="text-2xl font-bold px-2 py-1 rounded bg-secondary text-[hsl(0_0%_15%)]">{formatPrice(item.price, currency)}</span>
                {item.isSpecial && (
                  <Badge className="bg-primary text-[hsl(42_73%_94%)] ml-2">New</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Modal/Lightbox */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(0_0%_17%)]/90 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="relative bg-card rounded-lg shadow-lg max-w-md w-full mx-4 border border-border" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-2xl text-foreground hover:text-primary focus:outline-none"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <ImageOptimized src={imageSrc} alt={item.name} className={`w-full h-72 object-contain rounded-t-lg ${imageBgClass}`} width={800} height={600} />
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">{item.name}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard; 