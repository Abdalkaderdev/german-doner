import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Filter, Clock, MapPin, Star, Heart, X, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useScrollCategory } from "@/hooks/useScrollCategory";
import MenuSection from "@/components/MenuSection";
import logo from "@/assets/logo.jpg";

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
  
  const categoryRefs = useRef<Map<string, HTMLElement>>(new Map());
  const { activeCategory, scrollToCategory, observeCategory } = useScrollCategory({
    categories: menuData?.categories.map(cat => cat.id) || []
  });

  const mainRef = useRef<HTMLDivElement>(null);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('menuFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Language switcher logic
  const languages = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "ku", label: "KU", flag: "🇮🇶" },
    { code: "ar", label: "AR", flag: "🇸🇾" },
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
        console.error('Error loading menu:', error);
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

  // --- Search Logic (modular, ready for extraction) ---
  // Memoize filtered categories for performance
  const filteredCategories = useMemo(() => {
    if (!menuData) return [];
    // If no search, return all categories with items
    if (!searchQuery.trim()) {
      return menuData.categories.map(category => ({
        ...category,
        items: category.items.filter(item => {
          // Check availability and stock
          if (item.available === false || (item.stock !== undefined && item.stock <= 0)) return false;
          // Dietary filters
          if (selectedFilters.length > 0) {
            const itemFilters = [];
            if (item.vegetarian) itemFilters.push('vegetarian');
            if (item.vegan) itemFilters.push('vegan');
            if (item.glutenFree) itemFilters.push('glutenFree');
            if (item.spicy) itemFilters.push('spicy');
            if (item.popular) itemFilters.push('popular');
            if (item.isSpecial) itemFilters.push('special');
            if (favorites.includes(item.id)) itemFilters.push('favorites');
            return selectedFilters.every(filter => itemFilters.includes(filter));
          }
          return true;
        })
      })).filter(category => category.items.length > 0);
    }
    // If searching, filter items by name or description (case-insensitive)
    const query = searchQuery.toLowerCase();
    return menuData.categories
      .map(category => ({
        ...category,
        items: category.items.filter(item => {
          if (item.available === false || (item.stock !== undefined && item.stock <= 0)) return false;
          const matchesName = item.name.toLowerCase().includes(query);
          const matchesDescription = item.description?.toLowerCase().includes(query);
          // Only match if name or description matches
          if (!matchesName && !matchesDescription) return false;
          // Dietary filters
          if (selectedFilters.length > 0) {
            const itemFilters = [];
            if (item.vegetarian) itemFilters.push('vegetarian');
            if (item.vegan) itemFilters.push('vegan');
            if (item.glutenFree) itemFilters.push('glutenFree');
            if (item.spicy) itemFilters.push('spicy');
            if (item.popular) itemFilters.push('popular');
            if (item.isSpecial) itemFilters.push('special');
            if (favorites.includes(item.id)) itemFilters.push('favorites');
            return selectedFilters.every(filter => itemFilters.includes(filter));
          }
          return true;
        })
      }))
      .filter(category => category.items.length > 0);
  }, [menuData, searchQuery, selectedFilters, favorites]);

  // Available filter options
  const filterOptions = [
    { id: 'vegetarian', label: '🌱 Vegetarian', count: 0 },
    { id: 'vegan', label: '🌿 Vegan', count: 0 },
    { id: 'glutenFree', label: '🌾 Gluten Free', count: 0 },
    { id: 'spicy', label: '🌶️ Spicy', count: 0 },
    { id: 'popular', label: '⭐ Popular', count: 0 },
    { id: 'special', label: '🏷️ Special Offers', count: 0 },
    { id: 'favorites', label: '❤️ Favorites', count: favorites.length },
  ];

  const formatPrice = (price: number, currency: string) => {
    // Format Iraqi Dinar prices appropriately
    if (currency === 'IQD') {
      return `${price.toLocaleString()} ${currency}`;
    }
    return `${currency}${(price / 1000).toFixed(2)}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const categoryVariants = {
    hidden: { 
      opacity: 0, 
      x: isRTL ? 50 : -50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring" as const,
        stiffness: 120,
        damping: 12
      }
    },
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        duration: 0.2,
        type: "spring" as const,
        stiffness: 400,
        damping: 10
      }
    }
  };

  const cardImageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        type: "spring" as const,
        stiffness: 200,
        damping: 15
      }
    }
  };

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
        <p className="text-muted-foreground">Failed to load menu</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Sticky Header with Language Switcher */}
      <header className="sticky top-0 z-50 bg-[#C62828] text-white py-4 px-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="German Doner Logo" className="h-10 w-auto rounded-none" style={{maxHeight: 40}} />
          <h1 className="text-2xl font-bold text-center flex-1">German Doner</h1>
        </div>
        {/* Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSwitch(lang.code)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-semibold transition-all duration-200
                ${selectedLang === lang.code ? 'bg-[#FFD54F] text-[#C62828] underline' : 'hover:bg-white/20'}
                ${isRTL ? 'ml-1' : 'mr-1'}
              `}
              aria-current={selectedLang === lang.code ? 'page' : undefined}
            >
              <span>{lang.label}</span>
              <span>{lang.flag}</span>
            </button>
          ))}
        </div>
      </header>

      {/* --- Search Input & Filters --- */}
      <div className="w-full flex flex-col items-center bg-background py-6 px-2 border-b">
        <div className="relative w-full max-w-md mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={isRTL ? "...ابحث في القائمة" : "Search menu..."}
            className={`w-full rounded-lg shadow px-4 py-2 border border-gray-200 focus:border-[#C62828] focus:ring-2 focus:ring-[#FFD54F] bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 ${isRTL ? 'text-right pr-10' : 'text-left pl-10'}`}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            aria-label="Search menu"
          />
          <Search className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} h-5 w-5 text-gray-400 pointer-events-none`} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-gray-400 hover:text-[#C62828] focus:outline-none`}
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        {/* Filter Button */}
        <div className="w-full max-w-md flex justify-end mb-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {isRTL ? "تصفية" : "Filters"}
            {selectedFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedFilters.length}
              </Badge>
            )}
          </Button>
        </div>
        {/* Filter Options */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-md mt-2 pt-2 border-t"
          >
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedFilters.includes(option.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedFilters(prev => 
                      prev.includes(option.id)
                        ? prev.filter(f => f !== option.id)
                        : [...prev, option.id]
                    );
                  }}
                  className="text-xs"
                >
                  {option.label}
                  {option.count > 0 && !selectedFilters.includes(option.id) && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {option.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            {selectedFilters.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFilters([])}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  {isRTL ? "مسح التصفية" : "Clear all filters"}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Restaurant Status & Info */}
      <motion.div 
        className="bg-card border-b"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-foreground font-medium">Open Now</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Closes at 11:00 PM</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Queen Towers, Erbil Iraq</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.8 (324 reviews)</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Debug: Print loaded categories */}
      <div className="text-xs text-gray-400 px-2 py-1 bg-yellow-50 border-b border-yellow-200">
        Loaded categories: {filteredCategories.map(cat => cat.name).join(', ')}
      </div>
      {/* Category Navigation */}
      <motion.div 
        className="bg-card border-b sticky top-[112px] z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="relative w-full">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
            {(filteredCategories || []).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <Button
                  variant={activeCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => scrollToCategory(category.id)}
                  className="whitespace-nowrap transition-all duration-300 hover:scale-105"
                >
                  {category.name} ({category.items.length})
                </Button>
              </motion.div>
            ))}
          </div>
          {/* Right-edge fade for scroll cue */}
          <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-card to-transparent" />
        </div>
      </motion.div>

      {/* Menu Sections */}
      <main ref={mainRef} className="container mx-auto px-2 py-6">
        {filteredCategories && filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <MenuSection
              key={category.id}
              category={category}
              currency={menuData.currency}
              isRTL={isRTL}
              favorites={favorites}
              onFavoriteToggle={toggleFavorite}
            />
          ))
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg text-gray-500">{searchQuery ? (isRTL ? "لا توجد نتائج مطابقة" : "No items found.") : (isRTL ? "القائمة فارغة" : "Menu is empty.")}</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}