import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Target } from 'lucide-react';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface ContentSettings {
  tone: string;
  language: string;
  wordCount: number;
  creativity: number;
  seoMode: boolean;
  grammarCheck: boolean;
  keywords: string;
  targetAudience: string;
}

interface AdvancedSettings {
  includeOutline: boolean;
  includeReferences: boolean;
  multipleVariations: boolean;
  variationCount: number;
  focusKeyword: string;
  excludeWords: string;
}

interface ContentSettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  settings: ContentSettings;
  onSettingsChange: (settings: ContentSettings) => void;
  advancedSettings: AdvancedSettings;
  onAdvancedSettingsChange: (settings: AdvancedSettings) => void;
}

const toneOptions = [
  'Casual',
  'Friendly', 
  'Professional',
  'Persuasive',
  'Formal',
  'Informative',
  'Urgent',
  'Creative'
];

const languageOptions = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'de', label: 'German', flag: '🇩🇪' },
  { value: 'it', label: 'Italian', flag: '🇮🇹' },
  { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { value: 'ja', label: 'Japanese', flag: '🇯🇵' }
];

export function ContentSettingsPanel({ 
  isOpen, 
  onToggle, 
  settings, 
  onSettingsChange,
  advancedSettings,
  onAdvancedSettingsChange
}: ContentSettingsPanelProps) {
  const updateSettings = (key: keyof ContentSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const updateAdvancedSetting = (key: keyof AdvancedSettings, value: any) => {
    onAdvancedSettingsChange({
      ...advancedSettings,
      [key]: value
    });
  };

  return (
    <div>
      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <Card className="p-6 form-container">
              {/* Advanced Settings Section */}
              <div className="mb-8 p-4 bg-[var(--form-input-bg)] rounded-lg">
                <h3 className="text-sm font-semibold text-[var(--form-text)] mb-4">Advanced Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[var(--form-text)]">Include Outline</label>
                      <Switch 
                        checked={advancedSettings.includeOutline}
                        onCheckedChange={(checked) => updateAdvancedSetting('includeOutline', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[var(--form-text)]">Include References</label>
                      <Switch 
                        checked={advancedSettings.includeReferences}
                        onCheckedChange={(checked) => updateAdvancedSetting('includeReferences', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[var(--form-text)]">Multiple Variations</label>
                      <Switch 
                        checked={advancedSettings.multipleVariations}
                        onCheckedChange={(checked) => updateAdvancedSetting('multipleVariations', checked)}
                      />
                    </div>

                    {advancedSettings.multipleVariations && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm text-[var(--form-text)]">Variation Count</label>
                          <Badge variant="secondary" className="text-xs">
                            {advancedSettings.variationCount}
                          </Badge>
                        </div>
                        <Slider
                          value={[advancedSettings.variationCount]}
                          onValueChange={(value) => updateAdvancedSetting('variationCount', value[0])}
                          min={2}
                          max={5}
                          step={1}
                          className="py-2"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-[var(--form-text)]">Focus Keyword</label>
                      <Input
                        placeholder="Main keyword to emphasize"
                        value={advancedSettings.focusKeyword}
                        onChange={(e) => updateAdvancedSetting('focusKeyword', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-[var(--form-text)]">Exclude Words</label>
                      <Input
                        placeholder="Words to avoid (comma separated)"
                        value={advancedSettings.excludeWords}
                        onChange={(e) => updateAdvancedSetting('excludeWords', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Settings Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Tone Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--form-text)]">
                      Tone
                    </label>
                    <Select 
                      value={settings.tone} 
                      onValueChange={(value) => updateSettings('tone', value)}
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((tone) => (
                          <SelectItem key={tone} value={tone.toLowerCase()}>
                            {tone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--form-text)]">
                      Language
                    </label>
                    <Select 
                      value={settings.language} 
                      onValueChange={(value) => updateSettings('language', value)}
                    >
                      <SelectTrigger className="form-input">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 opacity-50" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            <div className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Word Count Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-[var(--form-text)]">
                        Word Count
                      </label>
                      <Badge variant="secondary" className="text-xs">
                        {settings.wordCount} words
                      </Badge>
                    </div>
                    <Slider
                      value={[settings.wordCount]}
                      onValueChange={(value) => updateSettings('wordCount', value[0])}
                      max={2500}
                      min={20}
                      step={10}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>20 words</span>
                      <span>2500 words</span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Creativity Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-[var(--form-text)]">
                        Creativity
                      </label>
                      <Badge variant="secondary" className="text-xs">
                        {settings.creativity}%
                      </Badge>
                    </div>
                    <Slider
                      value={[settings.creativity]}
                      onValueChange={(value) => updateSettings('creativity', value[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Precision</span>
                      <span>Originality</span>
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[var(--form-text)]">
                        SEO Mode
                      </label>
                      <Switch
                        checked={settings.seoMode}
                        onCheckedChange={(checked) => updateSettings('seoMode', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[var(--form-text)]">
                        Grammar Check
                      </label>
                      <Switch
                        checked={settings.grammarCheck}
                        onCheckedChange={(checked) => updateSettings('grammarCheck', checked)}
                      />
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--form-text)]">
                      Keywords (optional)
                    </label>
                    <Input
                      placeholder="Enter keywords separated by commas"
                      value={settings.keywords}
                      onChange={(e) => updateSettings('keywords', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Target Audience - Full Width */}
              <div className="mt-6 space-y-2">
                <label className="text-sm font-medium text-[var(--form-text)] flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Target Audience (optional)
                </label>
                <Textarea
                  placeholder="Describe your target audience (e.g., young professionals, tech enthusiasts, small business owners)"
                  value={settings.targetAudience}
                  onChange={(e) => updateSettings('targetAudience', e.target.value)}
                  rows={2}
                  className="form-input"
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}