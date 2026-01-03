import { useCallback } from 'react';

export const useChatActions = (setChats, setActiveChatId, activeChatId, handleNewChat) => {
  
  const handleDeleteChat = useCallback((id) => {
    setChats(prev => {
      const remaining = prev.filter(c => c.id !== id);
      if (activeChatId === id) {
        remaining.length > 0 ? setActiveChatId(remaining[0].id) : handleNewChat();
      }
      return remaining;
    });
  }, [activeChatId, handleNewChat, setChats, setActiveChatId]);

  const handleRenameSave = useCallback((newTitle, chatId) => {
    setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, title: newTitle } : c
    ));
  }, [setChats]);

  const handlePinChat = useCallback((id) => {
    setChats(prev => prev.map(chat => 
      chat.id === id ? { ...chat, pinned: !chat.pinned } : chat
    ));
  }, [setChats]);

  return { handleDeleteChat, handleRenameSave, handlePinChat };
};