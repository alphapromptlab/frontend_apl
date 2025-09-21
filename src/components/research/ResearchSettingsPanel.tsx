import { motion, AnimatePresence } from 'motion/react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';

interface ResearchSettings {
  researchType: string;
  depth: number;
  sources: string[];
  language: string;
  tone: string;
  includeCitations: boolean;
  realTimeData: boolean;
  keywords: string;
}

interface ResearchSettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  settings: ResearchSettings;
  onSettingsChange: (settings: ResearchSettings) => void;
}

const availableSources = [
  { id: 'industry-reports', label: 'Industry Reports' },
  { id: 'academic-papers', label: 'Academic Papers' },
  { id: 'news-articles', label: 'News Articles' },
  { id: 'surveys', label: 'Surveys & Studies' },
  { id: 'behavioral-data', label: 'Behavioral Data' },
  { id: 'social-media', label: 'Social Media' },
  { id: 'government-data', label: 'Government Data' }
];

export function ResearchSettingsPanel({
  isOpen,
  onToggle,
  settings,
  onSettingsChange
}: ResearchSettingsPanelProps) {
  const handleSourceToggle = (sourceId: string) => {
    const currentSources = settings.sources;
    const newSources = currentSources.includes(sourceId)
      ? currentSources.filter(s => s !== sourceId)
      : [...currentSources, sourceId];
    
    onSettingsChange({
      ...settings,
      sources: newSources
    });
  };

  return (
    <div className="mb-6">
      <Button
        onClick={onToggle}
        variant="outline"
        className={`w-full justify-between h-12 form-button transition-all ${
          isOpen ? 'bg-blue-500/10 text-blue-500' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <Settings className="w-4 h-4" />
          <span className="font-medium">Research Settings</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <Card className="form-card p-6 mt-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Research Depth */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-sm font-medium">Research Depth</Label>
                      <span className="text-xs text-muted-foreground">{settings.depth}%</span>
                    </div>
                    <Slider
                      value={[settings.depth]}
                      onValueChange={(value) =>
                        onSettingsChange({ ...settings, depth: value[0] })
                      }
                      max={100}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Surface</span>
                      <span>Comprehensive</span>
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Language</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        onSettingsChange({ ...settings, language: value })
                      }
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tone */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Research Tone</Label>
                    <Select
                      value={settings.tone}
                      onValueChange={(value) =>
                        onSettingsChange({ ...settings, tone: value })
                      }
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="analytical">Analytical</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Keywords */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Focus Keywords</Label>
                    <Input
                      value={settings.keywords}
                      onChange={(e) =>
                        onSettingsChange({ ...settings, keywords: e.target.value })
                      }
                      placeholder="Enter keywords separated by commas"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Data Sources */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Data Sources</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableSources.map((source) => (
                        <div key={source.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={source.id}
                            checked={settings.sources.includes(source.id)}
                            onCheckedChange={() => handleSourceToggle(source.id)}
                          />
                          <Label
                            htmlFor={source.id}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {source.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Include Citations</Label>
                        <p className="text-xs text-muted-foreground">Add source references</p>
                      </div>
                      <Switch
                        checked={settings.includeCitations}
                        onCheckedChange={(checked) =>
                          onSettingsChange({ ...settings, includeCitations: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Real-time Data</Label>
                        <p className="text-xs text-muted-foreground">Use latest available data</p>
                      </div>
                      <Switch
                        checked={settings.realTimeData}
                        onCheckedChange={(checked) =>
                          onSettingsChange({ ...settings, realTimeData: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}