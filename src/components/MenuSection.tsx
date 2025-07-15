import React from "react";
import { motion, Variants } from "framer-motion";
import MenuItemCard from "./MenuItemCard";

// Props for MenuSection
interface MenuSectionProps {
  category: any;
  currency: string;
  isRTL: boolean;
  favorites?: string[];
  onFavoriteToggle?: (id: string) => void;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, type: "spring", stiffness: 80, damping: 18 }
  }
};

const MenuSection: React.FC<MenuSectionProps> = ({ category, currency, isRTL, favorites = [], onFavoriteToggle }) => {
  // Debug: Log category and items
  console.log('Rendering category:', category.id, category.items);
  const isPizza = category.id === 'pizza';
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      id={`category-${category.id}`}
      className="mb-12"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-6 px-2"
        style={{ color: '#C62828', borderLeft: isRTL ? undefined : '6px solid #FFD54F', borderRight: isRTL ? '6px solid #FFD54F' : undefined }}
      >
        {category.name}
      </motion.h2>
      {/* Debug: Print rendered item IDs and names */}
      <div className="text-xs text-gray-500 mb-2 px-2">
        Items: {category.items.map((item: any) => `${item.id} (${item.name})`).join(', ')}
      </div>
      <div
        className={
          `grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3` +
          (isRTL ? ' direction-rtl' : '')
        }
      >
        {category.items.map((item: any) => (
          <MenuItemCard
            key={item.id}
            item={item}
            currency={currency}
            isRTL={isRTL}
            isFavorite={favorites.includes(item.id)}
            onFavoriteToggle={onFavoriteToggle}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default MenuSection; 