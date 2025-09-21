import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  FolderOpen, 
  Library,
  Search,
  Calendar,
  CheckSquare,
  Edit,
  Video,
  Music,
  Share2,
  ImageIcon,
  Film,
  Headphones,
  Menu,
  X,
  CreditCard,
  Palette
} from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentPage: string;
  onMenuItemClick: (page: string) => void;
}

const mainItems = [
  { icon: Home, label: "Dashboard" },
  { icon: FolderOpen, label: "Projects" },
  { icon: Library, label: "Library" },
];

const generatorTools = [
  { icon: Search, label: "Research" },
  { icon: Calendar, label: "Campaign Planner" },
  { icon: CheckSquare, label: "Task Manager" },
  { icon: Edit, label: "Content Generator" },
  { icon: ImageIcon, label: "Image Generator" },
  { icon: Video, label: "Video Generator" },
  { icon: Music, label: "Audio Generator" },
  { icon: Share2, label: "Social Media Scheduler" },
];

const editorTools = [
  { icon: Palette, label: "Design Studio" },
  { icon: Film, label: "Video Studio" },
  { icon: Headphones, label: "Audio Studio" },
];

export function Sidebar({ isCollapsed, onToggle, currentPage, onMenuItemClick }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isCollapsed ? "4rem" : "16rem"
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1]
      }}
      className="h-full glass-sidebar flex-shrink-0"
    >
      <div className="flex flex-col h-full">
        {/* Header with Menu Button */}
        <div className="flex items-center justify-between p-4 min-h-[4rem]">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <h1 className="splash-text text-lg bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                    Alpha Prompt Lab
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onToggle();
              // Dispatch custom event for components that need to know about sidebar state
              window.dispatchEvent(new CustomEvent('sidebar-toggle', { 
                detail: { collapsed: !isCollapsed } 
              }));
            }}
            className="p-2 text-foreground hover:text-foreground/80 transition-colors duration-200 sidebar-button rounded-lg hover:bg-muted/50"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </motion.div>
          </motion.button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Main Navigation */}
          <nav className="px-3 pt-6 space-y-2">
            {mainItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.2 }}
                whileHover={{ x: isCollapsed ? 0 : 5 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => onMenuItemClick(item.label)}
                  className={`w-full justify-start transition-all duration-200 sidebar-button rounded-lg ${
                    isCollapsed ? "px-2" : "px-3"
                  } ${currentPage === item.label ? "bg-muted/50 text-purple-400" : "hover:bg-muted/30"}`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="ml-2 whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            ))}
          </nav>

          {/* Divider */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.2 }}
                className="mx-3 my-4 h-px bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent"
              />
            )}
          </AnimatePresence>

          {/* Generator Tools */}
          <div className="px-3 space-y-2">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h3
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2"
                >
                  AI Tools
                </motion.h3>
              )}
            </AnimatePresence>
            
            {generatorTools.map((item, index) => (
              <motion.div
                key={item.label}
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.2 }}
                whileHover={{ x: isCollapsed ? 0 : 5 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => onMenuItemClick(item.label)}
                  className={`w-full justify-start transition-all duration-200 sidebar-button rounded-lg ${
                    isCollapsed ? "px-2" : "px-3"
                  } ${currentPage === item.label ? "bg-muted/50 text-purple-400" : "hover:bg-muted/30"}`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="ml-2 whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.2 }}
                className="mx-3 my-4 h-px bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent"
              />
            )}
          </AnimatePresence>

          {/* Editor Tools */}
          <div className="px-3 space-y-2">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h3
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2"
                >
                  Studios
                </motion.h3>
              )}
            </AnimatePresence>
            
            {editorTools.map((item, index) => (
              <motion.div
                key={item.label}
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.2 }}
                whileHover={{ x: isCollapsed ? 0 : 5 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => onMenuItemClick(item.label)}
                  className={`w-full justify-start transition-all duration-200 sidebar-button rounded-lg ${
                    isCollapsed ? "px-2" : "px-3"
                  } ${currentPage === item.label ? "bg-muted/50 text-purple-400" : "hover:bg-muted/30"}`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="ml-2 whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Credit Usage */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="mt-6 p-4 space-y-3"
              >
                <div className="glass-card rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Credits</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Used</span>
                      <span className="font-medium">150 / 1000</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <Button size="sm" variant="outline" className="w-full bg-transparent hover:bg-muted/30 text-sm">
                    View Plan
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}