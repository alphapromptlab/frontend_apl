import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Edit3,
  Trash2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface Campaign {
  id: string;
  name: string;
  assignedMembers: Array<{
    id: string;
    name: string;
    avatar: string;
    initials: string;
  }>;
}

// Mock timeline tasks
const mockTimelineTasks = [
  {
    id: '1',
    title: 'Campaign Strategy & Planning',
    startDate: '2024-08-01',
    endDate: '2024-08-07',
    progress: 100,
    assignee: { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150', initials: 'SC' },
    status: 'completed'
  },
  {
    id: '2',
    title: 'Creative Asset Development',
    startDate: '2024-08-05',
    endDate: '2024-08-20',
    progress: 75,
    assignee: { id: '2', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', initials: 'MJ' },
    status: 'in-progress'
  },
  {
    id: '3',
    title: 'Content Creation & Copywriting',
    startDate: '2024-08-10',
    endDate: '2024-08-25',
    progress: 40,
    assignee: { id: '3', name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', initials: 'ER' },
    status: 'in-progress'
  },
  {
    id: '4',
    title: 'Campaign Launch & Distribution',
    startDate: '2024-08-20',
    endDate: '2024-08-22',
    progress: 0,
    assignee: { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150', initials: 'SC' },
    status: 'upcoming'
  },
  {
    id: '5',
    title: 'Performance Monitoring & Optimization',
    startDate: '2024-08-22',
    endDate: '2024-09-30',
    progress: 0,
    assignee: { id: '4', name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', initials: 'AK' },
    status: 'upcoming'
  }
];

// Mock Kanban assets
const mockKanbanAssets = {
  'backlog': [
    {
      id: '1',
      title: 'LinkedIn Carousel Design',
      type: 'Design',
      assignee: { id: '2', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', initials: 'MJ' },
      dueDate: '2024-08-15',
      priority: 'High'
    },
    {
      id: '2',
      title: 'Email Newsletter Template',
      type: 'Design',
      assignee: { id: '3', name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', initials: 'ER' },
      dueDate: '2024-08-18',
      priority: 'Medium'
    }
  ],
  'drafting': [
    {
      id: '3',
      title: 'Instagram Reel Script',
      type: 'Content',
      assignee: { id: '3', name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', initials: 'ER' },
      dueDate: '2024-08-12',
      priority: 'High'
    },
    {
      id: '4',
      title: 'Blog Post: Product Features',
      type: 'Content',
      assignee: { id: '3', name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', initials: 'ER' },
      dueDate: '2024-08-16',
      priority: 'Medium'
    }
  ],
  'review': [
    {
      id: '5',
      title: 'Hero Banner Design',
      type: 'Design',
      assignee: { id: '2', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', initials: 'MJ' },
      dueDate: '2024-08-10',
      priority: 'High'
    }
  ],
  'scheduled': [
    {
      id: '6',
      title: 'Social Media Posts Week 1',
      type: 'Content',
      assignee: { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150', initials: 'SC' },
      dueDate: '2024-08-20',
      priority: 'High'
    }
  ],
  'live': [
    {
      id: '7',
      title: 'Campaign Landing Page',
      type: 'Development',
      assignee: { id: '4', name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', initials: 'AK' },
      dueDate: '2024-08-05',
      priority: 'High'
    }
  ]
};

const kanbanColumns = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-500' },
  { id: 'drafting', title: 'Drafting', color: 'bg-yellow-500' },
  { id: 'review', title: 'Review', color: 'bg-blue-500' },
  { id: 'scheduled', title: 'Scheduled', color: 'bg-purple-500' },
  { id: 'live', title: 'Live', color: 'bg-green-500' }
];

export function CampaignTimelineTasksTab({ campaign }: { campaign: Campaign }) {
  const [selectedMonth, setSelectedMonth] = useState('August 2024');
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [kanbanFilter, setKanbanFilter] = useState('all');

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'upcoming': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-500/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'Low': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Design': return 'text-purple-400 bg-purple-500/10';
      case 'Content': return 'text-blue-400 bg-blue-500/10';
      case 'Development': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

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
            <h2 className="text-xl font-semibold">Timeline & Tasks</h2>
            <p className="text-muted-foreground">Project timeline and asset production workflow</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Project Timeline</h3>
            <div className="flex items-center gap-3">
              <Select value={timelineFilter} onValueChange={setTimelineFilter}>
                <SelectTrigger className="w-40 glass-card border-0 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-0 bg-black/90">
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[120px] text-center">{selectedMonth}</span>
                <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <Card className="glass-card border-0 p-6">
            <div className="space-y-4">
              {mockTimelineTasks.map((task, index) => (
                <div key={task.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getTaskStatusColor(task.status)}`} />
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <div className="text-sm text-muted-foreground">
                          {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                      </Avatar>
                      <Badge variant="outline" className="text-xs">
                        {task.progress}%
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Simple Gantt visualization */}
                  <div className="ml-6">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getTaskStatusColor(task.status)}`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12">{task.progress}%</span>
                    </div>
                  </div>
                  
                  {index < mockTimelineTasks.length - 1 && <div className="border-b border-white/10" />}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Kanban Board Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Asset Production Workflow</h3>
            <div className="flex items-center gap-3">
              <Select value={kanbanFilter} onValueChange={setKanbanFilter}>
                <SelectTrigger className="w-40 glass-card border-0 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-0 bg-black/90">
                  <SelectItem value="all">All Assets</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Content">Content</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-96">
            {kanbanColumns.map((column) => (
              <Card key={column.id} className="glass-card border-0 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                    <h4 className="font-medium">{column.title}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {mockKanbanAssets[column.id as keyof typeof mockKanbanAssets].length}
                  </Badge>
                </div>
                
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {mockKanbanAssets[column.id as keyof typeof mockKanbanAssets].map((asset) => (
                    <motion.div
                      key={asset.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h5 className="font-medium text-sm line-clamp-2">{asset.title}</h5>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="glass-card border-0 bg-black/90">
                              <DropdownMenuItem>
                                <Edit3 className="w-3 h-3 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400">
                                <Trash2 className="w-3 h-3 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge className={`${getTypeColor(asset.type)} border-0 text-xs`}>
                            {asset.type}
                          </Badge>
                          <Badge className={`${getPriorityColor(asset.priority)} border-0 text-xs`}>
                            {asset.priority}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-xs">{asset.assignee.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {new Date(asset.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {mockKanbanAssets[column.id as keyof typeof mockKanbanAssets].length === 0 && (
                    <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
                      No assets
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-3 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Asset
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}