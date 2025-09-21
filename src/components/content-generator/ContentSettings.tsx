import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { contentTypes, tones, languages } from './constants';

interface ContentSettingsProps {
  contentType: string;
  setContentType: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  length: number[];
  setLength: (value: number[]) => void;
  creativity: number[];
  setCreativity: (value: number[]) => void;
}

export function ContentSettings({
  contentType,
  setContentType,
  tone,
  setTone,
  language,
  setLanguage,
  length,
  setLength,
  creativity,
  setCreativity
}: ContentSettingsProps) {
  return (
    <Card className="glass-card border-0 p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
      {/* Floating orb effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-all duration-1000 transform group-hover:scale-125 group-hover:translate-x-2 group-hover:-translate-y-2" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-purple-500/15 to-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-15 transition-all duration-900 transform group-hover:scale-110 group-hover:-translate-x-1 group-hover:translate-y-1" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <h2 className="text-lg font-semibold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent relative z-10">Content Settings</h2>
      
      <div className="space-y-6 relative z-10">
        <div>
          <label className="text-sm font-semibold mb-3 block text-white">Content Type</label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="glass-card border-0 bg-black/40 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white hover:bg-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card border-0 bg-black/95 backdrop-blur-xl border border-white/10">
              {contentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-white hover:bg-white/10 focus:bg-white/10">
                  <div className="flex items-center gap-2">
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold mb-3 block text-white">Tone</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="glass-card border-0 bg-black/40 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white hover:bg-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-0 bg-black/95 backdrop-blur-xl border border-white/10">
                {tones.map((t) => (
                  <SelectItem key={t} value={t} className="text-white hover:bg-white/10 focus:bg-white/10">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold mb-3 block text-white">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="glass-card border-0 bg-black/40 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white hover:bg-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-0 bg-black/95 backdrop-blur-xl border border-white/10">
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="text-white hover:bg-white/10 focus:bg-white/10">{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-3 block text-white">
            Length: <span className="text-blue-400">{length[0]} words</span>
          </label>
          <Slider
            value={length}
            onValueChange={setLength}
            max={2000}
            min={100}
            step={50}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-3 block text-white">
            Creativity: <span className="text-purple-400">{creativity[0]}%</span>
          </label>
          <Slider
            value={creativity}
            onValueChange={setCreativity}
            max={100}
            min={0}
            step={10}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
}