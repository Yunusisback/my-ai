import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../components/Header';

// mock
vi.mock('lottie-react', () => ({
  default: () => <div data-testid="eye-animation">Eye Animation</div>
}));

describe('Header Component', () => {
  // Mock fonksiyonlar
  const mockSetShowSidebar = vi.fn();
  const mockToggleDarkMode = vi.fn();
  const mockToggleLanguage = vi.fn();
  const mockSetSelectedModel = vi.fn();
  const mockOnExportChat = vi.fn();
  const mockOnToggleSettings = vi.fn();

  // Varsayılan props
  const defaultProps = {
    showSidebar: true, // Varsayılan açık
    setShowSidebar: mockSetShowSidebar,
    darkMode: false,
    toggleDarkMode: mockToggleDarkMode,
    language: 'tr',
    toggleLanguage: mockToggleLanguage,
    selectedModel: 'llama-3.1-8b-instant',
    setSelectedModel: mockSetSelectedModel,
    onExportChat: mockOnExportChat,
    onToggleSettings: mockOnToggleSettings,
    chats: [],
    activeChatId: null
  };

  it('Sidebar AÇIK olduğunda sidebar açma butonu ve logo GİZLENMELİ', () => {
    render(<Header {...defaultProps} showSidebar={true} />);
    
    // PanelLeft ikonu (sidebar açma butonu) olmamalı
    // İkonu bulmak için buton role'üne bakabiliriz ama test id olmadığı için container query veya querySelector
    // En kolayı Lottie animasyonuna bakmak (sadece sidebar kapalıyken var)
    expect(screen.queryByTestId('eye-animation')).not.toBeInTheDocument();
  });

  it('Sidebar KAPALI olduğunda sidebar açma butonu ve logo GÖRÜNMELİ', () => {
    render(<Header {...defaultProps} showSidebar={false} />);
    
    // Logo animasyonu görünmeli
    expect(screen.getByTestId('eye-animation')).toBeInTheDocument();

    // Sidebar açma butonu 
    const buttons = screen.getAllByRole('button');
    const sidebarToggleBtn = buttons[0];

    fireEvent.click(sidebarToggleBtn);
    expect(mockSetShowSidebar).toHaveBeenCalledWith(true);
  });

  it('Tarih doğru formatta gösterilmeli', () => {
    // Bugünün tarihini formatla
    const today = new Date().toLocaleDateString('tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    render(<Header {...defaultProps} />);
    expect(screen.getByText(today)).toBeInTheDocument();
  });

  it('Seçili model ismi gösterilmeli ve dropdown çalışmalı', () => {
    render(<Header {...defaultProps} selectedModel="llama-3.1-8b-instant" />);

    // Model ismini içeren butonu bul
    const modelButton = screen.getByText('Llama 3.1 8B');
    expect(modelButton).toBeInTheDocument();

    // Dropdown kapalı olmalı (Diğer modeller görünmemeli)
    expect(screen.queryByText('Mixtral 8x7B')).not.toBeInTheDocument();

    // Butona tıkla (Dropdown aç)
    fireEvent.click(modelButton);

    // Şimdi diğer modeller görünmeli
    expect(screen.getByText('Mixtral 8x7B')).toBeInTheDocument();
    expect(screen.getByText('Llama 3.1 70B')).toBeInTheDocument();

    // Bir modele tıkla (Örn Mixtral)
    // Parent butona tıklamak gerekiyor
    const mixtralOption = screen.getByText('Mixtral 8x7B').closest('button');
    fireEvent.click(mixtralOption);

    // Fonksiyon doğru parametreyle çağrıldı mı?
    expect(mockSetSelectedModel).toHaveBeenCalledWith('mixtral-8x7b');
  });

  it('Dil değiştirme butonu çalışmalı (TR -> EN)', () => {
    render(<Header {...defaultProps} language="tr" />);
    
    // Butonda "EN" yazmalı (Tıklayınca EN olacak anlamında)
    const langButton = screen.getByText('EN');
    
    fireEvent.click(langButton);
    expect(mockToggleLanguage).toHaveBeenCalled();
  });

  it('Dark Mode butonu çalışmalı', () => {
    render(<Header {...defaultProps} />);
    
  
    
    const buttons = screen.getAllByRole('button');
    const themeButton = buttons[2]; 
    
    fireEvent.click(themeButton);
    expect(mockToggleDarkMode).toHaveBeenCalled();
  });

  it('Ayarlar ve İndirme butonları çalışmalı', () => {
    render(<Header {...defaultProps} />);
    
    const buttons = screen.getAllByRole('button');
    // Sıra: Model(0)  Lang(1) Theme(2) Settings(3) Download(4)
    
    const settingsButton = buttons[3];
    fireEvent.click(settingsButton);
    expect(mockOnToggleSettings).toHaveBeenCalled();

    const downloadButton = buttons[4];
    fireEvent.click(downloadButton);
    expect(mockOnExportChat).toHaveBeenCalled();
  });
});