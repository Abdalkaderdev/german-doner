import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  popular?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
  available?: boolean;
}

export default function MenuEditor() {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Mock menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Classic Doner",
      description: "Fresh pita bread with chicken, lettuce, tomatoes, onions and sauce",
      price: 10000,
      popular: true,
      available: true
    },
    {
      id: "2", 
      name: "Vegetarian Doner",
      description: "Grilled vegetables, falafel, fresh salad and tahini sauce",
      price: 9500,
      vegetarian: true,
      available: true
    },
    {
      id: "3",
      name: "Spicy Doner", 
      description: "With extra spicy sauce and jalapeños",
      price: 11000,
      spicy: true,
      available: false
    }
  ]);

  const handleSaveItem = (item: MenuItem) => {
    if (isAddingNew) {
      const newItem = { ...item, id: Date.now().toString() };
      setMenuItems(prev => [...prev, newItem]);
      toast({
        title: "Item added",
        description: `${item.name} has been added to the menu`,
      });
    } else {
      setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
      toast({
        title: "Item updated",
        description: `${item.name} has been updated`,
      });
    }
    
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleDeleteItem = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    setMenuItems(prev => prev.filter(i => i.id !== id));
    toast({
      title: "Item deleted",
      description: `${item?.name} has been removed from the menu`,
      variant: "destructive"
    });
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, available: !item.available }
        : item
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Editor</h2>
        <Button 
          onClick={() => {
            setIsAddingNew(true);
            setEditingItem({
              id: "",
              name: "",
              description: "",
              price: 0,
              available: true
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <div className="grid gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="relative">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <div className="flex gap-1">
                      {item.popular && <Badge className="bg-berlin-gold text-white">Popular</Badge>}
                      {item.vegetarian && <Badge className="bg-fresh-green text-white">Vegetarian</Badge>}
                      {item.spicy && <Badge className="bg-destructive">Spicy</Badge>}
                      {!item.available && <Badge variant="secondary">Unavailable</Badge>}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-2">{item.description}</p>
                  <p className="text-xl font-bold text-primary">{item.price.toLocaleString()} IQD</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`available-${item.id}`} className="text-sm">
                      Available
                    </Label>
                    <Switch
                      id={`available-${item.id}`}
                      checked={item.available}
                      onCheckedChange={() => handleToggleAvailability(item.id)}
                    />
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>
                {isAddingNew ? "Add New Menu Item" : "Edit Menu Item"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, name: e.target.value} : null)}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, description: e.target.value} : null)}
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price (IQD)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, price: parseInt(e.target.value) || 0} : null)}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="popular"
                    checked={editingItem.popular || false}
                    onCheckedChange={(checked) => setEditingItem(prev => prev ? {...prev, popular: checked} : null)}
                  />
                  <Label htmlFor="popular">Popular</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="vegetarian"
                    checked={editingItem.vegetarian || false}
                    onCheckedChange={(checked) => setEditingItem(prev => prev ? {...prev, vegetarian: checked} : null)}
                  />
                  <Label htmlFor="vegetarian">Vegetarian</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="spicy"
                    checked={editingItem.spicy || false}
                    onCheckedChange={(checked) => setEditingItem(prev => prev ? {...prev, spicy: checked} : null)}
                  />
                  <Label htmlFor="spicy">Spicy</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddingNew(false);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={() => handleSaveItem(editingItem)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}