import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  MenuSquare, 
  TrendingUp, 
  Users,
  DollarSign,
  Package,
  AlertCircle,
  Clock
} from "lucide-react";
import { MenuManagement } from "@/components/admin/MenuManagement";
import { RestaurantSettings } from "@/components/admin/RestaurantSettings";
import { LiveUpdates } from "@/components/admin/LiveUpdates";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app this would come from API
  const stats = {
    totalOrders: 142,
    revenue: 2840,
    menuItems: 35,
    outOfStock: 3
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        className="bg-warm-gradient text-white p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🥙</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Berlin Doner Admin</h1>
              <p className="text-white/80">Restaurant Management Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <MenuSquare className="h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Live Updates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-warm transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{stats.totalOrders}</div>
                      <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-warm transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-secondary">€{stats.revenue}</div>
                      <p className="text-xs text-muted-foreground">+8% from yesterday</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-warm transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-accent">{stats.menuItems}</div>
                      <p className="text-xs text-muted-foreground">Active items</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-warm transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-destructive">{stats.outOfStock}</div>
                      <p className="text-xs text-muted-foreground">Items need attention</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <AnalyticsDashboard />
            </motion.div>
          </TabsContent>

          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>

          <TabsContent value="settings">
            <RestaurantSettings />
          </TabsContent>

          <TabsContent value="live">
            <LiveUpdates />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;