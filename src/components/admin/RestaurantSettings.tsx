import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Store, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Megaphone,
  Save,
  Upload,
  Plus,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RestaurantInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
}

interface Hours {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  active: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

export const RestaurantSettings = () => {
  const { toast } = useToast();
  
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: "Berlin Doner",
    description: "Authentic German-Turkish Cuisine. Fresh Made – Premium Quality",
    address: "Hauptstraße 123, 12345 Berlin, Germany",
    phone: "+49 30 12345678",
    email: "info@berlindoner.de",
    website: "www.berlindoner.de",
    logo: ""
  });

  const [hours, setHours] = useState<Hours>({
    monday: { open: "11:00", close: "22:00", closed: false },
    tuesday: { open: "11:00", close: "22:00", closed: false },
    wednesday: { open: "11:00", close: "22:00", closed: false },
    thursday: { open: "11:00", close: "22:00", closed: false },
    friday: { open: "11:00", close: "23:00", closed: false },
    saturday: { open: "11:00", close: "23:00", closed: false },
    sunday: { open: "12:00", close: "21:00", closed: false }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "New Menu Items Available!",
      message: "Try our new vegan options and fresh salads.",
      active: true,
      priority: "medium",
      createdAt: new Date().toISOString()
    }
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    priority: "medium" as "low" | "medium" | "high"
  });

  const daysOfWeek = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
  ];

  const saveRestaurantInfo = async () => {
    try {
      // In real app, this would save to backend
      toast({
        title: "Success",
        description: "Restaurant information updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update restaurant information",
        variant: "destructive"
      });
    }
  };

  const saveHours = async () => {
    try {
      // In real app, this would save to backend
      toast({
        title: "Success",
        description: "Operating hours updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update operating hours",
        variant: "destructive"
      });
    }
  };

  const addAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.message) {
      const announcement: Announcement = {
        id: Date.now().toString(),
        ...newAnnouncement,
        active: true,
        createdAt: new Date().toISOString()
      };
      
      setAnnouncements(prev => [announcement, ...prev]);
      setNewAnnouncement({ title: "", message: "", priority: "medium" });
      
      toast({
        title: "Success",
        description: "Announcement created successfully",
      });
    }
  };

  const toggleAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(ann => 
      ann.id === id ? { ...ann, active: !ann.active } : ann
    ));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    toast({
      title: "Success",
      description: "Announcement deleted successfully",
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
      {/* Restaurant Information */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Restaurant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  value={restaurantInfo.name}
                  onChange={(e) => setRestaurantInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={restaurantInfo.website}
                  onChange={(e) => setRestaurantInfo(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={restaurantInfo.description}
                onChange={(e) => setRestaurantInfo(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={restaurantInfo.address}
                onChange={(e) => setRestaurantInfo(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={restaurantInfo.phone}
                  onChange={(e) => setRestaurantInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={restaurantInfo.email}
                  onChange={(e) => setRestaurantInfo(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <div className="flex gap-2">
                <Input
                  id="logo"
                  value={restaurantInfo.logo}
                  onChange={(e) => setRestaurantInfo(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                />
                <Button variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button onClick={saveRestaurantInfo} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Restaurant Information
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Operating Hours */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Operating Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysOfWeek.map(day => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-24 capitalize font-medium">
                  {day}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Switch
                    checked={!hours[day].closed}
                    onCheckedChange={(checked) => 
                      setHours(prev => ({
                        ...prev,
                        [day]: { ...prev[day], closed: !checked }
                      }))
                    }
                  />
                  {!hours[day].closed ? (
                    <>
                      <Input
                        type="time"
                        value={hours[day].open}
                        onChange={(e) => 
                          setHours(prev => ({
                            ...prev,
                            [day]: { ...prev[day], open: e.target.value }
                          }))
                        }
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={hours[day].close}
                        onChange={(e) => 
                          setHours(prev => ({
                            ...prev,
                            [day]: { ...prev[day], close: e.target.value }
                          }))
                        }
                        className="w-32"
                      />
                    </>
                  ) : (
                    <span className="text-muted-foreground">Closed</span>
                  )}
                </div>
              </div>
            ))}
            
            <Button onClick={saveHours} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Operating Hours
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Announcements */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Announcements & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Create New Announcement */}
            <div className="p-4 border rounded-lg space-y-4">
              <h3 className="font-semibold">Create New Announcement</h3>
              <div>
                <Label htmlFor="announcement-title">Title</Label>
                <Input
                  id="announcement-title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter announcement title"
                />
              </div>
              <div>
                <Label htmlFor="announcement-message">Message</Label>
                <Textarea
                  id="announcement-message"
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter announcement message"
                  rows={3}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Label>Priority:</Label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="border rounded px-2 py-1"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <Button onClick={addAnnouncement}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Announcement
                </Button>
              </div>
            </div>

            <Separator />

            {/* Active Announcements */}
            <div className="space-y-4">
              <h3 className="font-semibold">Active Announcements</h3>
              {announcements.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No announcements yet. Create one above.
                </p>
              ) : (
                announcements.map(announcement => (
                  <motion.div
                    key={announcement.id}
                    className="p-4 border rounded-lg space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{announcement.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${
                            announcement.priority === 'high' ? 'bg-destructive text-destructive-foreground' :
                            announcement.priority === 'medium' ? 'bg-secondary text-secondary-foreground' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {announcement.priority}
                          </span>
                          {announcement.active && (
                            <span className="px-2 py-1 rounded text-xs bg-primary text-primary-foreground">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground">{announcement.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created: {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={announcement.active}
                          onCheckedChange={() => toggleAnnouncement(announcement.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAnnouncement(announcement.id)}
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