import { User, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Lottie from 'lottie-react';
import logoAnimation from '../assets/logo-animation.json';

// Yazıyor animasyonu bileşeni
const TypingIndicator = ({ darkMode }) => (
  <div className="flex items-center gap-1 p-2 h-6 mt-1">
    <div className={`w-1.5 h-1.5 rounded-full typing-dot animate-bounce ${darkMode ? 'bg-zinc-400' : 'bg-zinc-500'}`}></div>
    <div className={`w-1.5 h-1.5 rounded-full typing-dot animate-bounce [animation-delay:0.2s] ${darkMode ? 'bg-zinc-400' : 'bg-zinc-500'}`}></div>
    <div className={`w-1.5 h-1.5 rounded-full typing-dot animate-bounce [animation-delay:0.4s] ${darkMode ? 'bg-zinc-400' : 'bg-zinc-500'}`}></div>
  </div>
);

// Performans için memo ile sarmalıyoruz
const ChatMessage = memo(({ message, role, darkMode }) => {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState(null);

  const handleCopy = () => {
    if (!message) return;
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReaction = (type) => {
    setReaction(prev => prev === type ? null : type);
  };

  // Asistan henüz cevap üretmeye başlamadıysa yazıyor animasyonunu göster
  const showTyping = !isUser && (!message || message.trim() === '');

  return (
    <div className={`flex gap-4 sm:gap-6 ${isUser ? 'flex-row-reverse' : 'flex-row'} group animate-fadeIn`}>
      
      {/* Profil İkonu / Logo Bölümü */}
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm transition-all duration-300 ${
        isUser 
          ? (darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-600')
          : 'bg-transparent border-transparent'
      }`}>
        {isUser ? <User className="w-5 h-5 sm:w-6 sm:h-6" /> : (
          <div className="w-10 h-10 sm:w-12 sm:h-12">
            <Lottie animationData={logoAnimation} loop={true} />
          </div>
        )}
      </div>

      {/* Mesaj İçeriği */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`relative px-4 py-3 rounded-2xl transition-all duration-300 ${
          isUser 
            ? (darkMode ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-800')
            : 'w-full'
        }`}>
          {showTyping ? (
            <TypingIndicator darkMode={darkMode} />
          ) : (
            <div className={`prose max-w-none wrap-break-word ${darkMode ? 'prose-invert' : ''}`}>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="my-4 rounded-lg overflow-hidden border border-white/5">
                        <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-900/50 text-zinc-400 text-xs font-mono">
                          <span>{match[1]}</span>
                        </div>
                        <SyntaxHighlighter
                          style={darkMode ? vscDarkPlus : vs}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, padding: '1rem', fontSize: '0.875rem' }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="px-1.5 py-0.5 rounded bg-zinc-500/10 font-mono text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Aksiyon Butonları ) */}
        {!isUser && !showTyping && (
          <div className="flex items-center gap-1 mt-2 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleCopy} 
              title="Kopyala"
              className={`p-1.5 rounded-md transition-all ${
                darkMode ? 'hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-green-500 lucide-check" /> : <Copy className="w-4 h-4" />}
            </button>
            
            <button 
              onClick={() => handleReaction('up')} 
              className={`p-1.5 rounded-md transition-all ${
                reaction === 'up' ? 'text-green-500 bg-green-500/10' : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>

            <button 
              onClick={() => handleReaction('down')} 
              className={`p-1.5 rounded-md transition-all ${
                reaction === 'down' ? 'text-red-500 bg-red-500/10' : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default ChatMessage;