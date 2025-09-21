import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  FileText, 
  Video, 
  Music, 
  ImageIcon, 
  Share2, 
  Search,
  Calendar,
  Edit
} from "lucide-react";
import { useState } from "react";

const tools = [
  {
    title: "Content Generator",
    description: "Create engaging content with AI assistance",
    icon: Edit,
    badge: "Popular",
    color: "from-blue-500 to-blue-600",
    hoverColor: "from-blue-400 to-blue-500"
  },
  {
    title: "Post Generator",
    description: "Generate social media posts instantly",
    icon: FileText,
    badge: "New",
    color: "from-green-500 to-green-600",
    hoverColor: "from-green-400 to-green-500"
  },
  {
    title: "Video Generator",
    description: "Create videos from text prompts",
    icon: Video,
    badge: "Beta",
    color: "from-purple-500 to-purple-600",
    hoverColor: "from-purple-400 to-purple-500"
  },
  {
    title: "Audio Generator",
    description: "Generate music and sound effects",
    icon: Music,
    badge: "Pro",
    color: "from-orange-500 to-orange-600",
    hoverColor: "from-orange-400 to-orange-500"
  },
  {
    title: "Image Editor",
    description: "Edit and enhance images with AI",
    icon: ImageIcon,
    badge: "Updated",
    color: "from-pink-500 to-pink-600",
    hoverColor: "from-pink-400 to-pink-500"
  },
  {
    title: "Social Media Scheduler",
    description: "Schedule posts across platforms",
    icon: Share2,
    badge: "Popular",
    color: "from-indigo-500 to-indigo-600",
    hoverColor: "from-indigo-400 to-indigo-500"
  },
  {
    title: "Research Tool",
    description: "Gather insights and data quickly",
    icon: Search,
    badge: "New",
    color: "from-teal-500 to-teal-600",
    hoverColor: "from-teal-400 to-teal-500"
  },
  {
    title: "Campaign Planner",
    description: "Plan and organize marketing campaigns",
    icon: Calendar,
    badge: "Pro",
    color: "from-red-500 to-red-600",
    hoverColor: "from-red-400 to-red-500"
  }
];

export function ToolCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {tools.map((tool, index) => (
        <motion.div
          key={tool.title}
          initial={{ opacity: 0, y: 30, rotateY: -15 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ 
            duration: 0.7, 
            delay: 0.1 * index, 
            ease: [0.215, 0.61, 0.355, 1] 
          }}
          whileHover={{ 
            scale: 1.05,
            y: -12,
            rotateY: 5,
            transition: { 
              duration: 0.4,
              ease: [0.215, 0.61, 0.355, 1]
            }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { duration: 0.1 }
          }}
          onHoverStart={() => setHoveredCard(index)}
          onHoverEnd={() => setHoveredCard(null)}
          style={{ perspective: 1000 }}
        >
          <Card className="glass-card border-0 hover:shadow-2xl transition-all duration-700 relative overflow-hidden group h-full">
            {/* Multi-layer background gradients */}
            <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-5 group-hover:opacity-15 transition-opacity duration-700`} />
            <div className={`absolute inset-0 bg-gradient-to-tl ${tool.hoverColor} opacity-0 group-hover:opacity-8 transition-opacity duration-700`} />
            
            {/* Multiple floating orb effects */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${tool.hoverColor} rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-all duration-1000 transform group-hover:scale-125 group-hover:translate-x-2 group-hover:-translate-y-2`} />
            <div className={`absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr ${tool.color} rounded-full blur-2xl opacity-0 group-hover:opacity-15 transition-all duration-900 transform group-hover:scale-110 group-hover:-translate-x-1 group-hover:translate-y-1`} />
            <div className={`absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r ${tool.hoverColor} rounded-full blur-xl opacity-0 group-hover:opacity-10 transition-all duration-800 transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-150`} />
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="pb-4 relative z-20">
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ 
                    delay: 0.3 + (0.08 * index),
                    duration: 0.6,
                    ease: [0.215, 0.61, 0.355, 1]
                  }}
                  className="relative"
                  whileHover={{ 
                    scale: 1.1,
                    rotateY: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Glow effect layers */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${tool.color} rounded-xl blur-xl opacity-40 group-hover:opacity-70 transition-all duration-700 transform group-hover:scale-125`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.hoverColor} rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-all duration-600 transform group-hover:scale-115`} />
                  
                  {/* Icon container with enhanced gradient */}
                  <div className={`relative p-3 rounded-xl bg-gradient-to-br ${tool.color} shadow-2xl transform transition-all duration-500 group-hover:shadow-3xl group-hover:bg-gradient-to-tr group-hover:from-white/10`}>
                    <tool.icon className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    delay: 0.4 + (0.06 * index),
                    duration: 0.5,
                    ease: [0.215, 0.61, 0.355, 1]
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Badge 
                    variant={tool.badge === "New" ? "default" : "secondary"}
                    className={`text-xs glass-subtle border-0 shadow-lg hover:shadow-xl transition-all duration-400 text-white backdrop-blur-sm
                      ${tool.badge === "New" ? "bg-gradient-to-r from-emerald-500/80 to-green-500/80" : 
                        tool.badge === "Pro" ? "bg-gradient-to-r from-purple-500/80 to-indigo-500/80" :
                        tool.badge === "Beta" ? "bg-gradient-to-r from-orange-500/80 to-red-500/80" :
                        "bg-gradient-to-r from-blue-500/80 to-cyan-500/80"}`}
                  >
                    {tool.badge}
                  </Badge>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.35 + (0.06 * index),
                  duration: 0.6,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
              >
                <CardTitle className={`text-lg bg-gradient-to-r ${tool.color} bg-clip-text text-transparent group-hover:from-white group-hover:to-white/80 transition-all duration-500 font-semibold tracking-tight`}>
                  {tool.title}
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.45 + (0.06 * index),
                  duration: 0.6,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
              >
                <CardDescription className="text-sm text-muted-foreground group-hover:text-white/90 transition-colors duration-500 leading-relaxed">
                  {tool.description}
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-20 mt-auto pt-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.55 + (0.06 * index),
                  duration: 0.6,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.97,
                  transition: { duration: 0.1 }
                }}
              >
                <Button 
                  className={`w-full glass-subtle hover:glass-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 
                    group-hover:bg-gradient-to-r group-hover:${tool.color} group-hover:text-white 
                    backdrop-blur-sm relative overflow-hidden font-medium tracking-wide`}
                  variant="outline"
                  size="sm"
                >
                  {/* Button background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  <span className="relative z-10 transition-all duration-300 group-hover:drop-shadow-sm">
                    Launch Tool
                  </span>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}