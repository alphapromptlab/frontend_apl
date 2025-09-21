import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Target, 
  Edit3,
  Plus,
  Globe,
  Smartphone,
  Laptop,
  Heart,
  Briefcase,
  Home,
  Star
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Campaign {
  id: string;
  name: string;
  platforms: string[];
}

// Mock personas data
const mockPersonas = [
  {
    id: '1',
    name: 'Tech-Savvy Sarah',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150',
    role: 'Product Manager',
    age: '28-35',
    location: 'Urban, Tech Hubs',
    demographics: {
      income: '$75K-$120K',
      education: 'Bachelor\'s+',
      lifestyle: 'Digital Native'
    },
    psychographics: {
      interests: ['Technology', 'Productivity', 'Innovation', 'Remote Work'],
      values: ['Efficiency', 'Quality', 'Work-Life Balance'],
      painPoints: ['Time Management', 'Information Overload', 'Tool Integration']
    },
    behavior: {
      platforms: ['LinkedIn', 'Twitter', 'Instagram'],
      contentPreference: 'Educational, Visual',
      buyingStage: 'Consideration'
    },
    goals: [
      'Streamline workflows',
      'Stay updated with trends',
      'Professional growth'
    ]
  },
  {
    id: '2',
    name: 'Executive Mike',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'VP of Operations',
    age: '40-50',
    location: 'Major Cities',
    demographics: {
      income: '$150K+',
      education: 'MBA',
      lifestyle: 'Business Leader'
    },
    psychographics: {
      interests: ['Leadership', 'Strategy', 'Growth', 'ROI'],
      values: ['Results', 'Reliability', 'Scalability'],
      painPoints: ['Team Efficiency', 'Decision Making', 'Budget Optimization']
    },
    behavior: {
      platforms: ['LinkedIn', 'Email', 'Industry Reports'],
      contentPreference: 'Data-Driven, Case Studies',
      buyingStage: 'Decision Maker'
    },
    goals: [
      'Improve team performance',
      'Reduce operational costs',
      'Drive revenue growth'
    ]
  },
  {
    id: '3',
    name: 'Creative Emma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'Creative Director',
    age: '25-35',
    location: 'Creative Hubs',
    demographics: {
      income: '$60K-$90K',
      education: 'Bachelor\'s in Design',
      lifestyle: 'Creative Professional'
    },
    psychographics: {
      interests: ['Design', 'Creativity', 'Trends', 'Collaboration'],
      values: ['Innovation', 'Aesthetics', 'Expression'],
      painPoints: ['Creative Blocks', 'Client Communication', 'Project Management']
    },
    behavior: {
      platforms: ['Instagram', 'Behance', 'Pinterest'],
      contentPreference: 'Visual, Inspirational',
      buyingStage: 'Awareness'
    },
    goals: [
      'Enhance creative output',
      'Streamline design process',
      'Showcase work effectively'
    ]
  }
];

// Mock content pillars
const mockContentPillars = [
  {
    id: '1',
    title: 'Productivity & Efficiency',
    description: 'Content focused on helping users optimize their workflows and save time',
    contentTypes: ['How-to Guides', 'Tips & Tricks', 'Tool Comparisons'],
    platforms: ['LinkedIn', 'Blog', 'YouTube'],
    tone: 'Educational, Practical'
  },
  {
    id: '2',
    title: 'Innovation & Trends',
    description: 'Thought leadership content about industry trends and future of work',
    contentTypes: ['Industry Insights', 'Trend Reports', 'Expert Interviews'],
    platforms: ['LinkedIn', 'Twitter', 'Webinars'],
    tone: 'Authoritative, Forward-thinking'
  },
  {
    id: '3',
    title: 'Success Stories',
    description: 'Customer testimonials, case studies, and real-world applications',
    contentTypes: ['Case Studies', 'Customer Stories', 'Before/After'],
    platforms: ['Website', 'Email', 'Sales Materials'],
    tone: 'Inspiring, Results-driven'
  }
];

export function CampaignAudienceMessagingTab({ campaign }: { campaign: Campaign }) {
  const [coreMessage, setCoreMessage] = useState(
    "Empower modern professionals with intelligent tools that streamline workflows, enhance productivity, and drive meaningful results. Transform the way you work with solutions designed for the digital-first era."
  );
  const [valueProposition, setValueProposition] = useState(
    "The only productivity platform that adapts to your workflow, not the other way around. Save 2+ hours daily while delivering exceptional results."
  );

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return Briefcase;
      case 'instagram': return Heart;
      case 'twitter': return Globe;
      case 'email': return MessageSquare;
      default: return Globe;
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
            <h2 className="text-xl font-semibold">Audience & Messaging</h2>
            <p className="text-muted-foreground">Target personas, core messaging, and content strategy</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Persona
          </Button>
        </div>

        {/* Target Personas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Target Personas</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {mockPersonas.map((persona) => (
              <Card key={persona.id} className="glass-card border-0 p-6 space-y-4">
                {/* Persona Header */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={persona.avatar} />
                    <AvatarFallback>{persona.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{persona.name}</h4>
                    <p className="text-sm text-muted-foreground">{persona.role}</p>
                    <p className="text-xs text-muted-foreground">{persona.age} • {persona.location}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Demographics */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Demographics</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Income:</span>
                      <span>{persona.demographics.income}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Education:</span>
                      <span>{persona.demographics.education}</span>
                    </div>
                  </div>
                </div>

                {/* Pain Points */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Pain Points</h5>
                  <div className="flex flex-wrap gap-1">
                    {persona.psychographics.painPoints.map((pain, index) => (
                      <Badge key={index} variant="outline" className="text-xs glass-card border-0 bg-red-500/10 text-red-400">
                        {pain}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Interests</h5>
                  <div className="flex flex-wrap gap-1">
                    {persona.psychographics.interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-xs glass-card border-0 bg-blue-500/10 text-blue-400">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Preferred Platforms */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Preferred Platforms</h5>
                  <div className="flex gap-2">
                    {persona.behavior.platforms.map((platform, index) => {
                      const PlatformIcon = getPlatformIcon(platform);
                      return (
                        <div key={index} className="flex items-center gap-1 bg-white/5 rounded px-2 py-1">
                          <PlatformIcon className="w-3 h-3" />
                          <span className="text-xs">{platform}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Buying Stage */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Buying Stage:</span>
                    <Badge className={`text-xs border-0 ${
                      persona.behavior.buyingStage === 'Decision Maker' ? 'bg-green-500/20 text-green-400' :
                      persona.behavior.buyingStage === 'Consideration' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {persona.behavior.buyingStage}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Core Messaging */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card border-0 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                Core Message
              </h3>
              <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            <Textarea
              value={coreMessage}
              onChange={(e) => setCoreMessage(e.target.value)}
              className="glass-card border-0 bg-white/5 min-h-[100px] resize-none"
              placeholder="Enter your core campaign message..."
            />
          </Card>

          <Card className="glass-card border-0 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Value Proposition
              </h3>
              <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            <Textarea
              value={valueProposition}
              onChange={(e) => setValueProposition(e.target.value)}
              className="glass-card border-0 bg-white/5 min-h-[100px] resize-none"
              placeholder="Enter your unique value proposition..."
            />
          </Card>
        </div>

        {/* Content Pillars */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Content Pillars</h3>
            <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
              <Plus className="w-4 h-4 mr-2" />
              Add Pillar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {mockContentPillars.map((pillar) => (
              <Card key={pillar.id} className="glass-card border-0 p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold mb-2">{pillar.title}</h4>
                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Content Types</h5>
                    <div className="flex flex-wrap gap-1">
                      {pillar.contentTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs glass-card border-0 bg-purple-500/10 text-purple-400">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2">Platforms</h5>
                    <div className="flex flex-wrap gap-1">
                      {pillar.platforms.map((platform, index) => (
                        <Badge key={index} variant="outline" className="text-xs glass-card border-0 bg-blue-500/10 text-blue-400">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tone:</span>
                      <span className="font-medium">{pillar.tone}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Channel Strategy */}
        <Card className="glass-card border-0 p-6">
          <h3 className="text-lg font-semibold mb-4">Channel Strategy</h3>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {campaign.platforms.map((platform) => {
              const PlatformIcon = getPlatformIcon(platform);
              return (
                <div key={platform} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <PlatformIcon className="w-5 h-5 text-purple-400" />
                    <h4 className="font-medium">{platform}</h4>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="text-muted-foreground">Primary Audience:</div>
                    <div>Tech professionals, Decision makers</div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="text-muted-foreground">Content Focus:</div>
                    <div>Educational, Thought leadership</div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="text-muted-foreground">Posting Frequency:</div>
                    <div>3-5 times per week</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}