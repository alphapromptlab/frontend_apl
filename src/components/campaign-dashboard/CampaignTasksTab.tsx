import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, CheckSquare, Circle, CheckCircle, Clock, AlertCircle, 
  Filter, Search, Edit3, Trash2, MoreHorizontal 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { mockTasks, getStatusColor, getPriorityColor, type Campaign, type Task } from './constants';

export function CampaignTasksTab({ campaign }: { campaign: Campaign }) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status.toLowerCase().replace(' ', '') === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority.toLowerCase() === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'Done': return CheckCircle;
      case 'In Progress': return Clock;
      case 'Todo': return Circle;
      default: return AlertCircle;
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'Done' ? 'Todo' : 
                         task.status === 'Todo' ? 'In Progress' : 'Done';
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Done').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    todo: tasks.filter(t => t.status === 'Todo').length
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Campaign Tasks</h2>
              <p className="text-muted-foreground">Manage and track campaign deliverables</p>
            </div>
            <Button
              onClick={() => setShowNewTaskDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="glass-card border-0 p-4 text-center">
              <div className="text-2xl font-bold text-white">{taskStats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </Card>
            <Card className="glass-card border-0 p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{taskStats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </Card>
            <Card className="glass-card border-0 p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{taskStats.inProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </Card>
            <Card className="glass-card border-0 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{taskStats.todo}</div>
              <div className="text-sm text-muted-foreground">To Do</div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 glass-card border-0 bg-white/5"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 glass-card border-0 bg-white/5">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="glass-card border-0 bg-black/90">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40 glass-card border-0 bg-white/5">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="glass-card border-0 bg-black/90">
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task, index) => {
            const StatusIcon = getStatusIcon(task.status);
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-card border-0 p-4 hover:bg-white/10 transition-all duration-200 group">
                  <div className="flex items-center gap-4">
                    {/* Status Checkbox */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskStatus(task.id)}
                      className="p-0 h-auto hover:bg-transparent"
                    >
                      <StatusIcon className={`w-5 h-5 ${
                        task.status === 'Done' ? 'text-green-400' :
                        task.status === 'In Progress' ? 'text-blue-400' : 'text-gray-400'
                      }`} />
                    </Button>

                    {/* Task Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${task.status === 'Done' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <Badge className={`${getPriorityColor(task.priority)} border text-xs`}>
                          {task.priority}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <div className="flex gap-1">
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs glass-card border-0 bg-white/5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Assignee */}
                    {task.assignedTo && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={task.assignedTo.avatar} />
                        <AvatarFallback className="text-xs">{task.assignedTo.initials}</AvatarFallback>
                      </Avatar>
                    )}

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass-card border-0 bg-black/90">
                        <DropdownMenuItem>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <CheckSquare className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground">Create your first task to get started</p>
          </div>
        )}
      </motion.div>

      {/* New Task Dialog */}
      <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
        <DialogContent className="glass-card border-0 bg-black/90 max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Task Title</Label>
              <Input placeholder="Enter task title..." className="glass-card border-0 bg-white/5 mt-2" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Task description..." className="glass-card border-0 bg-white/5 mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger className="glass-card border-0 bg-white/5 mt-2">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-0 bg-black/90">
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" className="glass-card border-0 bg-white/5 mt-2" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewTaskDialog(false)} className="glass-card border-0 bg-white/5">
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700">
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}