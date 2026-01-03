import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatMessage from '../components/ChatMessage';


vi.mock('lottie-react', () => ({
  default: () => <div data-testid="ai-animation">AI Animation</div>
}));

vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }) => <pre data-testid="code-block">{children}</pre>
}));

vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
  vs: {}
}));

describe('ChatMessage Component', () => {
  const mockWriteText = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
 
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  it('Kullanıcı mesajı doğru render edilmeli (User Icon ve Metin)', () => {
    render(<ChatMessage message="Merhaba AI" role="user" darkMode={false} />);
    expect(screen.getByText('Merhaba AI')).toBeInTheDocument();

    // Kullanıcı mesajında AI animasyonu olmamalı
    expect(screen.queryByTestId('ai-animation')).not.toBeInTheDocument();
  });

  it('AI mesajı doğru render edilmeli (Lottie Animasyonu ve Metin)', () => {
    render(<ChatMessage message="Sana nasıl yardımcı olabilirim?" role="assistant" darkMode={false} />);
    expect(screen.getByTestId('ai-animation')).toBeInTheDocument();
    expect(screen.getByText('Sana nasıl yardımcı olabilirim?')).toBeInTheDocument();
  });

  it('Markdown içeriği doğru işlenmeli (Bold ve Link)', () => {
    const markdownMsg = "Bu **kalın** ve bu [link](https://google.com)";
    render(<ChatMessage message={markdownMsg} role="assistant" darkMode={false} />);
    
    const strongTag = screen.getByText('kalın');
    expect(strongTag.tagName).toBe('STRONG');

    const linkTag = screen.getByText('link');
    expect(linkTag.tagName).toBe('A');
    expect(linkTag).toHaveAttribute('href', 'https://google.com');
  });

  it('Kod bloğu algılandığında SyntaxHighlighter kullanılmalı', () => {
    const codeMsg = "```javascript\nconsole.log('test');\n```";
    render(<ChatMessage message={codeMsg} role="assistant" darkMode={true} />);
    const codeBlock = screen.getByTestId('code-block');
    expect(codeBlock).toBeInTheDocument();
    expect(codeBlock).toHaveTextContent("console.log('test');");
  });

  it('Mesaj yüklenirken (boş mesaj) TypingIndicator görünmeli', () => {
    render(<ChatMessage message="" role="assistant" darkMode={true} />);
    const dots = document.querySelectorAll('.typing-dot');
    
    // 3 adet animasyon noktası olmalı
    expect(dots.length).toBe(3);
  });

  it('Kopyalama butonuna basıldığında panoya kopyalamalı ve ikon değişmeli', async () => {
    render(<ChatMessage message="Kopyalanacak metin" role="assistant" darkMode={false} />);

    // Kopyala butonunu bul 
    const copyButton = screen.getByTitle('Kopyala');
    fireEvent.click(copyButton);

    // Clipboard çağrıldı mı?
    expect(mockWriteText).toHaveBeenCalledWith('Kopyalanacak metin');

    // İkonun 'check' ikonuna dönüştüğünü kontrol et
    await waitFor(() => {
        const checkIcon = copyButton.querySelector('.lucide-check');
        expect(checkIcon).toBeInTheDocument();
    });
  });

  it('Beğen (ThumbsUp) butonuna basıldığında aktif/pasif durumu değişmeli', () => {
    render(<ChatMessage message="Harika bir cevap" role="assistant" darkMode={false} />);
    
    // ThumbsUp butonunu (ilk aksiyon butonlarından biri) buluyoruz
    // isUser false ve showTyping false iken butonlar render edilir
    const buttons = screen.getAllByRole('button');
    const upButton = buttons[1]; // İlk buton Kopyala ikkinci ThumbsUp
    
    // Tıkla: Aktif olmalı
    fireEvent.click(upButton);
    expect(upButton.className).toContain('text-green-500');

    // Tekrar tıkla: Pasif olmalı
    fireEvent.click(upButton);
    expect(upButton.className).not.toContain('text-green-500');
  });
});