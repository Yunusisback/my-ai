import { ArrowUp, Paperclip, Square } from 'lucide-react';
import { useState, useRef } from 'react';
import FilePreview from './FilePreview';
import InputField from './InputField';
import VoiceControl from './VoiceControl';

export default function ChatInput({ input, setInput, onSend, onStop, loading, darkMode, selectedModel, placeholderText }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSendClick();
    }
  };

  // Dosya Seçme İşlemi
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Eğer resimse önizleme oluştur
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  // Dosyayı Kaldırma İşlemi
  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Gönderme İşlemi
  const handleSendClick = () => {
    if ((!input.trim() && !selectedFile) || loading) return;
    onSend(selectedFile); 
    
    // Gönderim sonrası temizlik
    clearFile();
  };

  return (
    <div
      className={`border-t transition-colors ${
        darkMode ? 'border-white/5 bg-black/50 backdrop-blur-md' : 'border-black/5 bg-white/50 backdrop-blur-md'
      }`}
    >
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div
          className={`relative flex flex-col rounded-3xl px-3 py-3
            transition-all duration-300 ease-out
            ${
            darkMode 
              ? isFocused 
                ? 'bg-black border border-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]' 
                : 'bg-[#1a1a1a] border border-white/5 shadow-none hover:border-white/10' 
              : isFocused
                ? 'bg-white border border-gray-300 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]'
                : 'bg-white border border-gray-200 shadow-sm hover:border-gray-300'
          }`}
        >
          {/* Dosya Önizleme Alanı */}
          <FilePreview 
            selectedFile={selectedFile} 
            previewUrl={previewUrl} 
            clearFile={clearFile} 
            darkMode={darkMode} 
          />

          {/* Input Alanı Alt Satır */}
          <div className="flex items-end gap-2 w-full">
            
            {/* Gizli Dosya Inputu */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            <button
              type="button"
              className={`p-2 rounded-xl transition-colors shrink-0 mb-1 cursor-pointer ${
                darkMode ? 'hover:bg-white/10 text-white/50 hover:text-white' : 'hover:bg-black/10 text-black/50 hover:text-black'
              }`}
              onClick={() => fileInputRef.current?.click()}
              title="Dosya Yükle"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <InputField 
              input={input}
              setInput={setInput}
              handleKeyDown={handleKeyDown}
              setIsFocused={setIsFocused}
              loading={loading}
              darkMode={darkMode}
              placeholderText={placeholderText}
            />

            <VoiceControl 
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              setInput={setInput}
              loading={loading}
              darkMode={darkMode}
            />

            {loading ? (
              <button
                type="button"
                title="Durdur"
                onClick={onStop}
                className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 mb-1 cursor-pointer ${
                  darkMode ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
                }`}
              >
                <div className="animate-pulse">
                  <Square className="w-5 h-5 fill-current" />
                </div>
              </button>
            ) : (
              <button
                type="button"
                title="Gönder"
                onClick={handleSendClick}
                disabled={!input.trim() && !selectedFile}
                className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 mb-1 ${
                  !input.trim() && !selectedFile
                    ? 'opacity-30 cursor-default'
                    : `cursor-pointer ${darkMode 
                      ? 'bg-white text-black hover:bg-white/90 hover:scale-105' 
                      : 'bg-black text-white hover:bg-black/90 hover:scale-105'}`
                }`}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        <p className={`text-xs text-center mt-3 transition-colors duration-500 ${
          darkMode ? 'text-white/20' : 'text-black/20'
        }`}>
          Groq {selectedModel ? selectedModel.replace('llama-', 'Llama ').replace('mixtral-', 'Mixtral ') : 'Llama 3.1'}  
        </p>
      </div>
    </div>
  );
}