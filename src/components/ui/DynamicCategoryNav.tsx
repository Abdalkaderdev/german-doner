import React, { useRef } from "react";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface DynamicCategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (id: string) => void;
}

// Placeholder for smokey cursor effect (to be implemented)
const SmokeyCursor: React.FC = () => null;

const DynamicCategoryNav: React.FC<DynamicCategoryNavProps> = ({ categories, activeCategory, onCategoryClick }) => {
  const navRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={navRef} className="sticky top-[72px] w-full bg-white border-b z-40">
      {/* Smokey Cursor Effect */}
      <SmokeyCursor />
      <nav className="flex gap-2 py-4 overflow-x-auto scrollbar-hide w-full px-2" style={{ WebkitOverflowScrolling: 'touch' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryClick(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD54F] ${
              activeCategory === cat.id
                ? 'bg-[#FFD54F] text-[#C62828] shadow'
                : 'bg-transparent text-[#C62828] hover:bg-[#FFD54F]/30'
            }`}
            aria-current={activeCategory === cat.id ? 'page' : undefined}
          >
            {cat.name} <span className="opacity-70">({cat.count})</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DynamicCategoryNav; 