import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollCategory } from "@/hooks/useScrollCategory";
import ImageOptimized from "@/components/ImageOptimized";
import { Separator } from "@/components/ui/separator";
import MenuItemCard from "@/components/MenuItemCard";
const logo = "/images/optimized/logo.webp";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  spicy?: boolean;
  vegetarian?: boolean;
  popular?: boolean;
  available?: boolean;
  stock?: number;
  isSpecial?: boolean;
  specialPrice?: number;
  vegan?: boolean;
  glutenFree?: boolean;
  allergens?: string[];
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuData {
  shopName: string;
  currency: string;
  categories: MenuCategory[];
}

export default function Menu() {
  const { lang } = useParams();
  const urlCategory = new URLSearchParams(window.location.search).get('category') || undefined;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRTL, setIsRTL] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const { activeCategory } = useScrollCategory({
    categories: menuData?.categories.map(cat => cat.id) || []
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(urlCategory || "all");

  const mainRef = useRef<HTMLDivElement>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('menuFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Language switcher logic
  const languages = [
    { code: "en", label: "English" },
    { code: "ku", label: "كوردي" },
    { code: "ar", label: "العربيه" },
  ];
  const currentLanguage = lang || "en";
  const selectedLang = currentLanguage;
  const handleLanguageSwitch = (newLang: string) => {
    if (newLang === currentLanguage) return;
    localStorage.setItem("selectedLanguage", newLang);
    navigate(`/menu/${newLang}`);
    setTimeout(() => {
      if (mainRef.current) {
        // Adjust offset for sticky headers (header + search/filters + nav)
        const y = mainRef.current.getBoundingClientRect().top + window.scrollY - 24; // tweak offset as needed
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  // Load menu data based on lang param
  useEffect(() => {
    if (!currentLanguage) return;
    localStorage.setItem("selectedLanguage", currentLanguage);
    setIsRTL(currentLanguage === "ar");
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
    setLoading(true);
    const loadMenuData = async () => {
      try {
        const response = await fetch(`/menu_${currentLanguage}.json`);
        if (!response.ok) {
          throw new Error('Failed to load menu');
        }
        const data = await response.json();
        setMenuData(data);
      } catch (error) {
        toast({
          title: "Error loading menu",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    loadMenuData();
  }, [currentLanguage, toast]);

  // Toggle favorite item
  const toggleFavorite = (itemId: string) => {
    const newFavorites = favorites.includes(itemId)
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];
    setFavorites(newFavorites);
    localStorage.setItem('menuFavorites', JSON.stringify(newFavorites));
  };

  // Build list of items filtered by selected category
  const allItems = useMemo(() => {
    if (!menuData) return [] as Array<{categoryId: string; categoryName: string; item: any}>;
    return menuData.categories.flatMap(cat =>
      cat.items.map(item => ({ categoryId: cat.id, categoryName: cat.name, item }))
    );
  }, [menuData]);

  const visibleItems = useMemo(() => {
    if (!menuData) return [] as Array<{categoryId: string; categoryName: string; item: any}>;
    const base = selectedCategoryId === 'all'
      ? allItems
      : allItems.filter(entry => entry.categoryId === selectedCategoryId);
    return base.filter(({ item }) => item.available !== false && (item.stock === undefined || item.stock > 0));
  }, [allItems, menuData, selectedCategoryId]);

  // Available filter options
  const filterOptions = useMemo(() => [
    { id: 'vegetarian', label: '🌱 Vegetarian', count: 0 },
    { id: 'vegan', label: '🌿 Vegan', count: 0 },
    { id: 'glutenFree', label: '🌾 Gluten Free', count: 0 },
    { id: 'spicy', label: '🌶️ Spicy', count: 0 },
    { id: 'popular', label: '⭐ Popular', count: 0 },
    { id: 'special', label: '🏷️ Special Offers', count: 0 },
    { id: 'favorites', label: '❤️ Favorites', count: favorites.length },
  ], [favorites]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Failed to load menu</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? 'rtl font-arabic' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Sticky Header with centered logo and language menu */}
      <header className="sticky top-0 z-50 bg-[hsl(0_0%_17%)] text-[hsl(42_73%_94%)] py-3 sm:py-4 px-3 sm:px-4 shadow-md border-b border-border">
        <div className="grid grid-cols-3 items-center">
          <div />
          <div className="flex justify-center">
            <ImageOptimized src={logo} alt="German Doner" className="h-10 sm:h-12 md:h-14 w-auto" width={400} priority={true} sizes="200px" srcSet={`${logo} 400w, ${logo} 800w`} />
          </div>
          {/* Language Menu Button shows current language */}
          <div className="relative justify-self-end">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(0_0%_24%)] hover:bg-[hsl(1_69%_49%)] hover:text-[hsl(42_73%_94%)] focus:outline-none focus:ring-2 focus:ring-[hsl(39_92%_53%)] text-[hsl(42_73%_94%)] font-semibold border border-border"
            onClick={() => setLangMenuOpen(v => !v)}
            aria-label="Open language menu"
          >
            <span>{languages.find(l => l.code === selectedLang)?.label}</span>
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[hsl(0_0%_24%)] text-[hsl(42_73%_94%)] rounded-lg shadow-lg py-2 z-50 border border-border animate-fade-in" onClick={() => setLangMenuOpen(false)}>
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={e => { e.stopPropagation(); handleLanguageSwitch(lang.code); }}
                  className={`flex items-center w-full px-4 py-2 text-left hover:bg-[hsl(39_92%_53%)] hover:text-[hsl(0_0%_15%)] focus:bg-[hsl(39_92%_53%)] focus:text-[hsl(0_0%_15%)] transition-colors relative ${selectedLang === lang.code ? 'font-bold text-[hsl(39_92%_53%)]' : ''}`}
                  aria-current={selectedLang === lang.code ? 'page' : undefined}
                >
                  <span className="flex-1">{lang.label}</span>
                  {selectedLang === lang.code && (
                    <span className="ml-2 w-2 h-2 bg-[hsl(39_92%_53%)] rounded-full inline-block" aria-label="Current language" />
                  )}
                </button>
              ))}
            </div>
            )}
          </div>
        </div>
      </header>

      {/* Category navigation bar */}
      <div className="w-full sticky top-[56px] sm:top-[64px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b border-border">
        <div className="container mx-auto px-2 py-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
            {[
              { id: 'all', name: isRTL ? 'الكل' : 'All' },
              ...(menuData?.categories || []).map(c => ({ id: c.id, name: c.name }))
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${selectedCategoryId === cat.id ? 'bg-[hsl(39_92%_53%)] text-[hsl(0_0%_15%)] border-[hsl(39_92%_53%)]' : 'bg-card text-foreground border-border hover:bg-muted'}`}
                aria-pressed={selectedCategoryId === cat.id}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optional status bar removed for cleaner look */}

      {/* Menu Grid */}
      <main ref={mainRef} className="container mx-auto px-2 py-6">
        {visibleItems.length > 0 ? (
          <div className={`grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isRTL ? 'rtl font-arabic' : ''}`}>
            {visibleItems.map(({ item, categoryId }) => (
              <MenuItemCard
                key={item.id}
                item={item}
                currency={menuData.currency}
                isRTL={isRTL}
                isFavorite={favorites.includes(item.id)}
                onFavoriteToggle={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <motion.div className="text-center py-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-lg text-foreground">{isRTL ? "القائمة فارغة" : "Menu is empty."}</p>
          </motion.div>
        )}

        {/* Back to main menu (category cards) */}
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(`/categories/${lang}`)}
            className="px-6"
          >
            {isRTL ? 'الرجوع إلى القائمة الرئيسية' : 'Back to main menu'}
          </Button>
        </div>
      </main>
    </div>
  );
}