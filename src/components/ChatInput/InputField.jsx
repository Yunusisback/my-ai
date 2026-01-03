import { useEffect, useRef } from 'react';

export default function InputField({ input, setInput, handleKeyDown, setIsFocused, loading, darkMode, placeholderText }) {
  const textareaRef = useRef(null);

  // Input değiştikçe yüksekliği otomatik ayarla
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 128);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholderText || "Mesajınızı yazın..."} 
      disabled={loading}
      className={`flex-1 bg-transparent outline-none border-none text-sm resize-none py-3 px-1 max-h-32 no-scrollbar leading-relaxed ${
        darkMode ? 'text-white placeholder-white/30' : 'text-black placeholder-black/30'
      } disabled:opacity-50 focus:outline-none focus:ring-0`}
      style={{ boxShadow: 'none' }}
    />
  );
}