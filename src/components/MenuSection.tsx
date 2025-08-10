import React, { useRef, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import MenuItemCard from "./MenuItemCard";

// Props for MenuSection
interface MenuSectionProps {
  category: any;
  currency: string;
  isRTL: boolean;
  favorites?: string[];
  onFavoriteToggle?: (id: string) => void;
  observeCategory?: (categoryId: string, element: HTMLElement) => void;
  categoryId?: string;
  isAlt?: boolean;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, type: "spring", stiffness: 80, damping: 18 }
  }
};

const MenuSection: React.FC<MenuSectionProps> = ({
  category,
  currency,
  isRTL,
  favorites = [],
  onFavoriteToggle,
  observeCategory,
  categoryId,
  isAlt
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (observeCategory && sectionRef.current && categoryId) {
      observeCategory(categoryId, sectionRef.current);
    }
  }, [observeCategory, categoryId]);

  // Debug: Log category and items
  console.log('Rendering category:', category.id, category.items);
  const isPizza = category.id === 'pizza';
  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 80, damping: 18 }}
      id={`category-${category.id}`}
      className={`mb-12 ${isAlt ? 'bg-[hsl(0_0%_24%)/85%] text-[hsl(42_73%_94%)]' : 'bg-background'} rounded-xl p-2 sm:p-4 scroll-mt-[88px] sm:scroll-mt-[112px]`}
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-6 px-4"
        style={{ borderLeft: isRTL ? undefined : '6px solid hsl(39 92% 53%)', borderRight: isRTL ? '6px solid hsl(39 92% 53%)' : undefined }}
      >
        {category.name}
      </motion.h2>
      <div
        className={
          `grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-4 py-6` +
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