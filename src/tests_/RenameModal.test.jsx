import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RenameModal from '../components/RenameModal';

describe('RenameModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnRename = vi.fn();

  // Test için sahte çeviri nesnesi
  const mockT = {
    renameTitle: 'Sohbeti Yeniden Adlandır',
    newChat: 'Yeni sohbet adı...',
    cancel: 'Vazgeç',
    rename: 'Kaydet'
  };

  it('isOpen={false} olduğunda hiçbir şey render edilmemeli', () => {
    const { container } = render(
      <RenameModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onRename={mockOnRename} 
        initialValue="Eski İsim" 
        t={mockT} 
      />
    );

    // Container boş olmalı
    expect(container).toBeEmptyDOMElement();
  });

  it('Modal açıldığında doğru başlık ve başlangıç değeri ile gelmeli', () => {
    render(
      <RenameModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onRename={mockOnRename} 
        initialValue="React Projesi" 
        t={mockT} 
      />
    );

    // Başlık görünüyor mu?
    expect(screen.getByText('Sohbeti Yeniden Adlandır')).toBeInTheDocument();

    // Input değeri initialValue ile aynı mı?
    const input = screen.getByRole('textbox');
    expect(input.value).toBe('React Projesi');
  });

  it('Input boşken Kaydet butonu DISABLED (pasif) olmalı', () => {
    render(
      <RenameModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onRename={mockOnRename} 
        initialValue="" // Boş başlatıyoruz
        t={mockT} 
      />
    );

    const submitButton = screen.getByText('Kaydet');
    expect(submitButton).toBeDisabled();
    
    // Inputa sadece boşluk yazarsak da disabled kalmalı
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } });
    expect(submitButton).toBeDisabled();
  });

  it('Yeni isim yazıp gönderildiğinde onRename çağrılmalı', () => {
    render(
      <RenameModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onRename={mockOnRename} 
        initialValue="Eski" 
        t={mockT} 
      />
    );

    const input = screen.getByRole('textbox');
    const submitButton = screen.getByText('Kaydet');

    // Yeni isim yaz
    fireEvent.change(input, { target: { value: 'Yeni Proje İsmi' } });
    
    // Butona tıkla
    fireEvent.click(submitButton);

    // onRename doğru parametreyle çağrıldı mı?
    expect(mockOnRename).toHaveBeenCalledWith('Yeni Proje İsmi');
    
    // İşlem bitince modal kapanmalı 
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('Enter tuşuna basıldığında form gönderilmeli', () => {
    render(
      <RenameModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onRename={mockOnRename} 
        initialValue="Test" 
        t={mockT} 
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Enter Denemesi' } });

    // Form submit olayını tetikle 
    fireEvent.submit(input.closest('form'));

    expect(mockOnRename).toHaveBeenCalledWith('Enter Denemesi');
  });

  it('İptal butonuna basıldığında onClose çağrılmalı', () => {
    render(
      <RenameModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onRename={mockOnRename} 
        initialValue="Test" 
        t={mockT} 
      />
    );

    const cancelButton = screen.getByText('Vazgeç');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('Arka plana (Backdrop) tıklandığında modal kapanmalı', () => {
    render(
      <RenameModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onRename={mockOnRename} 
        initialValue="Test" 
        t={mockT} 
      />
    );

   
    const backdrop = document.querySelector('.bg-black\\/60'); // Tailwind class escape işlemi
    
    if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalled();
    } else {
        throw new Error("Backdrop elementi bulunamadı");
    }
  });
});