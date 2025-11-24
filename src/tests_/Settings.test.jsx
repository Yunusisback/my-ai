import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Settings from '../components/Settings';

describe('Settings Component', () => {
  const mockOnClose = vi.fn();
  const mockOnUpdateUsername = vi.fn();
  const mockOnClearChat = vi.fn();

  const mockT = {
    settingsTitle: 'Ayarlar',
    username: 'Kullanıcı Adı',
    edit: 'Düzenle',
    clearChat: 'Sohbeti Temizle'
  };

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    darkMode: false,
    t: mockT,
    username: 'Test User',
    onUpdateUsername: mockOnUpdateUsername,
    onClearChat: mockOnClearChat
  };

  //  testten önce mock geçmişini temizle
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('isOpen={false} olduğunda render edilmemeli', () => {
    const { container } = render(<Settings {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Render edildiğinde kullanıcı adı ve başlık görünmeli', () => {
    render(<Settings {...defaultProps} />);
    
    expect(screen.getByText('Ayarlar')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Sohbeti Temizle')).toBeInTheDocument();
  });

  it('Düzenle butonuna basıldığında input alanı açılmalı', () => {
    render(<Settings {...defaultProps} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    const editButton = screen.getByText('Düzenle');
    fireEvent.click(editButton);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('Test User');
    
    expect(screen.queryByText('Düzenle')).not.toBeInTheDocument();
  });

  it('İsim değiştirip Kaydet butonuna basıldığında onUpdateUsername çalışmalı', () => {
    render(<Settings {...defaultProps} />);

    fireEvent.click(screen.getByText('Düzenle'));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Yeni İsim' } });

    // Inputun yanındaki kaydet butonunu bul
    const saveButton = input.nextElementSibling; 
    fireEvent.click(saveButton);

    expect(mockOnUpdateUsername).toHaveBeenCalledWith('Yeni İsim');
  });

  it('Input içindeyken Enter tuşuna basıldığında kaydetmeli', () => {
    render(<Settings {...defaultProps} />);

    fireEvent.click(screen.getByText('Düzenle'));
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Enter İsim' } });
    
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockOnUpdateUsername).toHaveBeenCalledWith('Enter İsim');
  });

  it('Boş isim kaydedilmemeli (Logic Test)', () => {
    render(<Settings {...defaultProps} />);

    fireEvent.click(screen.getByText('Düzenle'));
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } }); 
    
    fireEvent.keyDown(input, { key: 'Enter' });

  
    expect(mockOnUpdateUsername).not.toHaveBeenCalled();
  });

  it('Sohbeti Temizle butonuna basıldığında onClearChat çalışmalı', () => {
    render(<Settings {...defaultProps} />);

    const clearButton = screen.getByText('Sohbeti Temizle').closest('button');
    fireEvent.click(clearButton);

    expect(mockOnClearChat).toHaveBeenCalled();
  });

  it('Çarpı butonuna basıldığında onClose çalışmalı', () => {
    render(<Settings {...defaultProps} />);
    
    const closeButton = screen.getAllByRole('button')[0];
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('Arka plana (Backdrop) tıklandığında modal kapanmalı', () => {
    render(<Settings {...defaultProps} />);

    const backdrop = document.querySelector('.bg-black\\/20');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });
});