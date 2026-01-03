import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pin, Edit2, Trash2, Check, X } from 'lucide-react';


const MenuButton = ({ onClick, icon: Icon, label, darkMode, danger }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl cursor-pointer ${
      danger 
        ? 'text-red-400 hover:bg-red-500/5 hover:text-red-300' 
        : darkMode ? 'text-zinc-300 hover:bg-white/5 hover:text-white' : 'text-zinc-700 hover:bg-zinc-50'
    }`}
  >
    <Icon className="w-3.5 h-3.5 shrink-0" />
    <span className="truncate">{label}</span>
  </button>
);

export default function SidebarItem({ chat, active, onSelect, onDelete, onRenameStart, onPin, textMap, darkMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef(null);

  // Menü dışına tıklandığında kapatma mantığı
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setShowDeleteConfirm(false); 
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleMenuAction = (action, e) => {
    e.stopPropagation(); 
    if (action === 'delete_click') setShowDeleteConfirm(true);
    if (action === 'confirm_delete') onDelete(chat.id);
    if (action === 'rename') { onRenameStart(chat); setIsMenuOpen(false); }
    if (action === 'pin') { onPin(chat.id); setIsMenuOpen(false); }
    if (action === 'cancel_delete') setShowDeleteConfirm(false);
    if (action === 'toggle_menu') { setIsMenuOpen(!isMenuOpen); setShowDeleteConfirm(false); }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => onSelect(chat.id)}
        className={`
          w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-300 whitespace-nowrap cursor-pointer
          ${active 
            ? darkMode ? 'bg-white/10 text-white border border-white/20' : 'bg-zinc-100 text-black border border-zinc-300'
            : darkMode ? 'border border-white/5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200 hover:border-white/10' : 'border border-zinc-100 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-200'
          }
        `}
      >
        {chat.pinned && <Pin className="w-3.5 h-3.5 shrink-0 opacity-60 rotate-45" />}
        <span className="flex-1 text-sm font-medium truncate leading-tight">{chat.title}</span>
      </button>

      {/* Üç Nokta Menü Butonu */}
      <div className={`absolute right-2 top-1/2 -translate-y-1/2 ${active || isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-all duration-300`}>
        <button
          onClick={(e) => handleMenuAction('toggle_menu', e)}
          className={`p-1.5 rounded-xl transition-all duration-300 cursor-pointer ${darkMode ? 'text-zinc-400 hover:text-zinc-200 hover:bg-white/10' : 'text-zinc-500 hover:text-zinc-600 hover:bg-zinc-100'}`}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Açılır Menü (Pin Rename Delete) */}
      {isMenuOpen && (
        <div ref={menuRef} className={`absolute right-0 top-12 w-52 rounded-xl border z-50 overflow-hidden animate-in fade-in duration-300 ${darkMode ? 'bg-[#0a0a0b] border-white/10 backdrop-blur-sm' : 'bg-white border-zinc-200 backdrop-blur-sm'}`}>
          {showDeleteConfirm ? (
            <div className="p-4 flex flex-col gap-3">
              <p className={`text-sm text-center font-semibold leading-relaxed ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                {textMap.confirmDelete}
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={(e) => handleMenuAction('confirm_delete', e)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300 flex items-center justify-center font-medium cursor-pointer"
                >
                  <Check className="w-4 h-4 mr-1.5" /> Evet
                </button>
                <button
                  onClick={(e) => handleMenuAction('cancel_delete', e)}
                  className={`flex-1 px-3 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center font-medium cursor-pointer ${darkMode ? 'bg-white/10 text-zinc-300 hover:bg-white/20' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                >
                  <X className="w-4 h-4 mr-1.5" /> İptal
                </button>
              </div>
            </div>
          ) : (
            <div className="py-1">
              <MenuButton onClick={(e) => handleMenuAction('pin', e)} icon={Pin} label={chat.pinned ? textMap.unpin : textMap.pin} darkMode={darkMode} />
              <MenuButton onClick={(e) => handleMenuAction('rename', e)} icon={Edit2} label={textMap.rename} darkMode={darkMode} />
              <MenuButton onClick={(e) => handleMenuAction('delete_click', e)} icon={Trash2} label={textMap.delete} darkMode={darkMode} danger />
            </div>
          )}
        </div>
      )}
    </div>
  );
}