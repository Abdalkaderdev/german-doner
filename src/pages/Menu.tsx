import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useScrollCategory } from "@/hooks/useScrollCategory";

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
  halal?: boolean;
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isRTL, setIsRTL] = useState(false);
  
  const categoryRefs = useRef<Map<string, HTMLElement>>(new Map());
  const { activeCategory, scrollToCategory, observeCategory } = useScrollCategory({
    categories: menuData?.categories.map(cat => cat.id) || []
  });

  // Load menu data based on selected language
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const selectedLang = localStorage.getItem('selectedLanguage') || 'en';
        setCurrentLanguage(selectedLang);
        setIsRTL(selectedLang === 'ar');
        
        // Update document direction for RTL
        document.documentElement.dir = selectedLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = selectedLang;

        const response = await fetch(`/menu_${selectedLang}.json`);
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
  }, [toast]);

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
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Sticky Header */}
      <motion.div 
        className="sticky top-0 z-50 bg-warm-gradient backdrop-blur-md border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <motion.h1 
                className="text-2xl font-bold text-white"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {menuData.shopName}
              </motion.h1>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Navigation */}
      <motion.div 
        className="bg-card border-b sticky top-[73px] z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {menuData.categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <Button
                  variant={activeCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => scrollToCategory(category.id)}
                  className="whitespace-nowrap transition-all duration-300 hover:scale-105"
                >
                  {category.name}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-6">
        <motion.div 
          className="space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {menuData.categories.map((category, categoryIndex) => (
            <motion.section
              key={category.id}
              id={`category-${category.id}`}
              ref={(el) => {
                if (el) {
                  categoryRefs.current.set(category.id, el);
                  // Set up intersection observer
                  const cleanup = observeCategory(category.id, el);
                  return cleanup;
                }
              }}
              variants={categoryVariants}
              className="scroll-mt-36"
            >
              <motion.h2 
                className="text-4xl font-bold mb-8 text-foreground"
                variants={categoryVariants}
              >
                {category.name}
              </motion.h2>
              
              <motion.div 
                className="grid gap-6 md:gap-8"
                variants={containerVariants}
              >
                {category.items.filter(item => item.available !== false && (item.stock === undefined || item.stock > 0)).map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover="hover"
                    custom={index}
                  >
                    <Card className="overflow-hidden hover:shadow-warm transition-all duration-300 border-border/50 hover:border-primary/30">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Image Section */}
                          <div className="md:w-48 h-48 md:h-32 relative overflow-hidden bg-muted flex-shrink-0">
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
                            <div className={`absolute inset-0 flex items-center justify-center bg-muted ${item.image ? 'hidden' : ''}`}>
                              <div className="text-center">
                                <ImageOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">No Image</p>
                              </div>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <h3 className="text-xl font-semibold text-foreground">
                                    {item.name}
                                  </h3>
                                  {item.popular && (
                                    <Badge className="bg-berlin-gold text-white">
                                      Popular
                                    </Badge>
                                  )}
                                  {item.spicy && (
                                    <Badge className="bg-destructive text-destructive-foreground">
                                      🌶️ Spicy
                                    </Badge>
                                  )}
                                  {item.vegetarian && (
                                    <Badge className="bg-fresh-green text-white">
                                      🌱 Vegetarian
                                    </Badge>
                                  )}
                                  {item.vegan && (
                                    <Badge className="bg-fresh-green text-white">
                                      🌿 Vegan  
                                    </Badge>
                                  )}
                                  {item.halal && (
                                    <Badge className="bg-blue-600 text-white">
                                      ☪️ Halal
                                    </Badge>
                                  )}
                                  {item.glutenFree && (
                                    <Badge className="bg-purple-600 text-white">
                                      🌾 Gluten Free
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-muted-foreground mb-4 leading-relaxed">
                                  {item.description}
                                </p>
                                
                                <div className="text-2xl font-bold text-primary">
                                  {item.isSpecial ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-destructive line-through text-lg">
                                        {formatPrice(item.price, menuData.currency)}
                                      </span>
                                      <span className="text-primary">
                                        {formatPrice(item.specialPrice || item.price, menuData.currency)}
                                      </span>
                                      <Badge className="bg-berlin-gold text-white">Special!</Badge>
                                    </div>
                                  ) : (
                                    <span>{formatPrice(item.price, menuData.currency)}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          ))}
        </motion.div>
      </div>
    </div>
  );
}