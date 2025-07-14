import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp,
  Package,
  Clock,
  Star,
  AlertCircle,
  LogOut,
  Edit3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MenuManagement } from "@/components/admin/MenuManagement";
import { RestaurantSettings } from "@/components/admin/RestaurantSettings";
import { LiveUpdates } from "@/components/admin/LiveUpdates";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import MenuEditor from "@/components/admin/MenuEditor";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    const loginTime = localStorage.getItem("adminLoginTime");
    
    if (!isLoggedIn || !loginTime) {
      navigate("/admin/login");
      return;
    }

    // Check if login is older than 24 hours
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (Date.now() - parseInt(loginTime) > twentyFourHours) {
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("adminLoginTime");
      navigate("/admin/login");
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminLoginTime");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  // Mock data - in a real app, this would come from an API
  const stats = [
    { title: "Total Orders", value: "1,234", change: "+12%", icon: Package },
    { title: "Revenue", value: "2.4M IQD", change: "+8%", icon: DollarSign },
    { title: "Customers", value: "892", change: "+15%", icon: Users },
    { title: "Rating", value: "4.8", change: "+0.2", icon: Star },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          className="bg-warm-gradient text-white p-8 rounded-lg mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center">
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-2">Restaurant Dashboard</h1>
              <p className="text-white/80">Manage your restaurant operations</p>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white border-white/30">
                Admin Panel
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="editor">Menu Editor</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="live">Live Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <motion.div 
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {stats.map((stat) => (
                <motion.div key={stat.title} variants={itemVariants}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">{stat.change}</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Analytics Dashboard */}
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <MenuManagement />
          </TabsContent>

          <TabsContent value="editor" className="space-y-4">
            <MenuEditor />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <RestaurantSettings />
          </TabsContent>

          <TabsContent value="live" className="space-y-4">
            <LiveUpdates />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}