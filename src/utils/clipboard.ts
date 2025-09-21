import { toast } from 'sonner@2.0.3';

/**
 * Robust clipboard copy utility with multiple fallback methods
 * Works in various environments including iframes and restricted contexts
 */
export async function copyToClipboard(text: string, options?: {
  successMessage?: string;
  errorMessage?: string;
  showModal?: boolean;
}): Promise<boolean> {
  const {
    successMessage = 'Content copied to clipboard!',
    errorMessage = 'Unable to copy content. Please select and copy manually.',
    showModal = true
  } = options || {};

  if (!text) {
    toast.error('No content to copy');
    return false;
  }

  try {
    // Method 1: Modern Clipboard API (preferred)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard API failed, trying fallback methods:', err);
  }

  try {
    // Method 2: Legacy document.execCommand (fallback)
    if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.setAttribute('readonly', '');
      textArea.setAttribute('contenteditable', 'true');
      
      document.body.appendChild(textArea);
      
      // Select the text
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);
      
      // Attempt to copy
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success(successMessage);
        return true;
      }
    }
  } catch (err) {
    console.warn('execCommand copy failed:', err);
  }

  try {
    // Method 3: Manual selection fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.readOnly = true;
    
    document.body.appendChild(textArea);
    
    // For mobile devices
    if (/ipad|iphone/i.test(navigator.userAgent)) {
      textArea.contentEditable = 'true';
      textArea.readOnly = false;
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      toast.success(successMessage);
      return true;
    }
  } catch (err) {
    console.warn('Manual selection copy failed:', err);
  }

  // Method 4: Last resort - show content in a modal for manual copy
  if (showModal) {
    try {
      showCopyModal(text);
      toast.info('Automatic copy failed. Please copy manually from the dialog.');
      return false;
    } catch (err) {
      console.error('All copy methods failed:', err);
    }
  }

  toast.error(errorMessage);
  return false;
}

/**
 * Show a modal dialog for manual copying when automatic methods fail
 */
function showCopyModal(text: string): void {
  // Create modal elements
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: var(--form-bg);
    color: var(--form-text);
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.6);
    max-width: min(600px, 90vw);
    max-height: min(500px, 80vh);
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: flex;
    flex-direction: column;
  `;
  
  const title = document.createElement('h3');
  title.textContent = 'Copy Content Manually';
  title.style.cssText = `
    margin: 0 0 16px 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--form-text);
  `;
  
  const instructions = document.createElement('p');
  instructions.innerHTML = 'Automatic copy failed. Please <strong>select all text below</strong> and copy manually:<br><code>Ctrl+C</code> (Windows/Linux) or <code>Cmd+C</code> (Mac)';
  instructions.style.cssText = `
    margin: 0 0 16px 0;
    font-size: 14px;
    color: var(--form-text);
    opacity: 0.9;
    line-height: 1.5;
  `;
  
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.readOnly = true;
  textarea.style.cssText = `
    width: 100%;
    height: 240px;
    padding: 12px;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-size: 13px;
    line-height: 1.4;
    background: var(--form-input-bg);
    color: var(--form-text);
    border: none;
    border-radius: 8px;
    resize: none;
    margin-bottom: 20px;
    outline: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  `;
  
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  `;

  const selectAllButton = document.createElement('button');
  selectAllButton.textContent = 'Select All';
  selectAllButton.style.cssText = `
    padding: 10px 16px;
    background: var(--form-input-bg);
    color: var(--form-text);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  `;
  
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.cssText = `
    padding: 10px 20px;
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
  `;
  
  // Button hover effects
  selectAllButton.onmouseover = () => {
    selectAllButton.style.background = 'var(--form-hover-bg)';
    selectAllButton.style.transform = 'translateY(-1px)';
  };
  selectAllButton.onmouseout = () => {
    selectAllButton.style.background = 'var(--form-input-bg)';
    selectAllButton.style.transform = 'translateY(0)';
  };

  closeButton.onmouseover = () => {
    closeButton.style.transform = 'translateY(-1px)';
    closeButton.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
  };
  closeButton.onmouseout = () => {
    closeButton.style.transform = 'translateY(0)';
    closeButton.style.boxShadow = '0 2px 6px rgba(99, 102, 241, 0.3)';
  };
  
  // Event listeners
  selectAllButton.onclick = () => {
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
  };

  closeButton.onclick = () => {
    document.body.removeChild(overlay);
  };

  overlay.onclick = (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  };

  // Handle escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      document.body.removeChild(overlay);
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
  
  // Build modal
  modal.appendChild(title);
  modal.appendChild(instructions);
  modal.appendChild(textarea);
  buttonContainer.appendChild(selectAllButton);
  buttonContainer.appendChild(closeButton);
  modal.appendChild(buttonContainer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Auto-select the text after a brief delay
  setTimeout(() => {
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
  }, 100);
}

/**
 * Quick copy function for simple use cases
 */
export function quickCopy(text: string, successMessage?: string): Promise<boolean> {
  return copyToClipboard(text, { 
    successMessage, 
    showModal: false 
  });
}