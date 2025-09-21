import { useState } from 'react';
import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  User, 
  Clock, 
  Flag, 
  Paperclip,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  Circle,
  AlertCircle,
  Eye,
  Kanban,
  ChevronDown,
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface Task {
  id: string;
  name: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  dueDate: string;
  estimatedTime?: string;
  platform: string;
  contentType: string;
  comments?: number;
  attachments?: number;
  order: number;
}

const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Create Instagram Reel for New Product Launch',
    description: 'Design and produce a 30-second Instagram Reel showcasing our latest AI features with trending music',
    status: 'todo',
    priority: 'urgent',
    assignee: 'Sarah Chen',
    dueDate: '2025-01-31',
    estimatedTime: '5h',
    platform: 'Instagram',
    contentType: 'Video',
    comments: 4,
    attachments: 3,
    order: 0
  },
  {
    id: '2',
    name: 'Write LinkedIn Thought Leadership Article',
    description: 'Research and write about the future of AI in creative workflows - targeting 2000+ words with data insights',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Alex Rivera',
    dueDate: '2025-02-02',
    estimatedTime: '8h',
    platform: 'LinkedIn',
    contentType: 'Article',
    comments: 2,
    order: 0
  },
  {
    id: '3',
    name: 'Design Twitter Thread Visual Assets',
    description: 'Create 8 custom graphics for productivity tips thread - modern minimalist style with brand colors',
    status: 'review',
    priority: 'medium',
    assignee: 'Jordan Kim',
    dueDate: '2025-01-29',
    estimatedTime: '4h',
    platform: 'Twitter',
    contentType: 'Graphics',
    attachments: 8,
    order: 0
  },
  {
    id: '4',
    name: 'Edit Weekly Podcast Episode',
    description: 'Post-production editing for Episode 47: "Building AI-Powered Workflows" - remove filler words, add intro/outro',
    status: 'done',
    priority: 'high',
    assignee: 'Maria Garcia',
    dueDate: '2025-01-26',
    estimatedTime: '6h',
    platform: 'Podcast',
    contentType: 'Audio',
    comments: 1,
    order: 0
  },
  {
    id: '5',
    name: 'Write Facebook Ad Campaign Copy',
    description: 'Create compelling ad copy for Q1 campaign targeting creative professionals - 5 variations with A/B test elements',
    status: 'todo',
    priority: 'urgent',
    assignee: 'David Park',
    dueDate: '2025-01-30',
    estimatedTime: '3h',
    platform: 'Facebook',
    contentType: 'Ad Copy',
    comments: 6,
    order: 1
  },
  {
    id: '6',
    name: 'Design YouTube Thumbnail Series',
    description: 'Create 3 thumbnail variations for "AI Tools Tutorial" video - high CTR design with bold text overlay',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Emma Wilson',
    dueDate: '2025-02-04',
    estimatedTime: '3h',
    platform: 'YouTube',
    contentType: 'Design',
    attachments: 2,
    order: 1
  },
  {
    id: '7',
    name: 'Create TikTok Video Series Script',
    description: 'Write scripts for 5-part "Quick AI Tips" series - under 60 seconds each with hook, value, and CTA',
    status: 'todo',
    priority: 'medium',
    assignee: 'Lisa Park',
    dueDate: '2025-02-01',
    estimatedTime: '4h',
    platform: 'TikTok',
    contentType: 'Script',
    comments: 2,
    order: 2
  },
  {
    id: '8',
    name: 'Blog Post: AI Content Creation Guide',
    description: 'Comprehensive 3000-word guide on AI content creation tools with screenshots, examples, and best practices',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Michael Chen',
    dueDate: '2025-02-05',
    estimatedTime: '10h',
    platform: 'Website',
    contentType: 'Blog Post',
    comments: 3,
    attachments: 15,
    order: 2
  },
  {
    id: '9',
    name: 'Email Newsletter Template Design',
    description: 'Design responsive email template for weekly AI updates - mobile-first approach with CTAs and social links',
    status: 'review',
    priority: 'low',
    assignee: 'Sophie Turner',
    dueDate: '2025-01-28',
    estimatedTime: '4h',
    platform: 'Email',
    contentType: 'Template',
    attachments: 4,
    order: 1
  },
  {
    id: '10',
    name: 'Client Presentation Deck Update',
    description: 'Update Q4 results presentation with new metrics, case studies, and 2025 roadmap - 25 slides total',
    status: 'done',
    priority: 'urgent',
    assignee: 'Robert Kim',
    dueDate: '2025-01-24',
    estimatedTime: '7h',
    platform: 'Internal',
    contentType: 'Presentation',
    comments: 8,
    attachments: 12,
    order: 1
  },
  {
    id: '11',
    name: 'Instagram Story Templates',
    description: 'Create 15 branded story templates for different content types - tutorials, quotes, behind-the-scenes',
    status: 'done',
    priority: 'medium',
    assignee: 'Nina Rodriguez',
    dueDate: '2025-01-25',
    estimatedTime: '5h',
    platform: 'Instagram',
    contentType: 'Templates',
    attachments: 15,
    order: 2
  },
  {
    id: '12',
    name: 'Competitor Analysis Report',
    description: 'Analyze top 10 competitors\' content strategies, posting frequency, and engagement rates - detailed spreadsheet',
    status: 'done',
    priority: 'high',
    assignee: 'James Wilson',
    dueDate: '2025-01-23',
    estimatedTime: '8h',
    platform: 'Internal',
    contentType: 'Research',
    comments: 5,
    attachments: 8,
    order: 3
  }
];

const statusColumns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-500/20 text-gray-400' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'review', title: 'Review', color: 'bg-orange-500/20 text-orange-400' },
  { id: 'done', title: 'Done', color: 'bg-green-500/20 text-green-400' }
];

const priorityConfig = {
  low: { label: 'Low', color: 'bg-green-500/20 text-green-400' },
  medium: { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400' },
  high: { label: 'High', color: 'bg-orange-500/20 text-orange-400' },
  urgent: { label: 'Urgent', color: 'bg-red-500/20 text-red-400' }
};

const platformColors = {
  Instagram: 'bg-pink-500/20 text-pink-400',
  LinkedIn: 'bg-blue-600/20 text-blue-400',
  Twitter: 'bg-sky-500/20 text-sky-400',
  Facebook: 'bg-blue-700/20 text-blue-300',
  YouTube: 'bg-red-500/20 text-red-400',
  Podcast: 'bg-purple-500/20 text-purple-400',
  TikTok: 'bg-gray-900/20 text-gray-300',
  Website: 'bg-green-500/20 text-green-400',
  Email: 'bg-orange-500/20 text-orange-400',
  Internal: 'bg-gray-600/20 text-gray-400'
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  return `${diffDays} days`;
};

const getDateColor = (dateString: string, status: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Green text for completed tasks
  if (status === 'done') return 'text-green-400';
  
  if (diffDays < 0) return 'text-red-400';
  if (diffDays === 0) return 'text-orange-400';
  if (diffDays <= 2) return 'text-yellow-400';
  return 'text-muted-foreground';
};

// Drop zone between tasks
const TaskDropZone = ({ 
  columnId, 
  targetIndex, 
  onTaskMove, 
  onTaskReorder 
}: { 
  columnId: string; 
  targetIndex: number; 
  onTaskMove: (taskId: string, newStatus: string, newOrder: number) => void;
  onTaskReorder: (taskId: string, newOrder: number) => void;
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string; status: string; order: number }) => {
      if (item.status === columnId) {
        // Reordering within the same column
        onTaskReorder(item.id, targetIndex);
      } else {
        // Moving to a different column
        onTaskMove(item.id, columnId, targetIndex);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`w-full transition-all duration-200 ${
        isOver && canDrop 
          ? 'h-8 bg-blue-500/10 border-2 border-dashed border-blue-500/30 rounded-lg mb-2' 
          : 'h-2'
      }`}
    />
  );
};

const DraggableTaskCard = ({
  task,
  index,
  columnId,
  onTaskMove,
  onTaskReorder
}: {
  task: Task;
  index: number;
  columnId: string;
  onTaskMove: (taskId: string, newStatus: string, newOrder: number) => void;
  onTaskReorder: (taskId: string, newOrder: number) => void;
}) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'task',
    item: { id: task.id, status: task.status, order: task.order },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`${isDragging ? 'opacity-50 rotate-1 scale-105' : ''}`}
    >
      <Card className={`glass-card border-0 p-3 sm:p-4 hover:shadow-lg transition-all duration-300 hover:bg-white/5 cursor-pointer ${
        isDragging ? 'rotate-1 scale-105' : ''
      }`}>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-start justify-between gap-2">
            {/* Drag Handle */}
            <div 
              ref={dragRef}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded transition-colors mr-2 flex-shrink-0"
            >
              <GripVertical className="w-3 h-3 text-gray-400" />
            </div>

            <h3 className={`font-medium text-xs sm:text-sm leading-relaxed flex-1 min-w-0 ${
              task.status === 'done' ? 'text-green-400' : ''
            }`}>{task.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-5 h-5 sm:w-6 sm:h-6 p-0 hover:bg-white/10 flex-shrink-0">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-0">
                <DropdownMenuItem>
                  <Edit className="w-3 h-3 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="w-3 h-3 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400">
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <Badge className={`${priorityConfig[task.priority].color} border-0 text-xs px-1.5 py-0.5`}>
              <Flag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
              <span className="hidden sm:inline">{priorityConfig[task.priority].label}</span>
              <span className="sm:hidden">{priorityConfig[task.priority].label.charAt(0)}</span>
            </Badge>
            <Badge className={`${platformColors[task.platform as keyof typeof platformColors] || 'bg-gray-500/20 text-gray-400'} border-0 text-xs px-1.5 py-0.5`}>
              {task.platform}
            </Badge>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span className="truncate">{task.assignee}</span>
            </div>
            <div className={`flex items-center gap-1 text-xs ${getDateColor(task.dueDate, task.status)}`}>
              <Calendar className="w-3 h-3" />
              <span>{task.status === 'done' ? `done ${formatDate(task.dueDate)}` : formatDate(task.dueDate)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">{task.contentType}</span>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {task.estimatedTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="hidden sm:inline">{task.estimatedTime}</span>
                  <span className="sm:hidden">{task.estimatedTime.replace('h', '')}</span>
                </div>
              )}
              {task.comments && task.comments > 0 && (
                <span className="hidden sm:inline">{task.comments} comments</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const DroppableColumn = ({ 
  column, 
  tasks, 
  onTaskMove,
  onTaskReorder
}: { 
  column: typeof statusColumns[0]; 
  tasks: Task[]; 
  onTaskMove: (taskId: string, newStatus: string, newOrder: number) => void;
  onTaskReorder: (taskId: string, newOrder: number) => void;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string; status: string; order: number }) => {
      if (item.status !== column.id) {
        // Moving to a different column - append to end
        onTaskMove(item.id, column.id, tasks.length);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Sort tasks by order
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div 
      ref={drop}
      className={`flex-1 min-h-[600px] transition-all duration-300 ${
        isOver ? 'bg-blue-500/5 scale-[1.02] rounded-lg' : ''
      }`}
    >
      <div className="px-4 pb-4 pt-2 h-full">
        {/* Column Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${column.color.split(' ')[0]}`} />
            <h3 className="font-medium text-lg">{column.title}</h3>
          </div>
          <Badge className={`${column.color} border-0 text-xs px-2 py-1`}>
            {tasks.length}
          </Badge>
        </div>
        
        {/* Tasks */}
        <div className="space-y-1">
          {/* Drop zone at the top */}
          <TaskDropZone 
            columnId={column.id} 
            targetIndex={0} 
            onTaskMove={onTaskMove}
            onTaskReorder={onTaskReorder}
          />
          
          {sortedTasks.map((task, index) => (
            <React.Fragment key={task.id}>
              <DraggableTaskCard 
                task={task} 
                index={index} 
                columnId={column.id}
                onTaskMove={onTaskMove}
                onTaskReorder={onTaskReorder}
              />
              {/* Drop zone after each task */}
              <TaskDropZone 
                columnId={column.id} 
                targetIndex={index + 1} 
                onTaskMove={onTaskMove}
                onTaskReorder={onTaskReorder}
              />
            </React.Fragment>
          ))}
          
          {/* Empty state */}
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center opacity-50">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                {column.id === 'todo' && <Circle className="w-6 h-6 text-gray-400" />}
                {column.id === 'in-progress' && <Clock className="w-6 h-6 text-blue-400" />}
                {column.id === 'review' && <AlertCircle className="w-6 h-6 text-orange-400" />}
                {column.id === 'done' && <CheckCircle className="w-6 h-6 text-green-400" />}
              </div>
              <p className="text-sm text-muted-foreground mb-1">No tasks yet</p>
              <p className="text-xs text-muted-foreground/70">Drop tasks here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CreateTaskModal = ({ 
  isOpen, 
  onClose, 
  onCreateTask 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onCreateTask: (task: Omit<Task, 'id'>) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    assignee: '',
    startDate: '',
    dueDate: '',
    order: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onCreateTask(formData);
      setFormData({
        name: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee: '',
        startDate: '',
        dueDate: '',
        order: 0
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-0 max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your project board
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="glass-card border-0 bg-white/5"
              placeholder="Enter task name..."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="glass-card border-0 bg-white/5 resize-none"
              placeholder="Task description..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value: Task['priority']) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger className="glass-card border-0 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-0">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: Task['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="glass-card border-0 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-0">
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="glass-card border-0 bg-white/5"
              placeholder="Assign to..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start-date">Starting Date</Label>
              <Input
                id="start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="glass-card border-0 bg-white/5"
              />
            </div>
            
            <div>
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="glass-card border-0 bg-white/5"
              />
            </div>
          </div>
          

          

          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 glass-card border-0 bg-white/5">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface TaskManagerProps {
  filterStatus: string;
  filterPriority: string;
  isCreateDialogOpen: boolean;
  onCreateDialogChange: (open: boolean) => void;
}

export function TaskManager({ 
  filterStatus, 
  filterPriority, 
  isCreateDialogOpen, 
  onCreateDialogChange 
}: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const tasksByStatus = statusColumns.reduce((acc, column) => {
    acc[column.id] = filteredTasks.filter(task => task.status === column.id);
    return acc;
  }, {} as Record<string, Task[]>);

  const handleTaskMove = (taskId: string, newStatus: string, newOrder: number = 0) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: newStatus as Task['status'], order: newOrder };
        }
        return task;
      });

      // Reorder other tasks in the target column
      const tasksInTargetColumn = updatedTasks.filter(task => task.status === newStatus && task.id !== taskId);
      tasksInTargetColumn.forEach((task, index) => {
        if (index >= newOrder) {
          task.order = index + 1;
        }
      });

      return updatedTasks;
    });
  };

  const handleTaskReorder = (taskId: string, newOrder: number) => {
    setTasks(prevTasks => {
      const task = prevTasks.find(t => t.id === taskId);
      if (!task) return prevTasks;

      const tasksInSameColumn = prevTasks.filter(t => t.status === task.status);
      const oldOrder = task.order;
      
      // Update the moved task's order
      const updatedTasks = prevTasks.map(t => {
        if (t.id === taskId) {
          return { ...t, order: newOrder };
        }
        return t;
      });

      // Reorder other tasks in the same column
      tasksInSameColumn.forEach(t => {
        if (t.id === taskId) return;
        
        if (newOrder > oldOrder) {
          // Moving down: shift tasks up
          if (t.order > oldOrder && t.order <= newOrder) {
            const taskToUpdate = updatedTasks.find(ut => ut.id === t.id);
            if (taskToUpdate) taskToUpdate.order = t.order - 1;
          }
        } else {
          // Moving up: shift tasks down
          if (t.order >= newOrder && t.order < oldOrder) {
            const taskToUpdate = updatedTasks.find(ut => ut.id === t.id);
            if (taskToUpdate) taskToUpdate.order = t.order + 1;
          }
        }
      });

      return updatedTasks;
    });
  };

  const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'platform' | 'contentType'>) => {
    const tasksInStatus = tasks.filter(task => task.status === newTaskData.status);
    const maxOrder = tasksInStatus.length > 0 ? Math.max(...tasksInStatus.map(t => t.order)) : -1;
    
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      platform: 'General', // Default value
      contentType: 'Task', // Default value
      order: maxOrder + 1
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >

          

        </motion.div>

        {/* Kanban Board */}
        {viewMode === 'kanban' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex gap-6 overflow-x-auto pb-6"
          >
            {statusColumns.map((column) => (
              <DroppableColumn
                key={column.id}
                column={column}
                tasks={tasksByStatus[column.id]}
                onTaskMove={handleTaskMove}
                onTaskReorder={handleTaskReorder}
              />
            ))}
          </motion.div>
        )}

        {/* Create Task Modal */}
        <CreateTaskModal
          isOpen={isCreateDialogOpen}
          onClose={() => onCreateDialogChange(false)}
          onCreateTask={handleCreateTask}
        />
      </div>
    </DndProvider>
  );
}