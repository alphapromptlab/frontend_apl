import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, Users, Zap, Target } from "lucide-react";

const stats = [
  {
    title: "Total Projects",
    value: "24",
    change: "+12%",
    icon: Target,
    trend: "up",
    gradient: "from-blue-400 to-blue-600"
  },
  {
    title: "Active Users",
    value: "1,234",
    change: "+23%",
    icon: Users,
    trend: "up",
    gradient: "from-green-400 to-green-600"
  },
  {
    title: "Tools Used",
    value: "89",
    change: "+5%",
    icon: Zap,
    trend: "up",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    title: "Success Rate",
    value: "94%",
    change: "+2%",
    icon: TrendingUp,
    trend: "up",
    gradient: "from-purple-400 to-purple-600"
  }
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.1 * index, 
            ease: "easeOut" 
          }}
          whileHover={{ 
            scale: 1.02,
            y: -5,
            transition: { duration: 0.2 }
          }}
        >
          <Card className="glass-card border-0 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + (0.1 * index) }}
              >
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (0.1 * index) }}
                className="relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className={`relative p-2 rounded-full bg-gradient-to-r ${stat.gradient}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (0.1 * index) }}
                className="text-2xl font-bold"
              >
                {stat.value}
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (0.1 * index) }}
                className="text-xs text-muted-foreground"
              >
                <span className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent font-medium`}>
                  {stat.change}
                </span> from last month
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}