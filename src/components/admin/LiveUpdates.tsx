import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Star, 
  Package, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OutOfStockItem {
  id: string;
  name: string;
  category: string;
  estimatedReturn: string;
  notifiedAt: string;
}

interface DailySpecial {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  specialPrice: number;
  discount: number;
  validUntil: string;
  active: boolean;
}

interface LiveStatus {
  isRestaurantOpen: boolean;
  currentOrders: number;
  waitTime: number;
  lastUpdate: string;
}

export const LiveUpdates = () => {
  const { toast } = useToast();
  
  const [outOfStockItems, setOutOfStockItems] = useState<OutOfStockItem[]>([
    {
      id: "1",
      name: "Lamb Doner",
      category: "Doner Kebab",
      estimatedReturn: "2024-01-15T14:00",
      notifiedAt: new Date().toISOString()
    },
    {
      id: "2", 
      name: "Ayran",
      category: "Beverages",
      estimatedReturn: "2024-01-15T12:00",
      notifiedAt: new Date().toISOString()
    }
  ]);

  const [dailySpecials, setDailySpecials] = useState<DailySpecial[]>([
    {
      id: "1",
      name: "Monday Special - Chicken Doner Plate",
      description: "Complete chicken doner plate with rice, salad and sauce",
      originalPrice: 12.50,
      specialPrice: 9.99,
      discount: 20,
      validUntil: "2024-01-15T23:59",
      active: true
    }
  ]);

  const [liveStatus, setLiveStatus] = useState<LiveStatus>({
    isRestaurantOpen: true,
    currentOrders: 12,
    waitTime: 15,
    lastUpdate: new Date().toISOString()
  });

  const [newSpecial, setNewSpecial] = useState({
    name: "",
    description: "",
    originalPrice: 0,
    specialPrice: 0,
    validUntil: ""
  });

  // Auto-update live status every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStatus(prev => ({
        ...prev,
        currentOrders: Math.max(0, prev.currentOrders + Math.floor(Math.random() * 3) - 1),
        waitTime: Math.max(5, prev.waitTime + Math.floor(Math.random() * 6) - 2),
        lastUpdate: new Date().toISOString()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const toggleRestaurantStatus = () => {
    setLiveStatus(prev => ({
      ...prev,
      isRestaurantOpen: !prev.isRestaurantOpen,
      lastUpdate: new Date().toISOString()
    }));

    toast({
      title: "Status Updated",
      description: `Restaurant is now ${!liveStatus.isRestaurantOpen ? 'OPEN' : 'CLOSED'}`,
    });
  };

  const updateWaitTime = (newWaitTime: number) => {
    setLiveStatus(prev => ({
      ...prev,
      waitTime: newWaitTime,
      lastUpdate: new Date().toISOString()
    }));

    toast({
      title: "Wait Time Updated",
      description: `New estimated wait time: ${newWaitTime} minutes`,
    });
  };

  const removeOutOfStockItem = (id: string) => {
    setOutOfStockItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item Restored",
      description: "Item is now available again",
    });
  };

  const addDailySpecial = () => {
    if (newSpecial.name && newSpecial.originalPrice && newSpecial.specialPrice) {
      const discount = Math.round(((newSpecial.originalPrice - newSpecial.specialPrice) / newSpecial.originalPrice) * 100);
      
      const special: DailySpecial = {
        id: Date.now().toString(),
        ...newSpecial,
        discount,
        active: true
      };

      setDailySpecials(prev => [special, ...prev]);
      setNewSpecial({ name: "", description: "", originalPrice: 0, specialPrice: 0, validUntil: "" });
      
      toast({
        title: "Special Added",
        description: "Daily special created successfully",
      });
    }
  };

  const toggleSpecial = (id: string) => {
    setDailySpecials(prev => prev.map(special => 
      special.id === id ? { ...special, active: !special.active } : special
    ));
  };

  const deleteSpecial = (id: string) => {
    setDailySpecials(prev => prev.filter(special => special.id !== id));
    toast({
      title: "Special Deleted",
      description: "Daily special removed successfully",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Live Restaurant Status */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Live Restaurant Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Restaurant Status</p>
                  <p className="font-semibold">
                    {liveStatus.isRestaurantOpen ? "OPEN" : "CLOSED"}
                  </p>
                </div>
                <Switch
                  checked={liveStatus.isRestaurantOpen}
                  onCheckedChange={toggleRestaurantStatus}
                />
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Current Orders</p>
                <p className="text-2xl font-bold text-primary">{liveStatus.currentOrders}</p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Wait Time</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={liveStatus.waitTime}
                    onChange={(e) => updateWaitTime(parseInt(e.target.value) || 0)}
                    className="w-20"
                    min="0"
                  />
                  <span className="text-sm">minutes</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Last updated: {new Date(liveStatus.lastUpdate).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Out of Stock Management */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Out of Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {outOfStockItems.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-primary mb-2" />
                <p className="text-muted-foreground">All items are in stock!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {outOfStockItems.map(item => (
                  <motion.div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <p className="text-sm text-muted-foreground">
                        Expected back: {new Date(item.estimatedReturn).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeOutOfStockItem(item.id)}
                    >
                      Mark Available
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Specials */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Daily Specials & Promotions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Create New Special */}
            <div className="p-4 border rounded-lg space-y-4">
              <h3 className="font-semibold">Create New Special</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="special-name">Special Name</Label>
                  <Input
                    id="special-name"
                    value={newSpecial.name}
                    onChange={(e) => setNewSpecial(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Monday Special - Chicken Plate"
                  />
                </div>
                <div>
                  <Label htmlFor="special-valid">Valid Until</Label>
                  <Input
                    id="special-valid"
                    type="datetime-local"
                    value={newSpecial.validUntil}
                    onChange={(e) => setNewSpecial(prev => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="special-description">Description</Label>
                <Textarea
                  id="special-description"
                  value={newSpecial.description}
                  onChange={(e) => setNewSpecial(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the special offer"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="original-price">Original Price (€)</Label>
                  <Input
                    id="original-price"
                    type="number"
                    step="0.10"
                    value={newSpecial.originalPrice || ""}
                    onChange={(e) => setNewSpecial(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="special-price">Special Price (€)</Label>
                  <Input
                    id="special-price"
                    type="number"
                    step="0.10"
                    value={newSpecial.specialPrice || ""}
                    onChange={(e) => setNewSpecial(prev => ({ ...prev, specialPrice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <Button onClick={addDailySpecial} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Special
              </Button>
            </div>

            <Separator />

            {/* Active Specials */}
            <div className="space-y-4">
              <h3 className="font-semibold">Active Specials</h3>
              {dailySpecials.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No active specials. Create one above.
                </p>
              ) : (
                dailySpecials.map(special => (
                  <motion.div
                    key={special.id}
                    className="p-4 border rounded-lg space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{special.name}</h4>
                          <Badge variant={special.active ? "default" : "secondary"}>
                            {special.active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="text-secondary">
                            {special.discount}% OFF
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{special.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="line-through text-muted-foreground">€{special.originalPrice}</span>
                          <span className="font-bold text-primary">€{special.specialPrice}</span>
                          <span className="text-muted-foreground">
                            Valid until: {new Date(special.validUntil).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={special.active}
                          onCheckedChange={() => toggleSpecial(special.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSpecial(special.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};