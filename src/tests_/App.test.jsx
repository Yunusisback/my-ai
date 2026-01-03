import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from '../App';
import { useChat } from '../context/ChatContext';

vi.mock('lottie-react', () => ({
  default: () => <div data-testid="lottie-animation">Animation</div>
}));

vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }) => <pre data-testid="code-block">{children}</pre>
}));

vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
  vs: {}
}));


vi.mock('../context/ChatContext', () => ({
  useChat: vi.fn()
}));

describe('App Integration Test', () => {
  let mockChatValues;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock verilerini hazırla 
    mockChatValues = {
      showSidebar: true,
      setShowSidebar: vi.fn(),
      darkMode: false,
      toggleDarkMode: vi.fn(),
      language: 'tr',
      toggleLanguage: vi.fn(),
      chats: [],
      activeChatId: null,
      setActiveChatId: vi.fn(),
      input: '', 
      setInput: vi.fn(),
      loading: false,
      showSettings: false,
      setShowSettings: vi.fn(),
      username: 'Misafir',
      selectedModel: 'llama-3.1-8b-instant',
      renameModalData: { isOpen: false, chat: null },
      setRenameModalData: vi.fn(),
      t: { 
        welcomeTitle: 'Hoş Geldiniz', 
        inputPlaceholder: 'Mesaj yaz...',
        newChat: 'Yeni Sohbet',
        username: 'Kullanıcı Adı',
        edit: 'Düzenle',
        prompts: [{ text: 'Kod Yaz', prompt: 'Bana kod yaz' }]
      },
      messages: [{ role: 'system', content: '' }],
      handleNewChat: vi.fn(),
      handleUpdateUsername: vi.fn(),
      handleDeleteChat: vi.fn(),
      handleRenameStart: vi.fn(),
      handleRenameSave: vi.fn(),
      handlePinChat: vi.fn(),
      handleClearChat: vi.fn(),
      handleStop: vi.fn(),
      handleSend: vi.fn()
    };

    useChat.mockReturnValue(mockChatValues);

    // DOM API mockları
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal('SpeechRecognition', vi.fn().mockImplementation(() => ({
      start: vi.fn(),
      stop: vi.fn()
    })));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Uygulama açıldığında Welcome Screen ve Sidebar görünmeli', () => {
    render(<App />);
    expect(screen.getByText('Hoş Geldiniz')).toBeInTheDocument();
    expect(screen.getByText('Misafir')).toBeInTheDocument();
  });

  it('Ayarlar menüsü açılabilmeli', () => {
    render(<App />);
    
    // Profil butonunu bul ve tıkla
    const profileButton = screen.getByText('Misafir').closest('button');
    fireEvent.click(profileButton);
    expect(mockChatValues.setShowSettings).toHaveBeenCalledWith(true);
  });

  it('Yeni Sohbet başlatıldığında handleNewChat çalışmalı', () => {
    render(<App />);

    // Yeni sohbet butonunu bul ve tıkla
    const newChatBtn = screen.getByText('Yeni Sohbet').closest('button');
    fireEvent.click(newChatBtn);
    expect(mockChatValues.handleNewChat).toHaveBeenCalled();
  });
});