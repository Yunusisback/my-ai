import { X, FileText } from 'lucide-react';

export default function FilePreview({ selectedFile, previewUrl, clearFile, darkMode }) {

  // Dosya yoksa hiçbir şey gösterme
  if (!selectedFile) return null;

  return (
    <div className={`flex items-center gap-3 p-2 mb-2 mx-1 rounded-xl animate-fadeIn ${
      darkMode ? 'bg-white/10' : 'bg-gray-100'
    }`}>
        
      {/* Resim Önizlemesi veya Dosya İkonu */}
      <div className={`relative w-12 h-12 shrink-0 rounded-lg overflow-hidden flex items-center justify-center ${
        darkMode ? 'bg-black/40' : 'bg-white'
      }`}>
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <FileText className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        )}
      </div>

      {/* Dosya Bilgisi */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium truncate ${darkMode ? 'text-white' : 'text-black'}`}>
          {selectedFile.name}
        </p>
        <p className={`text-[10px] ${darkMode ? 'text-white/50' : 'text-black/50'}`}>
          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>

      {/* Kapat Butonu */}
      <button 
        onClick={clearFile}
        className={`p-1.5 rounded-full transition-colors cursor-pointer ${
          darkMode ? 'hover:bg-white/20 text-white/70' : 'hover:bg-black/10 text-black/70'
        }`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}