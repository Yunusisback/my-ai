import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatMessage from '../components/ChatMessage';

// mock
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
    expect(screen.queryByTestId('ai-animation')).not.toBeInTheDocument();
  });

  it('AI mesajı doğru render edilmeli (Lottie Animasyonu)', () => {
    render(<ChatMessage message="Cevap veriyorum..." role="assistant" darkMode={false} />);
    expect(screen.getByTestId('ai-animation')).toBeInTheDocument();
    expect(screen.getByText('Cevap veriyorum...')).toBeInTheDocument();
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
    expect(screen.getByTestId('code-block')).toHaveTextContent("console.log('test');");
  });

  it('Mesaj yüklenirken (boş mesaj) TypingIndicator görünmeli', () => {
    render(<ChatMessage message="" role="assistant" darkMode={true} />);
    const dots = document.querySelectorAll('.typing-dot');
    expect(dots.length).toBeGreaterThan(0);
  });

 
  it('Kopyalama butonuna basıldığında panoya kopyalamalı ve İKON DEĞİŞMELİ', async () => {
    render(<ChatMessage message="Kopyalanacak metin" role="assistant" darkMode={false} />);

    // Hover tetikle
    const container = screen.getByText('Kopyalanacak metin').closest('div');
    fireEvent.mouseEnter(container);

    // Butonu title özelliğinden bulmak en garantisidir
    const copyButton = screen.getByTitle('Kopyala');
    fireEvent.click(copyButton);

    // 1 Panoya kopyalandı mı?
    expect(mockWriteText).toHaveBeenCalledWith('Kopyalanacak metin');

    // 2  İkon değişti mi?
    await waitFor(() => {
        // SVG içinde "lucide-check" clası var mı?
        const checkIcon = copyButton.querySelector('.lucide-check');
        expect(checkIcon).toBeInTheDocument();
    });
  });

  it('Beğen (ThumbsUp) butonuna basıldığında aktif olmalı', () => {
    render(<ChatMessage message="Güzel cevap" role="assistant" darkMode={false} />);
    
    const textElement = screen.getByText('Güzel cevap');
    fireEvent.mouseEnter(textElement);

    // ThumbsUp butonunu bul 
    const upButton = screen.getAllByRole('button')[1];
    
    fireEvent.click(upButton);
    expect(upButton.className).toContain('text-green-500');

    fireEvent.click(upButton);
    expect(upButton.className).not.toContain('text-green-500');
  });
});