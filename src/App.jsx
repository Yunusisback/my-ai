import { useRef, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import RenameModal from './components/RenameModal';
import { useChat } from './context/ChatContext';



function App() {
  const {
    showSidebar, setShowSidebar,
    darkMode, toggleDarkMode,
    language, toggleLanguage,
    chats, activeChatId, setActiveChatId,
    input, setInput,
    loading,
    showSettings, setShowSettings,
    username,
    selectedModel, setSelectedModel,
    renameModalData, setRenameModalData,
    t, messages,
    handleNewChat, handleUpdateUsername, handleDeleteChat,
    handleRenameStart, handleRenameSave, handlePinChat,
    handleClearChat, handleStop, handleSend
  } = useChat();

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  
  useEffect(() => scrollToBottom(), [messages]);

  const handleExportChat = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fileName = chats.find(c => c.id === activeChatId)?.title || 'chat';
    a.href = url;
    a.download = `${fileName}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex h-screen transition-colors duration-200 ${darkMode ? 'bg-[#09090b] text-white' : 'bg-white text-gray-900'}`}>
      <Sidebar
        showSidebar={showSidebar}
        toggleSidebar={() => setShowSidebar(!showSidebar)}
        darkMode={darkMode}
        t={t}
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={(id) => {
          setActiveChatId(id);
          if (window.innerWidth < 1024) setShowSidebar(false);
        }}
        onDeleteChat={handleDeleteChat}
        onRenameStart={handleRenameStart} 
        onPinChat={handlePinChat}
        onToggleSettings={() => setShowSettings(true)}
        username={username}
      />

      <div className={`
        flex-1 flex flex-col min-w-0 relative
        transition-all duration-300 ease-in-out
        ${showSidebar ? 'lg:ml-[280px]' : 'lg:ml-0'}
      `}>
        <Header
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          language={language}
          toggleLanguage={toggleLanguage}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          onExportChat={handleExportChat}
          onToggleSettings={() => setShowSettings(true)}
          chats={chats}
          activeChatId={activeChatId}
        />

        <Settings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          darkMode={darkMode}
          t={t}
          username={username}
          onUpdateUsername={handleUpdateUsername}
          onClearChat={handleClearChat}
        />

        <RenameModal 
          isOpen={renameModalData.isOpen}
          onClose={() => setRenameModalData({ ...renameModalData, isOpen: false })}
          onRename={handleRenameSave}
          initialValue={renameModalData.chat?.title}
          t={t}
          darkMode={darkMode}
        />

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {messages.length <= 1 ? (
              <WelcomeScreen t={t} darkMode={darkMode} onPromptSelect={setInput} />
            ) : (
              <div className="space-y-10 sm:space-y-12">
                {messages.slice(1).map((msg, i) => (
                  <div key={i} className="animate-fadeIn" style={{ animationDelay: `${i * 0.05}s` }}>
                    <ChatMessage message={msg.content} role={msg.role} darkMode={darkMode} />
                  </div>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}  
          onStop={handleStop}
          loading={loading}
          darkMode={darkMode}
          selectedModel={selectedModel}
          placeholderText={t.inputPlaceholder}
        />
      </div>
    </div>
  );
}

export default App;