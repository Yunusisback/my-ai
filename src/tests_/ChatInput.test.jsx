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
    
  
    const MockSpeechRecognition = vi.fn(function() {
      this.start = vi.fn();
      this.stop = vi.fn();
      this.lang = '';
    });
    vi.stubGlobal('SpeechRecognition', MockSpeechRecognition);
    vi.stubGlobal('webkitSpeechRecognition', MockSpeechRecognition);

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'mock-url'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Bileşen alt parçalarıyla (InputField vb.) doğru render edilmeli', () => {
    render(<ChatInput input="" setInput={mockSetInput} loading={false} placeholderText="Test Mesajı..." />);
    expect(screen.getByPlaceholderText('Test Mesajı...')).toBeInTheDocument();
  });

  it('Kullanıcı InputField üzerinden yazı yazdığında setInput tetiklenmeli', async () => {
    const user = userEvent.setup();
    render(<ChatInput input="" setInput={mockSetInput} />);
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Merhaba');
    expect(mockSetInput).toHaveBeenCalled(); 
  });

  it('Enter tuşuna basıldığında onSend tetiklenmeli', () => {
    render(<ChatInput input="Merhaba" setInput={mockSetInput} onSend={mockOnSend} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });
    expect(mockOnSend).toHaveBeenCalledTimes(1);
  });

 
  it('Loading durumunda Durdur butonu görünmeli ve onStop çalışmalı', () => {
    render(<ChatInput input="Soru..." loading={true} onStop={mockOnStop} />);
    
    
    const stopButton = screen.getByRole('button', { name: /durdur/i }); 
    fireEvent.click(stopButton);
    
    expect(mockOnStop).toHaveBeenCalledTimes(1);
  });

  it('FilePreview: Dosya seçildiğinde dosya adı görünmeli', async () => {
    const file = new File(['içerik'], 'dokuman.pdf', { type: 'application/pdf' });
    render(<ChatInput input="" setInput={mockSetInput} onSend={mockOnSend} />);

    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('dokuman.pdf')).toBeInTheDocument();
    });
  });

 
  it('VoiceControl: Sesli komut butonu tıklandığında tanıma başlamalı', () => {
    const mockStart = vi.fn();
    class MockSpeechRecognition {
      constructor() {
        this.start = mockStart;
        this.stop = vi.fn();
      }
    }
    vi.stubGlobal('SpeechRecognition', MockSpeechRecognition);

    render(<ChatInput input="" setInput={mockSetInput} />);
    
   
    const micButton = screen.getByRole('button', { name: /sesli komut/i }); 
    fireEvent.click(micButton);

    expect(mockStart).toHaveBeenCalled();
  });
});