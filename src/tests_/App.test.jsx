import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from '../App';
import * as aiService from '../api/aiService';

// mock
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

// aiService sendMessage fonksiyonunu mockla
vi.mock('../api/aiService', () => ({
  sendMessage: vi.fn()
}));

describe('App Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    
    vi.stubGlobal('SpeechRecognition', vi.fn(function() {
      this.start = vi.fn();
      this.stop = vi.fn();
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete window.SpeechRecognition;
  });

  it('Uygulama açıldığında Welcome Screen ve Sidebar görünmeli', () => {
    render(<App />);
    expect(screen.getByText('MyAI')).toBeInTheDocument();
    expect(screen.getAllByTestId('lottie-animation').length).toBeGreaterThan(0);
    // Chat input görünmeli
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('Mesaj gönderildiğinde ekrana düşmeli ve API çağrılmalı', async () => {
    const user = userEvent.setup();
    
    const mockSendMessage = aiService.sendMessage;
    mockSendMessage.mockImplementation(async (messages, model, onStreamChunk, onStreamEnd) => {
      await new Promise(resolve => setTimeout(resolve, 10));
      onStreamChunk('Mer');
      await new Promise(resolve => setTimeout(resolve, 10));
      onStreamChunk('haba');
      onStreamEnd();
    });

    render(<App />);
    
    // 1 Inputa mesaj yaz 
    const inputs = screen.getAllByRole('textbox');
    const chatInput = inputs[inputs.length - 1]; // Genelde sondaki input chat inputtur
    
    await user.type(chatInput, 'Merhaba AI');
    fireEvent.keyDown(chatInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    // 2 API çağrıldı mı?
    await waitFor(() => {
       expect(mockSendMessage).toHaveBeenCalled();
    });

    // 3  Kullanıcı mesajı ekrana geldi mi?
    
    await waitFor(() => {
        const userMessages = screen.getAllByText('Merhaba AI');
        expect(userMessages.length).toBeGreaterThan(0);
    });
    
    // 4. AI yanıtı ("Merhaba") ekrana geldi mi?
    await waitFor(() => {
        const aiMessages = screen.getAllByText('Merhaba');
        expect(aiMessages.length).toBeGreaterThan(0);
    });
  });

  it('Ayarlar menüsünden kullanıcı adı değiştirilebilmeli', async () => {
    render(<App />);
    
    // 1 Sidebardaki kullanıcı profiline tıkla (Misafir)
    const profileButton = screen.getByText('Misafir').closest('button');
    fireEvent.click(profileButton);

    // 2 Ayarlar Modalı açıldı mı?
    expect(screen.getByText('Kullanıcı Adı')).toBeInTheDocument();

    // 3 Düzenleye bas
    fireEvent.click(screen.getByText('Düzenle'));

    // 4  Yeni isim yaz
    const allInputs = screen.getAllByRole('textbox');
    const nameInput = allInputs.find(i => i.value === 'Misafir');
    
    if (!nameInput) throw new Error("İsim değiştirme inputu bulunamadı");

    fireEvent.change(nameInput, { target: { value: 'Yeni Kullanıcı' } });
    
    // 5 Kaydet input yanındaki buton
    const saveButton = nameInput.nextElementSibling;
    fireEvent.click(saveButton);

    // 6 İsim güncellendi mi?
    await waitFor(() => {
        const newNameElements = screen.getAllByText('Yeni Kullanıcı');
        expect(newNameElements.length).toBeGreaterThan(0);
    });
  });

  it('Yeni Sohbet başlatıldığında ekran temizlenmeli', async () => {
    render(<App />);
    
    // Sidebar'daki "Yeni Sohbet" butonuna bas
    // Buton metninden bulalım
    const newChatTexts = screen.getAllByText('Yeni Sohbet');
    const newChatBtn = newChatTexts[0].closest('button');
    
    fireEvent.click(newChatBtn);
    
    // Input boş olmalı
    const inputs = screen.getAllByRole('textbox');
    const chatInput = inputs[inputs.length - 1];
    expect(chatInput.value).toBe('');

    // Logo animasyonu görünmeli 
    expect(screen.getAllByTestId('lottie-animation').length).toBeGreaterThan(0);
  });
});