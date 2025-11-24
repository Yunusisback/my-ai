import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ChatInput from '../components/ChatInput';

describe('ChatInput Component', () => {
  const mockSetInput = vi.fn();
  const mockOnSend = vi.fn();
  const mockOnStop = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Standart function kullanarak constructor hatasını önlüyoruz
    const MockSpeechRecognition = vi.fn(function() {
      this.start = vi.fn();
      this.stop = vi.fn();
      this.lang = '';
    });
    vi.stubGlobal('SpeechRecognition', MockSpeechRecognition);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Testler arası window nesnesini temizle
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;
  });

  it('Bileşen doğru render edilmeli ve placeholder görünmeli', () => {
    render(
      <ChatInput 
        input="" 
        setInput={mockSetInput} 
        loading={false} 
        placeholderText="Test Mesajı..." 
      />
    );
    
    expect(screen.getByPlaceholderText('Test Mesajı...')).toBeInTheDocument();
    const sendButton = screen.getAllByRole('button')[2]; 
    expect(sendButton).toBeDisabled();
  });

  it('Kullanıcı yazı yazdığında setInput tetiklenmeli', async () => {
    const user = userEvent.setup();
    render(<ChatInput input="" setInput={mockSetInput} />);
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Merhaba');

    expect(mockSetInput).toHaveBeenCalled(); 
  });

  it('Enter tuşuna basıldığında mesaj gönderilmeli', () => {
    render(<ChatInput input="Merhaba" setInput={mockSetInput} onSend={mockOnSend} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockOnSend).toHaveBeenCalledTimes(1);
    expect(mockOnSend).toHaveBeenCalledWith(null);
  });

  it('Shift + Enter tuşuna basıldığında mesaj GÖNDERİLMEMELİ', () => {
    render(<ChatInput input="Merhaba" setInput={mockSetInput} onSend={mockOnSend} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('Loading durumunda Stop butonu görünmeli ve çalışmalı', () => {
    render(<ChatInput input="Soru..." loading={true} onStop={mockOnStop} />);

    const buttons = screen.getAllByRole('button');
    const stopButton = buttons[buttons.length - 1]; 
    
    fireEvent.click(stopButton);
    expect(mockOnStop).toHaveBeenCalledTimes(1);
  });

  it('Dosya seçildiğinde önizleme ve isim görünmeli', async () => {
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    render(<ChatInput input="" setInput={mockSetInput} onSend={mockOnSend} />);

    const fileInput = document.querySelector('input[type="file"]');
    await waitFor(() => {
        fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(screen.getByText('test.png')).toBeInTheDocument();
    
    const sendButton = screen.getAllByRole('button').find(btn => !btn.disabled && !btn.title);
    expect(sendButton).toBeInTheDocument();
  });

  it('Sesli komut butonu desteklenmeyen tarayıcıda uyarı vermeli', () => {
    // Özellikleri siliyoruz ki in window false dönsün
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<ChatInput input="" setInput={mockSetInput} />);
    
    const micButton = screen.getAllByRole('button')[1];
    fireEvent.click(micButton);

    expect(alertMock).toHaveBeenCalledWith('Tarayıcınız ses tanıma özelliğini desteklemiyor.');
  });

  it('Sesli komut desteklendiğinde kayıt başlamalı (Happy Path)', () => {
    const mockStart = vi.fn();

    //  Arrow function yerine class kullanıyoruz
    class MockSpeechRecognition {
      constructor() {
        this.start = mockStart;
        this.stop = vi.fn();
        this.lang = '';
        this.onstart = null;
        this.onresult = null;
        this.onerror = null;
        this.onend = null;
      }
    }

    vi.stubGlobal('SpeechRecognition', MockSpeechRecognition);

    render(<ChatInput input="" setInput={mockSetInput} />);
    
    const micButton = screen.getAllByRole('button')[1];
    fireEvent.click(micButton);

    expect(mockStart).toHaveBeenCalled();
  });
});