import { Mic } from 'lucide-react';

export default function VoiceControl({ isRecording, setIsRecording, setInput, loading, darkMode }) {
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'tr-TR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } else {
      alert('Tarayıcınız ses tanıma özelliğini desteklemiyor.');
    }
  };

  return (
    <button
      type="button"
      title="Sesli Komut"
      onClick={handleVoiceInput}
      disabled={loading}
      className={`p-2 rounded-xl transition-colors shrink-0 mb-1 cursor-pointer ${
        isRecording
          ? 'bg-red-500 text-white animate-pulse'
          : darkMode 
            ? 'hover:bg-white/10 text-white/50 hover:text-white' 
            : 'hover:bg-black/10 text-black/50 hover:text-black'
      } disabled:opacity-50`}
    >
      <Mic className="w-5 h-5" />
    </button>
  );
}