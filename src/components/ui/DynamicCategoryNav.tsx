import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface DynamicCategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (id: string) => void;
  isRTL?: boolean;
}

// Placeholder for smokey cursor effect (to be implemented)
const SmokeyCursor: React.FC = () => null;

const DynamicCategoryNav: React.FC<DynamicCategoryNavProps> = ({ categories, activeCategory, onCategoryClick, isRTL }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Scroll active button into center when activeCategory changes
  useEffect(() => {
    const btn = btnRefs.current[activeCategory];
    if (btn && navRef.current) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeCategory]);

  return (
    <div ref={navRef} className="sticky top-[72px] w-full bg-white border-b z-40">
      {/* Smokey Cursor Effect */}
      <SmokeyCursor />
      <nav
        className="flex gap-2 py-4 overflow-x-auto scrollbar-hide w-full px-2"
        style={{
          WebkitOverflowScrolling: 'touch',
          direction: isRTL ? 'rtl' : 'ltr',
          scrollSnapType: 'x mandatory',
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            ref={el => (btnRefs.current[cat.id] = el)}
            onClick={() => onCategoryClick(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD54F] scroll-snap-align-center ${
              activeCategory === cat.id
                ? 'text-primary font-bold border-b-2 border-primary bg-[#FFD54F]/80 shadow'
                : 'bg-transparent text-[#C62828] hover:bg-[#FFD54F]/30'
            }`}
            aria-current={activeCategory === cat.id ? 'page' : undefined}
            initial={false}
            animate={activeCategory === cat.id ? { scale: 1.08 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {cat.name} <span className="opacity-70">({cat.count})</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

export default DynamicCategoryNav; 