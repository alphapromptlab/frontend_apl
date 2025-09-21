import { FileText, Image, Video, MessageCircle } from 'lucide-react';

export const contentTypes = [
  { value: 'blog', label: 'Blog Post', icon: FileText },
  { value: 'social', label: 'Social Media', icon: MessageCircle },
  { value: 'email', label: 'Email Copy', icon: MessageCircle },
  { value: 'product', label: 'Product Description', icon: FileText },
  { value: 'ad', label: 'Advertisement', icon: Image },
  { value: 'script', label: 'Video Script', icon: Video }
];

export const tones = [
  'Professional', 'Casual', 'Friendly', 'Formal', 'Persuasive', 'Informative', 'Creative', 'Urgent'
];

export const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese'
];

export const recentGenerationsData = [
  { title: 'Blog Post: AI Marketing Trends', time: '2 hours ago', type: 'blog' },
  { title: 'Product Description: Smart Watch', time: '5 hours ago', type: 'product' },
  { title: 'Email Copy: Newsletter Template', time: '1 day ago', type: 'email' }
];

export const generateMockContent = (prompt: string, contentType: string, tone: string, language: string, length: number, creativity: number): string => {
  return `# Sample Generated Content

This is a sample generated content based on your prompt: "${prompt}"

Content Type: ${contentType}
Tone: ${tone}
Language: ${language}
Length: ~${length} words
Creativity Level: ${creativity}%

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Key Points:
- Professional tone maintained throughout
- SEO-optimized content structure
- Engaging introduction and conclusion
- Clear call-to-action included

This content is ready to use and can be further customized based on your specific needs.`;
};