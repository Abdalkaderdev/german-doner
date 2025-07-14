import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, Plus, Minus, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  spicy?: boolean;
  vegetarian?: boolean;
  popular?: boolean;
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
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("doner");
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isRTL, setIsRTL] = useState(false);

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
        
        // Set first category as default
        if (data.categories && data.categories.length > 0) {
          setSelectedCategory(data.categories[0].id);
        }
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

  const addToCart = (itemId: string, itemName: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
    
    toast({
      title: "Added to cart",
      description: `${itemName} has been added to your cart`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    if (!menuData) return 0;
    return Object.entries(cart).reduce((total, [itemId, count]) => {
      const item = menuData.categories
        .flatMap(cat => cat.items)
        .find(item => item.id === itemId);
      return total + (item ? item.price * count : 0);
    }, 0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const cardImageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
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
            
            <AnimatePresence>
              {getTotalItems() > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Button variant="secondary" className="relative shadow-warm">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="ml-2">{menuData.currency}{getTotalPrice().toFixed(2)}</span>
                    <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                      {getTotalItems()}
                    </Badge>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
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
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
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
        <AnimatePresence mode="wait">
          {menuData.categories
            .filter(category => selectedCategory === category.id)
            .map((category) => (
              <motion.div 
                key={category.id}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
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
                  {category.items.map((item, index) => (
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
                                  </div>
                                  
                                  <p className="text-muted-foreground mb-4 leading-relaxed">
                                    {item.description}
                                  </p>
                                  
                                  <div className="text-2xl font-bold text-primary mb-4">
                                    {menuData.currency}{item.price.toFixed(2)}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <AnimatePresence>
                                    {cart[item.id] > 0 && (
                                      <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                      >
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => removeFromCart(item.id)}
                                          className="h-10 w-10 p-0"
                                        >
                                          <Minus className="h-4 w-4" />
                                        </Button>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                  
                                  <AnimatePresence>
                                    {cart[item.id] > 0 && (
                                      <motion.span
                                        className="w-8 text-center font-semibold"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        key={cart[item.id]}
                                      >
                                        {cart[item.id]}
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                  
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button
                                      size="sm"
                                      onClick={() => addToCart(item.id, item.name)}
                                      className="h-10 shadow-warm"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}