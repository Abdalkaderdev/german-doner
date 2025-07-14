import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Save,
  Languages,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const MenuManagement = () => {
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "ar", name: "العربية", flag: "🇸🇾" }
  ];

  // Load menu data
  useEffect(() => {
    loadMenuData();
  }, [selectedLanguage]);

  const loadMenuData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/menu_${selectedLanguage}.json`);
      const data = await response.json();
      setMenuData(data.categories || []);
    } catch (error) {
      console.error("Error loading menu:", error);
      toast({
        title: "Error",
        description: "Failed to load menu data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveMenuItem = async (categoryId: string, item: MenuItem) => {
    try {
      // Update local state
      setMenuData(prev => prev.map(category => 
        category.id === categoryId 
          ? {
              ...category,
              items: editingItem 
                ? category.items.map(i => i.id === item.id ? item : i)
                : [...category.items, { ...item, id: Date.now().toString() }]
            }
          : category
      ));

      // In a real app, this would save to backend/database
      // For now, we'll show success message
      toast({
        title: "Success",
        description: `Menu item ${editingItem ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive"
      });
    }
  };

  const deleteMenuItem = async (categoryId: string, itemId: string) => {
    try {
      setMenuData(prev => prev.map(category => 
        category.id === categoryId 
          ? { ...category, items: category.items.filter(i => i.id !== itemId) }
          : category
      ));

      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive"
      });
    }
  };

  const toggleItemAvailability = async (categoryId: string, itemId: string) => {
    try {
      setMenuData(prev => prev.map(category => 
        category.id === categoryId 
          ? {
              ...category,
              items: category.items.map(item => 
                item.id === itemId 
                  ? { ...item, available: !item.available }
                  : item
              )
            }
          : category
      ));

      toast({
        title: "Success",
        description: "Item availability updated",
      });
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const ItemForm = ({ categoryId }: { categoryId: string }) => {
    const [formData, setFormData] = useState<Partial<MenuItem>>(
      editingItem || {
        name: "",
        description: "",
        price: 0,
        image: "",
        popular: false,
        vegetarian: false,
        spicy: false,
        available: true
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.name && formData.description && formData.price) {
        saveMenuItem(categoryId, formData as MenuItem);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price (€)</Label>
            <Input
              id="price"
              type="number"
              step="0.10"
              value={formData.price || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="image">Image URL (optional)</Label>
          <Input
            id="image"
            value={formData.image || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="popular"
              checked={formData.popular || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
            />
            <Label htmlFor="popular">Popular Item</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="vegetarian"
              checked={formData.vegetarian || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, vegetarian: checked }))}
            />
            <Label htmlFor="vegetarian">Vegetarian</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="spicy"
              checked={formData.spicy || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, spicy: checked }))}
            />
            <Label htmlFor="spicy">Spicy</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={formData.available !== false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
            />
            <Label htmlFor="available">Available</Label>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {editingItem ? "Update Item" : "Create Item"}
          </Button>
        </DialogFooter>
      </form>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Language Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Select Language to Manage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <TabsList>
              {languages.map(lang => (
                <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  {lang.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Menu Categories */}
      <div className="space-y-6">
        {menuData.map(category => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => setEditingItem(null)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingItem ? "Edit Item" : "Add New Item"}
                        </DialogTitle>
                      </DialogHeader>
                      <ItemForm categoryId={category.id} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {category.items.map(item => (
                    <motion.div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <span className="font-bold text-primary">€{item.price}</span>
                            {item.popular && <Badge variant="secondary">Popular</Badge>}
                            {item.vegetarian && <Badge variant="outline" className="text-fresh-green border-fresh-green">Vegetarian</Badge>}
                            {item.spicy && <Badge variant="outline" className="text-destructive border-destructive">Spicy</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleItemAvailability(category.id, item.id)}
                          className={item.available === false ? "text-destructive" : "text-muted-foreground"}
                        >
                          {item.available === false ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingItem(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Item</DialogTitle>
                            </DialogHeader>
                            <ItemForm categoryId={category.id} />
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMenuItem(category.id, item.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};