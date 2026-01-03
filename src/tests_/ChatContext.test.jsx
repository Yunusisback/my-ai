import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ChatProvider, useChat } from '../context/ChatContext'; 
import * as aiService from '../api/aiService';


vi.mock('../api/aiService', () => ({
  sendMessage: vi.fn(),
}));

// Context değerlerini okuyup ekrana basan yardımcı bir test bileşeni
const TestComponent = () => {
  const { chats, handleNewChat, activeChatId } = useChat();
  return (
    <div>
      <div data-testid="chat-count">{chats.length}</div>
      <div data-testid="active-id">{activeChatId}</div>
      <button onClick={handleNewChat} data-testid="new-chat-btn">New Chat</button>
    </div>
  );
};

describe('ChatContext Integration Tests', () => {
  beforeEach(() => {

    // Her testten önce temizlik yapma
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('başlangıçta en az bir varsayılan sohbet oluşturulmalı', async () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    // useEffectin çalışıp handleNewChati tetiklemesini bekliyoruz
    await waitFor(() => {
      const count = screen.getByTestId('chat-count').textContent;
      expect(Number(count)).toBeGreaterThan(0);
    });
  });

  test('handleNewChat yeni bir sohbet eklemeli', async () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    const newBtn = screen.getByTestId('new-chat-btn');
    
    // Butona tıklayıp yeni sohbet oluşturuyoruz
    await act(async () => {
      newBtn.click();
    });

    await waitFor(() => {
        
      // Başlangıç sohbeti (1) + yeni eklenen (1) = 2 olmalı
      expect(screen.getByTestId('chat-count').textContent).toBe('2');
    });
  });

  test('localStorage kaydı düzgün çalışmalı', async () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    // Sohbetlerin localStorage'a yazıldığını kontrol ediyoruz
    await waitFor(() => {
      const savedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      expect(savedHistory.length).toBeGreaterThan(0);
    });
  });
});