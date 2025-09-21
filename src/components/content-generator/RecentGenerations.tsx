import { FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { recentGenerationsData } from './constants';

export function RecentGenerations() {
  return (
    <Card className="glass-card border-0 p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
      {/* Floating orb effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-all duration-1000 transform group-hover:scale-125 group-hover:translate-x-2 group-hover:-translate-y-2" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-red-500/15 to-pink-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-15 transition-all duration-900 transform group-hover:scale-110 group-hover:-translate-x-1 group-hover:translate-y-1" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent relative z-10">Recent Generations</h3>
      <div className="space-y-4 relative z-10">
        {recentGenerationsData.map((item, index) => (
          <motion.div 
            key={index} 
            className="flex items-center justify-between p-4 glass-card rounded-xl bg-black/40 border border-white/20 hover:bg-white/10 transition-all duration-300 group/item cursor-pointer"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white group-hover/item:text-blue-400 transition-colors duration-300">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-white/20 text-white group-hover/item:scale-110 transition-all duration-300">
              <FileText className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}