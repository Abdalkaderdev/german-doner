import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock data - in real app this would come from analytics API
const hourlyOrdersData = [
  { hour: "9:00", orders: 5 },
  { hour: "10:00", orders: 12 },
  { hour: "11:00", orders: 28 },
  { hour: "12:00", orders: 45 },
  { hour: "13:00", orders: 52 },
  { hour: "14:00", orders: 38 },
  { hour: "15:00", orders: 22 },
  { hour: "16:00", orders: 18 },
  { hour: "17:00", orders: 25 },
  { hour: "18:00", orders: 42 },
  { hour: "19:00", orders: 48 },
  { hour: "20:00", orders: 35 },
  { hour: "21:00", orders: 20 },
  { hour: "22:00", orders: 8 }
];

const weeklyRevenueData = [
  { day: "Mon", revenue: 850 },
  { day: "Tue", revenue: 720 },
  { day: "Wed", revenue: 980 },
  { day: "Thu", revenue: 1100 },
  { day: "Fri", revenue: 1350 },
  { day: "Sat", revenue: 1520 },
  { day: "Sun", revenue: 1200 }
];

const popularItemsData = [
  { name: "Chicken Doner", value: 35, color: "hsl(var(--primary))" },
  { name: "Lamb Doner", value: 25, color: "hsl(var(--secondary))" },
  { name: "Mixed Doner", value: 20, color: "hsl(var(--accent))" },
  { name: "Vegetarian Wrap", value: 12, color: "hsl(var(--fresh-green))" },
  { name: "Falafel Plate", value: 8, color: "hsl(var(--muted-foreground))" }
];

export const AnalyticsDashboard = () => {
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
      {/* Hourly Orders Chart */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Today's Orders by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyOrdersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue Chart */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`€${value}`, 'Revenue']} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Popular Items Pie Chart */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={popularItemsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name} (${value}%)`}
                    >
                      {popularItemsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">89%</div>
              <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">18min</div>
              <div className="text-sm text-muted-foreground">Avg Preparation Time</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">€12.30</div>
              <div className="text-sm text-muted-foreground">Average Order Value</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-fresh-green">67%</div>
              <div className="text-sm text-muted-foreground">Repeat Customers</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
};