import { createContext, useContext, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { sendMessage } from '../api/aiService';
import { translations } from '../constants/translations';
import { readFile, formatApiMessages } from './chatUtils';
import { useChatActions } from './useChatActions';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
 
  const [showSidebar, setShowSidebar] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'tr');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem('chatHistory');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Sohbet geçmişi yüklenemedi:", e);
      return [];
    }
  });
  
  // Aktif sohbet kimliği
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Misafir');
  const [selectedModel, setSelectedModel] = useState('llama-3.1-8b-instant');
  const [renameModalData, setRenameModalData] = useState({ isOpen: false, chat: null });

  const tokenQueueRef = useRef([]);
  const typingIntervalRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isSubmittingRef = useRef(false);

  const t = translations[language] || translations['tr'];

  
  const messages = useMemo(() => {
    const chat = chats.find(c => c.id === activeChatId);
    return chat ? chat.messages : [];
  }, [chats, activeChatId]);

  const handleNewChat = useCallback(() => {
    const newId = Date.now();
    const welcome = language === 'tr' ? 'Merhaba! Size nasıl yardımcı olabilirim?' : 'Hello! How can I help you?';
    const newChat = {
      id: newId,
      title: language === 'tr' ? 'Yeni Sohbet' : 'New Chat',
      date: new Date().toISOString(),
      pinned: false,
      messages: [{ role: 'assistant', content: welcome }]
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newId);
    if (window.innerWidth < 1024) setShowSidebar(false);
  }, [language]);

 
  const { handleDeleteChat, handleRenameSave, handlePinChat } = useChatActions(
    setChats, 
    setActiveChatId, 
    activeChatId, 
    handleNewChat
  );

  // Modalı kapatma mantığını içeren  kaydetme fonksiyonu
  const finalHandleRenameSave = useCallback((newTitle) => {
    handleRenameSave(newTitle, renameModalData.chat?.id);
    setRenameModalData({ isOpen: false, chat: null }); 
  }, [handleRenameSave, renameModalData.chat]);

 // İlk yüklemede yeni sohbet oluştur veya mevcut sohbete geçiş yap
  useEffect(() => {
    if (chats.length === 0 && !activeChatId) {
      handleNewChat();
    } else if (chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id);
    }
  }, [handleNewChat, activeChatId, chats.length]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chats));
  }, [chats]);

 // Dil değiştirme fonksiyonu
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const newLang = prev === 'tr' ? 'en' : 'tr';
      localStorage.setItem('language', newLang);
      if (username === translations[prev].guest) {
        const newName = translations[newLang].guest;
        setUsername(newName);
        localStorage.setItem('username', newName);
      }
      return newLang;
    });
  }, [username]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', String(newMode));
      return newMode;
    });
  }, []);

  const handleUpdateUsername = useCallback((newName) => {
    setUsername(newName);
    localStorage.setItem('username', newName);
  }, []);

  const handleRenameStart = useCallback((chat) => {
    setRenameModalData({ isOpen: true, chat });
  }, []);

  const handleClearChat = useCallback(() => {
    setChats(prev => prev.map(c =>
      c.id === activeChatId ? { ...c, messages: [{ role: 'assistant', content: t.welcomeTitle || t.newChat }] } : c
    ));
    setShowSettings(false);
  }, [activeChatId, t]);

  // Sohbeti durdurma fonksiyonu
  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    clearInterval(typingIntervalRef.current);
    setLoading(false);
    isSubmittingRef.current = false;
  }, []);

  const handleSend = async (file = null) => {
    if ((!input.trim() && !file) || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setLoading(true);

    let currentChatId = activeChatId || Date.now();
    if (!activeChatId) handleNewChat();

    clearInterval(typingIntervalRef.current);
    tokenQueueRef.current = [];

    let uiContent = input;
    try {
      if (file) {
        const fileData = await readFile(file);
        uiContent += file.type.startsWith('image/') 
          ? `\n\n![Görsel](${fileData})` 
          : `\n\n--- ${file.name} ---\n\`\`\`\n${fileData}\n\`\`\``;
      }
    } catch (error) {
      console.error("Dosya hatası:", error);
      uiContent += "\n\n[Dosya Hatası]";
    }

    const userMessage = { role: 'user', content: uiContent };

    setChats(prev => prev.map(c => {
      if (c.id === currentChatId) {
        const isFirst = c.messages.length <= 1;
        const titleText = input.slice(0, 30) || (file ? "Dosya Gönderimi" : "Sohbet");
        return {
          ...c,
          title: isFirst ? titleText + (input.length > 30 ? '...' : '') : c.title,
          messages: [...c.messages, userMessage, { role: 'assistant', content: '' }]
        };
      }
      return c;
    }));

    setInput('');
    abortControllerRef.current = new AbortController();

    typingIntervalRef.current = setInterval(() => {
      if (tokenQueueRef.current.length > 0) {
        const char = tokenQueueRef.current.shift();
        setChats(prev => prev.map(chat => {
          if (chat.id === currentChatId) {
            const msgs = [...chat.messages];
            const lastIdx = msgs.length - 1;
            msgs[lastIdx] = { ...msgs[lastIdx], content: msgs[lastIdx].content + char };
            return { ...chat, messages: msgs };
          }
          return chat;
        }));
      }
    }, 10);

    try {
      const activeChatObj = chats.find(c => c.id === currentChatId) || { messages: [] };
      const apiMessages = formatApiMessages([...activeChatObj.messages, userMessage], language);

      await sendMessage(
        apiMessages,
        selectedModel,
        (token) => tokenQueueRef.current.push(...token.split('')),
        () => {
          const checkEnd = setInterval(() => {
            if (tokenQueueRef.current.length === 0) {
              clearInterval(checkEnd);
              clearInterval(typingIntervalRef.current);
              setLoading(false);
              isSubmittingRef.current = false;
            }
          }, 100);
        },
        abortControllerRef.current.signal
      );
    } catch (err) {
      if (err.name !== 'AbortError') console.error('API Hatası:', err);
      clearInterval(typingIntervalRef.current);
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  
  const value = {
    showSidebar, setShowSidebar, language, setLanguage, darkMode, setDarkMode,
    chats, setChats, activeChatId, setActiveChatId, input, setInput,
    loading, setLoading, showSettings, setShowSettings, username, setUsername,
    selectedModel, setSelectedModel, renameModalData, setRenameModalData,
    t, messages, handleNewChat, toggleLanguage, toggleDarkMode,
    handleUpdateUsername, handleDeleteChat, handleRenameStart, handlePinChat, 
    handleClearChat, handleStop, handleSend,
    handleRenameSave: finalHandleRenameSave 
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);