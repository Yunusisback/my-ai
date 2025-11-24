import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WelcomeScreen from '../components/WelcomeScreen';

//mock
vi.mock('lottie-react', () => ({
  default: () => <div data-testid="welcome-animation">Welcome Animation</div>
}));

describe('WelcomeScreen Component', () => {
  const mockOnPromptSelect = vi.fn();

  // Örnek veri 
  const mockT = {
    welcomeTitle: 'Hoş Geldiniz',
    prompts: [
      { text: 'Kod Yaz', prompt: 'Bana bir React kodu yaz' },
      { text: 'Hata Düzelt', prompt: 'Bu hatayı nasıl çözerim?' },
      { text: 'Planla', prompt: 'Tatil planı yap' },
      { text: 'Çeviri', prompt: 'İngilizceye çevir' }
    ]
  };

  it('Başlık ve animasyon doğru render edilmeli', () => {
    render(
      <WelcomeScreen 
        t={mockT} 
        darkMode={false} 
        onPromptSelect={mockOnPromptSelect} 
      />
    );

    expect(screen.getByText('Hoş Geldiniz')).toBeInTheDocument();
    expect(screen.getByTestId('welcome-animation')).toBeInTheDocument();
  });

  it('Tüm prompt kartları render edilmeli', () => {
    render(
      <WelcomeScreen 
        t={mockT} 
        darkMode={false} 
        onPromptSelect={mockOnPromptSelect} 
      />
    );

    // 4 tane prompt vermiştik 4 tane kart (buton) olmalı
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);

    // İçerikleri kontrol et
    expect(screen.getByText('Kod Yaz')).toBeInTheDocument();
    expect(screen.getByText('Tatil planı yap')).toBeInTheDocument();
  });

  it('Karta tıklandığında onPromptSelect doğru prompt ile çağrılmalı', () => {
    render(
      <WelcomeScreen 
        t={mockT} 
        darkMode={false} 
        onPromptSelect={mockOnPromptSelect} 
      />
    );

  

    // Önce metni bul
    const promptText = screen.getByText('Bana bir React kodu yaz');
    
    // Metnin içinde bulunduğu butonu bul (.closest('button'))
    const cardButton = promptText.closest('button');
    
    fireEvent.click(cardButton);

    expect(mockOnPromptSelect).toHaveBeenCalledWith('Bana bir React kodu yaz');
  });
});