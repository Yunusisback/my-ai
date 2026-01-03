export default function SidebarUser({ darkMode, username, onToggleSettings, textMap }) {
  return (
    <div className={`p-4 shrink-0 ${darkMode ? 'border-t border-white/5 bg-[#0a0a0b]' : 'border-t border-zinc-100 bg-white'}`}>
      <button onClick={onToggleSettings} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${darkMode ? 'hover:bg-white/5' : 'hover:bg-zinc-100'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-serif italic shrink-0 ${darkMode ? 'bg-white/10 text-white' : 'bg-zinc-200 text-zinc-800'}`}>
          {username?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{username}</div>
          <div className={`text-xs truncate ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{textMap.freePlan}</div>
        </div>
      </button>
    </div>
  );
}