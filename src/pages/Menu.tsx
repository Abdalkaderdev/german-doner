import { useState } from "react";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";

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

const menuData: Record<string, { categories: MenuCategory[], shopName: string, currency: string }> = {
  de: {
    shopName: "Deutscher Döner",
    currency: "€",
    categories: [
      {
        id: "doner",
        name: "Döner Kebab",
        items: [
          {
            id: "classic-doner",
            name: "Klassischer Döner",
            description: "Frisches Fladenbrot mit Hähnchen, Salat, Tomaten, Zwiebeln und Sauce",
            price: 6.50,
            popular: true
          },
          {
            id: "beef-doner",
            name: "Rindfleisch Döner",
            description: "Premium Rindfleisch mit frischen Zutaten und hausgemachter Sauce",
            price: 7.50,
            popular: true
          },
          {
            id: "veggie-doner",
            name: "Vegetarischer Döner",
            description: "Gegrilltes Gemüse, Falafel, frischer Salat und Tahini-Sauce",
            price: 6.00,
            vegetarian: true
          },
          {
            id: "spicy-doner",
            name: "Scharfer Döner",
            description: "Mit extra scharfer Sauce und jalapeños",
            price: 7.00,
            spicy: true
          }
        ]
      },
      {
        id: "durum",
        name: "Dürüm Wraps",
        items: [
          {
            id: "chicken-durum",
            name: "Hähnchen Dürüm",
            description: "Dünnes Fladenbrot gerollt mit Hähnchen und frischen Zutaten",
            price: 7.00
          },
          {
            id: "lamb-durum",
            name: "Lamm Dürüm",
            description: "Zartes Lammfleisch in dünnem Fladenbrot",
            price: 8.00
          }
        ]
      },
      {
        id: "sides",
        name: "Beilagen",
        items: [
          {
            id: "fries",
            name: "Pommes Frites",
            description: "Knusprige goldene Pommes",
            price: 3.50
          },
          {
            id: "hummus",
            name: "Hummus mit Brot",
            description: "Hausgemachter Hummus mit warmem Fladenbrot",
            price: 4.00,
            vegetarian: true
          },
          {
            id: "baklava",
            name: "Baklava",
            description: "Süßes türkisches Gebäck mit Nüssen und Honig",
            price: 3.00,
            vegetarian: true
          }
        ]
      },
      {
        id: "drinks",
        name: "Getränke",
        items: [
          {
            id: "ayran",
            name: "Ayran",
            description: "Türkisches Joghurtgetränk",
            price: 2.50
          },
          {
            id: "turkish-tea",
            name: "Türkischer Tee",
            description: "Traditioneller schwarzer Tee",
            price: 2.00
          },
          {
            id: "cola",
            name: "Cola",
            description: "Erfrischende Cola",
            price: 2.50
          }
        ]
      }
    ]
  },
  en: {
    shopName: "German Doner",
    currency: "€",
    categories: [
      {
        id: "doner",
        name: "Doner Kebab",
        items: [
          {
            id: "classic-doner",
            name: "Classic Doner",
            description: "Fresh pita bread with chicken, lettuce, tomatoes, onions and sauce",
            price: 6.50,
            popular: true
          },
          {
            id: "beef-doner",
            name: "Beef Doner",
            description: "Premium beef with fresh ingredients and homemade sauce",
            price: 7.50,
            popular: true
          },
          {
            id: "veggie-doner",
            name: "Vegetarian Doner",
            description: "Grilled vegetables, falafel, fresh salad and tahini sauce",
            price: 6.00,
            vegetarian: true
          },
          {
            id: "spicy-doner",
            name: "Spicy Doner",
            description: "With extra spicy sauce and jalapeños",
            price: 7.00,
            spicy: true
          }
        ]
      },
      {
        id: "durum",
        name: "Dürüm Wraps",
        items: [
          {
            id: "chicken-durum",
            name: "Chicken Dürüm",
            description: "Thin flatbread rolled with chicken and fresh ingredients",
            price: 7.00
          },
          {
            id: "lamb-durum",
            name: "Lamb Dürüm",
            description: "Tender lamb meat in thin flatbread",
            price: 8.00
          }
        ]
      },
      {
        id: "sides",
        name: "Sides",
        items: [
          {
            id: "fries",
            name: "French Fries",
            description: "Crispy golden fries",
            price: 3.50
          },
          {
            id: "hummus",
            name: "Hummus with Bread",
            description: "Homemade hummus with warm pita bread",
            price: 4.00,
            vegetarian: true
          },
          {
            id: "baklava",
            name: "Baklava",
            description: "Sweet Turkish pastry with nuts and honey",
            price: 3.00,
            vegetarian: true
          }
        ]
      },
      {
        id: "drinks",
        name: "Drinks",
        items: [
          {
            id: "ayran",
            name: "Ayran",
            description: "Turkish yogurt drink",
            price: 2.50
          },
          {
            id: "turkish-tea",
            name: "Turkish Tea",
            description: "Traditional black tea",
            price: 2.00
          },
          {
            id: "cola",
            name: "Cola",
            description: "Refreshing cola",
            price: 2.50
          }
        ]
      }
    ]
  },
  tr: {
    shopName: "Alman Döner",
    currency: "€",
    categories: [
      {
        id: "doner",
        name: "Döner Kebab",
        items: [
          {
            id: "classic-doner",
            name: "Klasik Döner",
            description: "Taze pide ekmeği ile tavuk, marul, domates, soğan ve sos",
            price: 6.50,
            popular: true
          },
          {
            id: "beef-doner",
            name: "Dana Döner",
            description: "Premium dana eti ile taze malzemeler ve ev yapımı sos",
            price: 7.50,
            popular: true
          },
          {
            id: "veggie-doner",
            name: "Vejetaryen Döner",
            description: "Izgara sebzeler, falafel, taze salata ve tahin sosu",
            price: 6.00,
            vegetarian: true
          },
          {
            id: "spicy-doner",
            name: "Acılı Döner",
            description: "Ekstra acı sos ve jalapeño ile",
            price: 7.00,
            spicy: true
          }
        ]
      },
      {
        id: "durum",
        name: "Dürüm",
        items: [
          {
            id: "chicken-durum",
            name: "Tavuk Dürüm",
            description: "İnce lavaş ile sarılmış tavuk ve taze malzemeler",
            price: 7.00
          },
          {
            id: "lamb-durum",
            name: "Kuzu Dürüm",
            description: "Yumuşak kuzu eti ince lavaş içinde",
            price: 8.00
          }
        ]
      },
      {
        id: "sides",
        name: "Yan Ürünler",
        items: [
          {
            id: "fries",
            name: "Patates Kızartması",
            description: "Çıtır altın patates",
            price: 3.50
          },
          {
            id: "hummus",
            name: "Humus ve Ekmek",
            description: "Ev yapımı humus ile sıcak pide",
            price: 4.00,
            vegetarian: true
          },
          {
            id: "baklava",
            name: "Baklava",
            description: "Fındıklı ve ballı Türk tatlısı",
            price: 3.00,
            vegetarian: true
          }
        ]
      },
      {
        id: "drinks",
        name: "İçecekler",
        items: [
          {
            id: "ayran",
            name: "Ayran",
            description: "Türk yoğurt içeceği",
            price: 2.50
          },
          {
            id: "turkish-tea",
            name: "Türk Çayı",
            description: "Geleneksel siyah çay",
            price: 2.00
          },
          {
            id: "cola",
            name: "Kola",
            description: "Serinletici kola",
            price: 2.50
          }
        ]
      }
    ]
  }
};

export default function Menu() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("doner");

  const currentLanguage = lang || "de";
  const menuInfo = menuData[currentLanguage] || menuData.de;

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
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
    return Object.entries(cart).reduce((total, [itemId, count]) => {
      const item = menuInfo.categories
        .flatMap(cat => cat.items)
        .find(item => item.id === itemId);
      return total + (item ? item.price * count : 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-hero-gradient backdrop-blur-md border-b border-white/10">
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
              <h1 className="text-2xl font-bold text-white">{menuInfo.shopName}</h1>
            </div>
            
            {getTotalItems() > 0 && (
              <Button variant="hero" className="relative">
                <ShoppingCart className="h-4 w-4" />
                <span className="ml-2">{menuInfo.currency}{getTotalPrice().toFixed(2)}</span>
                <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                  {getTotalItems()}
                </Badge>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-card border-b sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {menuInfo.categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-6">
        {menuInfo.categories
          .filter(category => selectedCategory === category.id)
          .map((category) => (
            <div key={category.id}>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                {category.name}
              </h2>
              
              <div className="grid gap-4 md:gap-6">
                {category.items.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-foreground">
                              {item.name}
                            </h3>
                            {item.popular && (
                              <Badge className="bg-accent text-accent-foreground">
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
                          
                          <div className="text-2xl font-bold text-primary">
                            {menuInfo.currency}{item.price.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {cart[item.id] > 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {cart[item.id] > 0 && (
                            <span className="w-8 text-center font-semibold">
                              {cart[item.id]}
                            </span>
                          )}
                          
                          <Button
                            size="sm"
                            onClick={() => addToCart(item.id)}
                            variant="default"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}