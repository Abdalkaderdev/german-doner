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
  EyeOff,
  Upload,
  Star,
  AlertTriangle,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export const MenuManagement = () => {
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [zoomName, setZoomName] = useState<string | null>(null);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ku", name: "Kurdish", flag: "🇮🇶" },
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
        available: true,
        stock: 50,
        isSpecial: false,
        specialPrice: 0,
        vegan: false,
        glutenFree: false,
        allergens: []
      }
    );
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.name && formData.description && formData.price) {
        saveMenuItem(categoryId, formData as MenuItem);
      }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingImage(true);
      try {
        // For demo purposes, we'll use a URL.createObjectURL
        // In a real app, you'd upload to cloud storage
        const imageUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, image: imageUrl }));
        
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive"
        });
      } finally {
        setUploadingImage(false);
      }
    };

    const handleAllergenToggle = (allergen: string) => {
      setFormData(prev => ({
        ...prev,
        allergens: prev.allergens?.includes(allergen)
          ? prev.allergens.filter(a => a !== allergen)
          : [...(prev.allergens || []), allergen]
      }));
    };

    const allergenOptions = [
      "Gluten", "Dairy", "Eggs", "Nuts", "Peanuts", "Soy", "Fish", "Shellfish", "Sesame"
    ];

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

        <div className="space-y-4">
          <Label>Image</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={formData.image || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="image-upload">Upload Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                )}
              </div>
            </div>
          </div>
          {formData.image && (
            <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted">
              <img 
                src={formData.image} 
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Switch
              id="available"
              checked={formData.available !== false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
            />
            <Label htmlFor="available">Available</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is-special"
              checked={formData.isSpecial || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSpecial: checked }))}
            />
            <Label htmlFor="is-special">Daily Special</Label>
          </div>
          
          {formData.isSpecial && (
            <div>
              <Label htmlFor="special-price">Special Price (€)</Label>
              <Input
                id="special-price"
                type="number"
                step="0.10"
                value={formData.specialPrice || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, specialPrice: parseFloat(e.target.value) }))}
                placeholder="Special offer price"
              />
            </div>
          )}
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
              id="spicy"
              checked={formData.spicy || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, spicy: checked }))}
            />
            <Label htmlFor="spicy">Spicy</Label>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Dietary Options</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="vegetarian"
                checked={formData.vegetarian || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, vegetarian: checked }))}
              />
              <Label htmlFor="vegetarian">Vegetarian</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="vegan"
                checked={formData.vegan || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, vegan: checked }))}
              />
              <Label htmlFor="vegan">Vegan</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="gluten-free"
                checked={formData.glutenFree || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, glutenFree: checked }))}
              />
              <Label htmlFor="gluten-free">Gluten Free</Label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Allergen Information</Label>
          <div className="grid grid-cols-3 gap-2">
            {allergenOptions.map(allergen => (
              <div key={allergen} className="flex items-center space-x-2">
                <Switch
                  checked={formData.allergens?.includes(allergen) || false}
                  onCheckedChange={() => handleAllergenToggle(allergen)}
                />
                <Label className="text-sm">{allergen}</Label>
              </div>
            ))}
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
                      className="group flex items-center justify-between p-6 border rounded-2xl hover:shadow-xl transition-all bg-[#f5f5f4] gap-4"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted cursor-zoom-in" onClick={() => { setZoomImage(require('../../assets/logo.jpg')); setZoomName(item.name); }}>
                          <img 
                            src={require('../../assets/logo.jpg')}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-xl truncate text-[#C62828]">{item.name}</h3>
                            <div className="flex items-center gap-2">
                              {item.isSpecial ? (
                                <div className="flex items-center gap-1">
                                  <span className="font-bold text-destructive line-through">€{item.price}</span>
                                  <span className="font-bold text-primary">€{item.specialPrice || item.price}</span>
                                  <Badge className="bg-berlin-gold text-white">
                                    <Star className="h-3 w-3 mr-1" />
                                    Special
                                  </Badge>
                                </div>
                              ) : (
                                <span className="font-bold text-primary">€{item.price}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-2 flex-wrap">
                            {item.popular && <Badge variant="secondary">Popular</Badge>}
                            {item.vegetarian && <Badge variant="outline" className="text-fresh-green border-fresh-green">Vegetarian</Badge>}
                            {item.vegan && <Badge variant="outline" className="text-fresh-green border-fresh-green">Vegan</Badge>}
                            {item.glutenFree && <Badge variant="outline" className="text-purple-600 border-purple-600">Gluten Free</Badge>}
                            {item.spicy && <Badge variant="outline" className="text-destructive border-destructive">Spicy</Badge>}
                            {item.allergens && item.allergens.length > 0 && (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Allergens
                              </Badge>
                            )}
                            {item.stock !== undefined && (
                              <Badge variant={item.stock > 10 ? "outline" : item.stock > 0 ? "secondary" : "destructive"}>
                                <Package className="h-3 w-3 mr-1" />
                                Stock: {item.stock}
                              </Badge>
                            )}
                          </div>
                          <p className="text-base text-gray-600 truncate mb-2">{item.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
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

      {zoomImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setZoomImage(null)}>
          <div className="relative bg-[#f5f5f4] rounded-lg shadow-lg max-w-md w-full mx-4 border border-[#f5f5f4]" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-red-500 focus:outline-none"
              onClick={() => setZoomImage(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <img src={zoomImage} alt={zoomName || ''} className="w-full h-72 object-contain rounded-t-lg bg-gray-100" />
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-[#C62828] mb-2">{zoomName}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};