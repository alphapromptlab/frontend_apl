import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface Campaign {
  id: string;
  name: string;
}

export function CampaignTimelineTab({ campaign }: { campaign: Campaign }) {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Campaign Timeline</h2>
            <p className="text-muted-foreground">Drag and drop content blocks onto your campaign calendar</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold">August 2024</h3>
            <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
              Week
            </Button>
            <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
              Month
            </Button>
          </div>
        </div>

        {/* Timeline Content */}
        <Card className="glass-card border-0 p-8">
          <div className="flex items-center justify-center h-64 text-center">
            <div>
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Timeline View Coming Soon</h3>
              <p className="text-muted-foreground">
                Interactive drag-and-drop calendar with content scheduling
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}